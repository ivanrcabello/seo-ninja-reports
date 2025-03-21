
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
    const { query, place_id } = await req.json();
    
    if (!query && !place_id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Search query or place_id not provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    if (!valueSerpApiKey) {
      console.error('ValueSerp API key not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'ValueSerp API key not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    console.log(`Searching for business data using ValueSerp API: ${query || place_id}`);
    
    // Prepare params for ValueSerp API
    const params = new URLSearchParams({
      api_key: valueSerpApiKey,
      q: query || `place_id:${place_id}`,
      google_domain: 'google.com',
      location: 'Spain',
      gl: 'es',
      hl: 'es',
      output: 'json',
      include_fields: 'local_results,knowledge_graph',
    });

    // Call ValueSerp API
    const response = await fetch(`${VALUESERP_API_URL}?${params.toString()}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('ValueSerp API error:', response.status, errorText);
      throw new Error(`ValueSerp API error: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    console.log('ValueSerp API response:', JSON.stringify(data, null, 2));
    
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
  
  // Try to extract from knowledge graph first (most detailed)
  if (data.knowledge_graph) {
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
  
  // If no data from knowledge graph, try local results
  if ((!businessData.businessName || !businessData.businessAddress) && 
      data.local_results && data.local_results.results) {
    
    // Find the most relevant result
    const results = data.local_results.results;
    if (results.length > 0) {
      const result = results[0]; // Use the first (most relevant) result
      
      businessData.businessName = businessData.businessName || result.title || '';
      businessData.businessAddress = businessData.businessAddress || result.address || '';
      businessData.businessPhone = businessData.businessPhone || result.phone || '';
      businessData.businessWebsite = businessData.businessWebsite || result.website || '';
      
      if (!businessData.businessRating && result.rating) {
        businessData.businessRating = parseFloat(result.rating) || null;
      }
      
      if (!businessData.businessReviewsCount && result.reviews) {
        businessData.businessReviewsCount = parseInt(result.reviews) || 0;
      }
      
      // URL might be in the place_id or directions link
      businessData.businessUrl = businessData.businessUrl || result.place_id 
        ? `https://www.google.com/maps/place/?q=place_id:${result.place_id}` 
        : (result.directions || '');
    }
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
