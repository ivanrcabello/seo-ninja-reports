
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'
import { BusinessProfileData } from '../scrape-business/types.ts';

// Create Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ValueSerp API key from environment variables
const valueSerpApiKey = Deno.env.get('VALUESERP_API_KEY') || '';

// ValueSerp API endpoint
const VALUESERP_API_URL = 'https://api.valueserp.com/search';

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch (e) {
      console.error('Error parsing request body:', e);
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid JSON in request body' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    const { query, place_id, use_configured_key = false } = body;
    
    if (!query && !place_id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Search query or place_id not provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Obtener la API key configurada en settings si se solicita
    let apiKey = valueSerpApiKey;
    
    if (use_configured_key) {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('value_serp_key')
          .eq('id', 1)
          .maybeSingle();
          
        if (!error && data?.value_serp_key) {
          console.log('Using API key from settings');
          apiKey = data.value_serp_key;
        }
      } catch (err) {
        console.error('Error getting API key from settings:', err);
      }
    }
    
    if (!apiKey) {
      console.error('ValueSerp API key not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'ValueSerp API key not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    console.log(`Searching for business data using ValueSerp API: ${query || place_id}`);
    
    // Prepare params for ValueSerp API according to documentation
    const params = new URLSearchParams({
      api_key: apiKey,
      q: query || `place_id:${place_id}`,
      google_domain: 'google.es',
      location: 'Spain',
      gl: 'es',
      hl: 'es',
      search_type: 'places',  // Important: specify places search type
    });

    // Call ValueSerp API
    const response = await fetch(`${VALUESERP_API_URL}?${params.toString()}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('ValueSerp API error:', response.status, errorText);
      throw new Error(`ValueSerp API error: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    console.log('ValueSerp API response received');
    
    // Extract business data from ValueSerp response
    const businessData = extractBusinessDataFromValueSerp(data, query || place_id);
    
    // Store the extracted data in database
    if (businessData.businessName || businessData.businessAddress) {
      try {
        // Check if we already have this business in the database
        const { data: existingProfile, error: fetchError } = await supabase
          .from('business_profiles')
          .select('id')
          .eq('business_name', businessData.businessName)
          .maybeSingle();
          
        if (fetchError) {
          console.error('Error checking for existing profile:', fetchError);
        }
        
        // Format business hours to ensure it's a serializable object
        const formattedHours = businessData.businessHours ? 
          JSON.stringify(businessData.businessHours) : '{}';
        
        const dbOperation = existingProfile?.id ? 
          // Update existing record
          supabase
            .from('business_profiles')
            .update({
              business_name: businessData.businessName,
              business_address: businessData.businessAddress || '',
              business_category: businessData.businessCategory || '',
              business_rating: businessData.businessRating,
              business_reviews_count: businessData.businessReviewsCount || 0,
              business_phone: businessData.businessPhone || '',
              business_website: businessData.businessWebsite || '',
              business_hours: formattedHours,
              business_url: businessData.businessUrl || '',
              data_source: 'valueserp',
              updated_at: new Date().toISOString()
            })
            .eq('id', existingProfile.id) :
          // Insert new record
          supabase
            .from('business_profiles')
            .insert({
              business_name: businessData.businessName,
              business_address: businessData.businessAddress || '',
              business_category: businessData.businessCategory || '',
              business_rating: businessData.businessRating,
              business_reviews_count: businessData.businessReviewsCount || 0,
              business_phone: businessData.businessPhone || '',
              business_website: businessData.businessWebsite || '',
              business_hours: formattedHours,
              business_url: businessData.businessUrl || '',
              data_source: 'valueserp',
              last_scraped_at: new Date().toISOString()
            });
          
        const { error: dbError } = await dbOperation;
          
        if (dbError) {
          console.error('Error storing business data:', dbError);
        } else {
          console.log('Business data stored successfully');
        }
      } catch (dbError) {
        console.error('Error accessing database:', dbError);
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: businessData,
        raw_data: data // Include raw data for debugging or additional processing
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error processing ValueSerp request:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Error processing ValueSerp request'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

// Function to extract business data from ValueSerp response
function extractBusinessDataFromValueSerp(data: any, searchQuery: string): BusinessProfileData {
  const businessData: BusinessProfileData = {
    businessUrl: '',
    businessHours: {}
  };
  
  // Extract place data from places_results which is the correct field for places search
  if (data.places_results && data.places_results.length > 0) {
    const place = data.places_results[0]; // Use the first (most relevant) result
    
    businessData.businessName = place.title || '';
    businessData.businessAddress = place.address || '';
    businessData.businessCategory = place.type || '';
    businessData.businessPhone = place.phone || '';
    businessData.businessWebsite = place.website || '';
    
    if (place.rating) {
      businessData.businessRating = parseFloat(place.rating) || null;
    }
    
    if (place.reviews) {
      businessData.businessReviewsCount = parseInt(place.reviews) || 0;
    }
    
    // Extract hours if available
    if (place.hours && typeof place.hours === 'object') {
      businessData.businessHours = place.hours;
    } else if (place.hours_table && Array.isArray(place.hours_table)) {
      const hoursObj: Record<string, string> = {};
      place.hours_table.forEach((item: any) => {
        if (item.day && item.hours) {
          hoursObj[item.day] = item.hours;
        }
      });
      businessData.businessHours = hoursObj;
    }
    
    // URL might be in the place_id or directions link
    businessData.businessUrl = place.place_id 
      ? `https://www.google.com/maps/place/?q=place_id:${place.place_id}` 
      : (place.directions || '');
  } 
  // Fallback to knowledge_graph if available
  else if (data.knowledge_graph) {
    const kg = data.knowledge_graph;
    
    businessData.businessName = kg.title || '';
    businessData.businessAddress = kg.address || '';
    businessData.businessCategory = kg.type || '';
    businessData.businessPhone = kg.phone || '';
    businessData.businessWebsite = kg.website || '';
    
    if (kg.rating) {
      businessData.businessRating = parseFloat(kg.rating) || null;
    }
    
    if (kg.reviews) {
      const reviewsMatch = kg.reviews.match(/\d+/);
      businessData.businessReviewsCount = reviewsMatch ? parseInt(reviewsMatch[0]) : 0;
    }
    
    // Extract hours if available
    if (kg.hours && Array.isArray(kg.hours)) {
      const hoursObj: Record<string, string> = {};
      kg.hours.forEach((item: string) => {
        // Parse hours like "Monday: 9 AM - 5 PM"
        const match = item.match(/([^:]+):\s*(.*)/);
        if (match && match.length >= 3) {
          hoursObj[match[1].trim()] = match[2].trim();
        }
      });
      businessData.businessHours = hoursObj;
    }
    
    // URL might be in the knowledge graph
    businessData.businessUrl = kg.google_map_url || '';
  }
  // Fallback to local_results if available
  else if (data.local_results && data.local_results.results && data.local_results.results.length > 0) {
    const result = data.local_results.results[0]; // Use the first (most relevant) result
    
    businessData.businessName = result.title || '';
    businessData.businessAddress = result.address || '';
    businessData.businessPhone = result.phone || '';
    businessData.businessWebsite = result.website || '';
    
    if (result.rating) {
      businessData.businessRating = parseFloat(result.rating) || null;
    }
    
    if (result.reviews) {
      businessData.businessReviewsCount = parseInt(result.reviews) || 0;
    }
    
    // URL might be in the place_id or directions link
    businessData.businessUrl = result.place_id 
      ? `https://www.google.com/maps/place/?q=place_id:${result.place_id}` 
      : (result.directions || '');
  }
  
  // If no URL was found, create a generic one from the search query
  if (!businessData.businessUrl && searchQuery) {
    businessData.businessUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`;
  }

  // Ensure all fields have valid values
  if (businessData.businessRating === undefined) {
    businessData.businessRating = null;
  }
  
  if (businessData.businessReviewsCount === undefined) {
    businessData.businessReviewsCount = 0;
  }
  
  return businessData;
}
