
import { corsHeaders } from '../_shared/cors.ts'

// Environment variables
const ENV_API_KEY = Deno.env.get('VALUE_SERP_KEY') || '';

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, apiKey } = await req.json();
    
    if (!query) {
      return new Response(
        JSON.stringify({ success: false, error: 'Query not provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`Processing ValueSerp request for query: "${query}"`);
    
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

    // Create ValueSerp API URL for local business information
    const url = new URL('https://api.valueserp.com/search');
    url.searchParams.append('api_key', valueSerp_API_KEY);
    url.searchParams.append('q', query);
    url.searchParams.append('location', 'Spain');
    url.searchParams.append('gl', 'es');
    url.searchParams.append('hl', 'es');
    url.searchParams.append('google_domain', 'google.es');
    url.searchParams.append('output', 'json');
    url.searchParams.append('include_fields', 'local_results');
    
    console.log(`Making request to ValueSerp API for query: "${query}"`);
    
    // Add timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
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
      
      // For debugging - log the local_results structure
      if (data.local_results) {
        console.log('Local results structure:', JSON.stringify({
          has_results: !!data.local_results.results,
          results_count: data.local_results.results ? data.local_results.results.length : 0
        }));
      } else {
        console.log('No local_results in API response');
      }
      
      // Extract business data from ValueSerp response
      if (data.local_results && data.local_results.results && data.local_results.results.length > 0) {
        const business = data.local_results.results[0];
        
        // Debug the first business result
        console.log('First business result:', JSON.stringify({
          title: business.title || null,
          address: business.address || null,
          type: business.type || null
        }));
        
        const businessData = {
          businessName: business.title || '',
          businessUrl: business.link || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
          businessHours: business.hours || {}, 
          businessAddress: business.address || '',
          businessCategory: business.type || '',
          businessPhone: business.phone || '',
          businessWebsite: business.website || '',
          businessRating: business.rating !== undefined ? parseFloat(business.rating) : null,
          businessReviewsCount: business.reviews !== undefined 
            ? parseInt(business.reviews.replace(/[^0-9]/g, ''), 10) 
            : 0
        };
        
        console.log(`Business profile data extracted: ${JSON.stringify(businessData)}`);
        return new Response(
          JSON.stringify({ 
            success: true, 
            data: businessData 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        console.error('No business data found in ValueSerp response');
        console.log('Full API response:', JSON.stringify(data));
        
        // Return fallback data with error message
        return new Response(
          JSON.stringify({ 
            success: false,
            error: 'No business data found in ValueSerp response',
            data: getFallbackData(query)
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
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
