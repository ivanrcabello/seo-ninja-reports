
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'
import { BusinessProfileData } from './types.ts';
import { scrapeBusinessProfile } from './scraper.ts';

// Create Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    
    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL not provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`Scraping business data from URL: ${url}`);
    
    // Function to extract data from Google Business profile
    const businessData = await scrapeBusinessProfile(url);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: businessData 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Error processing request' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
