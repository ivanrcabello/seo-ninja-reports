
// Main Supabase Edge Function for SEO Crawler
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { crawlPage } from "./crawler.ts";

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
    
    // Get request body
    const requestData = await req.json();
    console.log("Request data:", JSON.stringify(requestData));
    
    const { crawlId, url, settings, brightDataUsername, brightDataPassword } = requestData;
    
    if (!crawlId || !url) {
      console.error("Missing required parameters: crawlId and url are required");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Missing required parameters: crawlId and url are required" 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    
    console.log(`Starting SEO crawl for: ${url} (crawlId: ${crawlId})`);
    
    // Mark crawl as processing
    const { error: updateError } = await supabase
      .from('seo_crawler_crawls')
      .update({ 
        status: 'processing',
        started_at: new Date().toISOString()
      })
      .eq('id', crawlId);
      
    if (updateError) {
      console.error("Error updating crawl status:", updateError);
    }
    
    // Start async crawl process
    crawlPage(supabase, url, crawlId, brightDataUsername, brightDataPassword)
      .then(async (result) => {
        console.log(`Crawl finished for URL: ${url}`);
        console.log(`Result: ${result ? 'Success' : 'Failed'}`);
        
        // Update crawl status to completed
        if (result) {
          const { error } = await supabase
            .from('seo_crawler_crawls')
            .update({
              status: 'completed',
              completed_at: new Date().toISOString(),
              pages_crawled: 1,
              total_pages: 1
            })
            .eq('id', crawlId);
            
          if (error) {
            console.error("Error updating crawl status to completed:", error);
          }
        } else {
          const { error } = await supabase
            .from('seo_crawler_crawls')
            .update({
              status: 'failed',
              completed_at: new Date().toISOString(),
              error_message: 'Failed to crawl page'
            })
            .eq('id', crawlId);
            
          if (error) {
            console.error("Error updating crawl status to failed:", error);
          }
        }
      })
      .catch(async (error) => {
        console.error("Error during crawl:", error);
        
        // Update crawl status to failed
        const { error: updateError } = await supabase
          .from('seo_crawler_crawls')
          .update({
            status: 'failed',
            completed_at: new Date().toISOString(),
            error_message: `Crawl failed: ${error.message || 'Unknown error'}`
          })
          .eq('id', crawlId);
          
        if (updateError) {
          console.error("Error updating crawl status to failed:", updateError);
        }
      });
    
    // Return immediate response to avoid timeout
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "SEO crawler started successfully. Processing in background." 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error(`Error in SEO crawler function: ${error.message}`);
    
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
