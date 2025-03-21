
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

// Create Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Value Serp API Key from environment or request
const VS_API_KEY = Deno.env.get('VALUE_SERP_KEY') || '';

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

    console.log(`Calling ValueSerp edge function with query: ${query}`);
    
    // Use API key from request if provided, otherwise use env var
    const valueSerp_API_KEY = apiKey || VS_API_KEY;
    
    // If no API key is available, return error
    if (!valueSerp_API_KEY) {
      console.error('ValueSerp API key not configured');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'ValueSerp API key not configured',
          data: null
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    console.log('API Key available, proceeding with request');

    try {
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
      
      console.log(`Making request to ValueSerp API for query: ${query}`);
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`ValueSerp API error: ${response.status} ${errorText}`);
        throw new Error(`ValueSerp API error: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log('ValueSerp API response received');
      
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
        
        console.log(`Business profile data extracted:`, JSON.stringify(businessData));
        return new Response(
          JSON.stringify({ 
            success: true, 
            data: businessData 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        console.error('No business data found in ValueSerp response');
        throw new Error('No business data found in ValueSerp response');
      }
    } catch (extractError) {
      console.error('Error extracting business data:', extractError.message);
      
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
    console.error('Error processing request:', error.message);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Unknown error',
        data: null
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  }
});
