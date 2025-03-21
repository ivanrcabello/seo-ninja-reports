
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
      console.error('Query not provided in request');
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
      
      // Log full response for debugging
      console.log('Full ValueSerp response:', JSON.stringify(data));
      
      // First try to extract from knowledge_graph if available
      if (data.knowledge_graph) {
        console.log('Knowledge graph found in response');
        const kg = data.knowledge_graph;
        
        const businessData = {
          businessName: kg.title || '',
          businessUrl: kg.website || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
          businessHours: extractHoursFromKnowledgeGraph(kg),
          businessAddress: kg.address || '',
          businessCategory: kg.type || '',
          businessPhone: kg.phone || '',
          businessWebsite: kg.website || '',
          businessRating: kg.rating ? parseFloat(kg.rating) : null,
          businessReviewsCount: kg.reviews !== undefined 
            ? parseInt(kg.reviews.replace(/[^0-9]/g, ''), 10) 
            : 0
        };
        
        console.log(`Business profile data extracted from knowledge graph:`, businessData);
        return new Response(
          JSON.stringify({ 
            success: true, 
            data: businessData,
            source: 'knowledge_graph',
            raw_data: kg // Include raw data for debugging and additional fields
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Then try local_results if available
      if (data.local_results && data.local_results.results && data.local_results.results.length > 0) {
        console.log('Local results found:', data.local_results.results.length);
        const business = data.local_results.results[0];
        
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
        
        console.log(`Business profile data extracted from local results:`, businessData);
        return new Response(
          JSON.stringify({ 
            success: true, 
            data: businessData,
            source: 'local_results',
            raw_data: business // Include raw data for debugging and additional fields
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Finally try organic_results if available
      if (data.organic_results && data.organic_results.length > 0) {
        console.log('Organic results found:', data.organic_results.length);
        
        // Find a result that seems business-like (has a rich snippet or sitelinks)
        const potentialBusiness = data.organic_results.find(
          r => r.rich_snippet || r.sitelinks || (r.title && r.title.includes(query))
        ) || data.organic_results[0];
        
        const businessData = {
          businessName: potentialBusiness.title || query,
          businessUrl: potentialBusiness.link || `https://www.google.com/search?q=${encodeURIComponent(query)}`,
          businessHours: {}, 
          businessAddress: potentialBusiness.rich_snippet?.top?.detected_extensions?.address || '',
          businessCategory: potentialBusiness.rich_snippet?.top?.extensions?.find((ext: string) => !ext.includes('://')) || '',
          businessPhone: potentialBusiness.rich_snippet?.top?.detected_extensions?.phone || '',
          businessWebsite: potentialBusiness.link || '',
          businessRating: potentialBusiness.rich_snippet?.top?.detected_extensions?.rating || null,
          businessReviewsCount: potentialBusiness.rich_snippet?.top?.detected_extensions?.reviews_count || 0
        };
        
        console.log(`Basic business data extracted from organic results:`, businessData);
        return new Response(
          JSON.stringify({ 
            success: true, 
            data: businessData,
            source: 'organic_results',
            raw_data: potentialBusiness // Include raw data
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // No usable business data found
      console.error('No business data found in ValueSerp response');
      console.log('Response structure:', JSON.stringify(Object.keys(data)));
      
      // Return raw data with the fallback for future analysis
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'No business data found in ValueSerp response',
          data: getFallbackData(query),
          raw_response: data // Include the raw response for debugging
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
