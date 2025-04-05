
// Main Supabase Edge Function for SEO Crawler
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { crawlPage } from "./crawler.ts";
import { handleRequest } from "./handler.ts";

// Define CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Create Supabase client
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    console.log("SEO Crawler function invoked");
    console.log("Function version: 1.0.1"); // Version tracking for debugging
    
    // Use the dedicated handler function
    return await handleRequest(req, supabase);
  } catch (error) {
    console.error(`Error in SEO crawler function: ${error.message}`);
    console.error(`Stack trace: ${error.stack || 'No stack trace'}`);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Error in SEO crawler function: ${error.message}` 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
