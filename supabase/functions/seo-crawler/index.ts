
// SEO Crawler Edge Function
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { handleRequest } from './handler.ts';

// Create a Supabase client with service role key to bypass RLS policies
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Set up CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Received request for SEO Crawler');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Returning CORS headers for preflight');
    return new Response(null, {
      headers: corsHeaders
    });
  }
  
  try {
    // Delegate actual request handling to handler.ts
    return await handleRequest(req, supabase);
  } catch (error) {
    console.error('Unhandled error in Edge Function:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace available');
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Error interno del servidor',
        stack: error instanceof Error ? error.stack : undefined,
        code: 'INTERNAL_SERVER_ERROR'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
