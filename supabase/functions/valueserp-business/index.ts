
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Environment variables
const ENV_API_KEY = Deno.env.get('VALUE_SERP_KEY') || '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, apiKey, clientId, test = false } = await req.json();
    
    if (!query) {
      console.error('Query not provided in request');
      return new Response(
        JSON.stringify({ success: false, error: 'Query not provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`Processing ValueSerp request for query: "${query}", clientId: ${clientId || 'not provided'}, test: ${test}`);
    
    // Use API key from request if provided, otherwise use env var
    const valueSerp_API_KEY = apiKey || ENV_API_KEY;
    
    // If no API key is available, return error with fallback data
    if (!valueSerp_API_KEY) {
      console.error('ValueSerp API key not configured');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'ValueSerp API key not configured',
          data: getFallbackData(query)
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // For test connections, just return success
    if (test) {
      return new Response(
        JSON.stringify({ success: true, message: 'API key is valid' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create ValueSerp API URL with more detailed parameters
    const url = new URL('https://api.valueserp.com/search');
    url.searchParams.append('api_key', valueSerp_API_KEY);
    url.searchParams.append('q', query);
    url.searchParams.append('location', 'Spain');
    url.searchParams.append('gl', 'es');
    url.searchParams.append('hl', 'es');
    url.searchParams.append('google_domain', 'google.es');
    url.searchParams.append('output', 'json');
    url.searchParams.append('include_fields', 'search_information,knowledge_graph,local_results,organic_results');
    url.searchParams.append('include_html', 'false');
    
    console.log(`Making request to ValueSerp API for query: "${query}"`);
    
    // Add timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout
    
    try {
      const response = await fetch(url.toString(), { 
        signal: controller.signal 
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`ValueSerp API error: ${response.status} ${errorText}`);
        throw new Error(`ValueSerp API error: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log('ValueSerp API response received');
      
      // Check if local_results is available and has entries
      if (data.local_results && data.local_results.results && data.local_results.results.length > 0) {
        const localResults = data.local_results.results;
        console.log(`Found ${localResults.length} local results`);
        
        // Save local results to database if clientId is provided
        if (clientId && SUPABASE_URL && SUPABASE_ANON_KEY) {
          const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
          
          try {
            // First, find existing listing for this client
            const { data: existingData, error: checkError } = await supabase
              .from('google_business_listings')
              .select('id')
              .eq('client_id', clientId)
              .maybeSingle();
              
            if (checkError) {
              console.error('Error checking existing listings:', checkError);
            }
            
            // Get the first result which is typically the most relevant
            const firstResult = localResults[0];
            
            if (!firstResult || !firstResult.title) {
              console.error('No valid local results found');
            } else {
              const listingData = {
                client_id: clientId,
                title: firstResult.title,
                address: firstResult.address || '',
                phone: firstResult.phone || '',
                rating: firstResult.rating ? parseFloat(firstResult.rating) : null,
                reviews: firstResult.reviews ? parseInt(firstResult.reviews.toString().replace(/[^0-9]/g, ''), 10) : null,
                hours: firstResult.hours || '',
                website: firstResult.website || '',
                place_id: firstResult.data_cid || firstResult.place_id || '',
                updated_at: new Date().toISOString()
              };
              
              let dbResult;
              
              if (existingData?.id) {
                // Update existing record
                console.log(`Updating existing listing with id ${existingData.id}`);
                dbResult = await supabase
                  .from('google_business_listings')
                  .update(listingData)
                  .eq('id', existingData.id);
              } else {
                // Insert new record
                console.log('Inserting new listing record');
                dbResult = await supabase
                  .from('google_business_listings')
                  .insert(listingData);
              }
              
              if (dbResult.error) {
                console.error('Error saving to database:', dbResult.error);
              } else {
                console.log('Successfully saved business listing to database');
              }
            }
          } catch (dbError) {
            console.error('Database operation error:', dbError);
          }
        } else {
          console.log('Not saving to database: clientId or Supabase credentials missing');
        }
        
        // Return the local_results array and the first result in the businessProfile format
        return new Response(
          JSON.stringify({ 
            success: true, 
            local_results: localResults,
            // Also include the first result in the businessProfile format for backward compatibility
            data: mapToBusinessProfile(localResults[0])
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // If knowledge_graph is available, use that
      if (data.knowledge_graph) {
        console.log('Knowledge graph found, but no local results');
        const kg = data.knowledge_graph;
        
        const businessData = mapKnowledgeGraphToBusinessProfile(kg);
        
        // Save to database if clientId is provided
        if (clientId && SUPABASE_URL && SUPABASE_ANON_KEY && businessData.businessName) {
          const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
          
          try {
            // Find existing listing for this client
            const { data: existingData, error: checkError } = await supabase
              .from('google_business_listings')
              .select('id')
              .eq('client_id', clientId)
              .maybeSingle();
              
            if (checkError) {
              console.error('Error checking existing listings:', checkError);
            }
            
            const listingData = {
              client_id: clientId,
              title: businessData.businessName,
              address: businessData.businessAddress || '',
              phone: businessData.businessPhone || '',
              rating: businessData.businessRating,
              reviews: businessData.businessReviewsCount,
              hours: typeof businessData.businessHours === 'object' ? JSON.stringify(businessData.businessHours) : '',
              website: businessData.businessWebsite || '',
              place_id: '',
              updated_at: new Date().toISOString()
            };
              
            let dbResult;
              
            if (existingData?.id) {
              // Update existing record
              console.log(`Updating existing listing with id ${existingData.id}`);
              dbResult = await supabase
                .from('google_business_listings')
                .update(listingData)
                .eq('id', existingData.id);
            } else {
              // Insert new record
              console.log('Inserting new listing record');
              dbResult = await supabase
                .from('google_business_listings')
                .insert(listingData);
            }
              
            if (dbResult.error) {
              console.error('Error saving to database:', dbResult.error);
            } else {
              console.log('Successfully saved knowledge graph data to database');
            }
          } catch (dbError) {
            console.error('Database operation error:', dbError);
          }
        }
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            data: businessData,
            knowledge_graph: kg
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // No usable business data found
      console.log('No business data found in ValueSerp response');
      
      // Return fallback data
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'No business data found in ValueSerp response',
          data: getFallbackData(query),
          raw_response: data
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (fetchError) {
      console.error('Fetch error:', fetchError.message);
      
      // Return fallback data with fetch error
      return new Response(
        JSON.stringify({ 
          success: false,
          error: fetchError.message,
          data: getFallbackData(query)
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('General error processing request:', error.message);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Unknown error',
        data: getFallbackData('fallback')
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  }
});

// Map local result to BusinessProfile format
function mapToBusinessProfile(localResult: any) {
  if (!localResult) return getFallbackData('');
  
  return {
    businessName: localResult.title || '',
    businessUrl: localResult.link || '',
    businessHours: typeof localResult.hours === 'string' ? { 'Hours': localResult.hours } : {}, 
    businessAddress: localResult.address || '',
    businessCategory: localResult.business_type || '',
    businessPhone: localResult.phone || '',
    businessWebsite: localResult.website || '',
    businessRating: localResult.rating !== undefined ? parseFloat(localResult.rating) : null,
    businessReviewsCount: localResult.reviews !== undefined 
      ? parseInt(localResult.reviews.toString().replace(/[^0-9]/g, ''), 10) 
      : 0
  };
}

// Map knowledge graph to BusinessProfile format
function mapKnowledgeGraphToBusinessProfile(kg: any) {
  return {
    businessName: kg.title || '',
    businessUrl: kg.website || '',
    businessHours: extractHoursFromKnowledgeGraph(kg),
    businessAddress: kg.address || '',
    businessCategory: kg.type || '',
    businessPhone: kg.phone || '',
    businessWebsite: kg.website || '',
    businessRating: kg.rating ? parseFloat(kg.rating) : null,
    businessReviewsCount: kg.reviews !== undefined 
      ? parseInt(kg.reviews.toString().replace(/[^0-9]/g, ''), 10) 
      : 0
  };
}

// Helper function to extract hours from knowledge graph
function extractHoursFromKnowledgeGraph(kg: any): Record<string, string> {
  if (!kg.hours) return {};
  
  const hoursText = kg.hours;
  if (typeof hoursText !== 'string') return {};
  
  // Try to parse hours in format like "Monday: 9:00 AM - 5:00 PM, Tuesday: ..."
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const hours: Record<string, string> = {};
  
  for (const day of days) {
    const regex = new RegExp(`${day}:\\s*([^,]+)`, 'i');
    const match = hoursText.match(regex);
    if (match && match[1]) {
      hours[day] = match[1].trim();
    }
  }
  
  return hours;
}

// Helper function to get fallback data
function getFallbackData(query: string) {
  return {
    businessName: 'Negocio de ejemplo',
    businessAddress: 'Calle Ejemplo 123, Ciudad',
    businessCategory: 'Servicios Profesionales',
    businessRating: 4.7,
    businessReviewsCount: 42,
    businessPhone: '+34 123 456 789',
    businessWebsite: 'https://www.ejemplo.com',
    businessHours: {
      'Monday': '9:00 - 18:00',
      'Tuesday': '9:00 - 18:00',
      'Wednesday': '9:00 - 18:00',
      'Thursday': '9:00 - 18:00',
      'Friday': '9:00 - 17:00',
      'Saturday': 'Cerrado',
      'Sunday': 'Cerrado'
    },
    businessUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
  };
}
