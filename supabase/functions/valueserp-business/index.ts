
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

// Create Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Value Serp API Key
const VS_API_KEY = Deno.env.get('VALUE_SERP_KEY') || '';

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    
    if (!query) {
      return new Response(
        JSON.stringify({ success: false, error: 'Query not provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`Calling ValueSerp edge function with query: ${query}`);
    
    // If no API key is available, return error
    if (!VS_API_KEY) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'ValueSerp API key not configured' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Function to extract business data using ValueSerp
    const extractBusinessInfo = async (query: string) => {
      console.log(`Extracting information with ValueSerp for query: ${query}`);
      
      try {
        // Create ValueSerp API URL for local business information
        const url = new URL('https://api.valueserp.com/search');
        url.searchParams.append('api_key', VS_API_KEY);
        url.searchParams.append('q', query);
        url.searchParams.append('location', 'Spain');
        url.searchParams.append('gl', 'es');
        url.searchParams.append('hl', 'es');
        url.searchParams.append('google_domain', 'google.es');
        url.searchParams.append('output', 'json');
        url.searchParams.append('include_fields', 'local_results');
        
        const response = await fetch(url.toString());
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`ValueSerp API error: ${response.status} ${errorText}`);
        }
        
        const data = await response.json();
        
        // Extract business data from ValueSerp response
        if (data.local_results && data.local_results.results && data.local_results.results.length > 0) {
          const business = data.local_results.results[0];
          
          const businessData = {
            businessName: business.title || '',
            businessUrl: business.link || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
            businessHours: {}, // ValueSerp doesn't provide hours directly
            businessAddress: business.address || '',
            businessCategory: business.type || '',
            businessPhone: business.phone || '',
            businessWebsite: business.website || '',
            businessRating: business.rating !== undefined ? parseFloat(business.rating) : null,
            businessReviewsCount: business.reviews !== undefined ? parseInt(business.reviews.replace(/[^0-9]/g, ''), 10) : 0
          };
          
          console.log(`Business profile data extracted via ValueSerp:`, businessData);
          return businessData;
        } else {
          throw new Error('No business data found in ValueSerp response');
        }
      } catch (error) {
        console.error('Error extracting business info with ValueSerp:', error);
        throw error;
      }
    };
    
    try {
      const businessData = await extractBusinessInfo(query);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: businessData 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (extractError) {
      console.error('Error extracting business data:', extractError);
      
      // Return fallback data to prevent UI issues
      const fallbackData = {
        businessName: 'Negocio de ejemplo',
        businessAddress: '',
        businessCategory: '',
        businessRating: null,
        businessReviewsCount: 0,
        businessPhone: '',
        businessWebsite: '',
        businessHours: {},
        businessUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
      };
      
      return new Response(
        JSON.stringify({ 
          success: false,
          error: extractError.message,
          data: fallbackData
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Unknown error'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
