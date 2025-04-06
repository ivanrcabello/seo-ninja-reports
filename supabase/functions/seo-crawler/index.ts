
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "./cors-headers.ts";
import { crawlPages } from "./crawler.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: {
      // Add the Supabase service role key to bypass RLS
      Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""}`,
    },
  },
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // Get request body
    const body = await req.json();
    
    console.log("SEO Crawler Edge Function Invoked with body:", JSON.stringify(body));
    
    // Extract parameters
    const { crawlId, url, settings, brightDataUsername, brightDataPassword, brightDataApiKey } = body;
    
    if (!crawlId || !url) {
      throw new Error("Missing required parameters: crawlId and url");
    }
    
    // Log the settings
    console.log(`Starting crawl with settings: max_pages=${settings?.max_pages || 'default'}`);

    // Verify we have the service role key to bypass RLS
    if (!Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")) {
      console.warn("Warning: SUPABASE_SERVICE_ROLE_KEY is not set. Crawler may encounter RLS permission issues.");
    }

    // Update crawl record to processing state
    await supabase
      .from('seo_crawler_crawls')
      .update({
        status: 'processing',
        started_at: new Date().toISOString(),
      })
      .eq('id', crawlId);
    
    // Start the crawl process asynchronously
    // This won't block the response but will continue running
    (async () => {
      try {
        await crawlPages(
          supabase, 
          url, 
          crawlId, 
          settings || {
            max_pages: 100,
            exclude_urls: [],
            include_urls: [],
            respect_robots_txt: true,
            user_agent: 'Mozilla/5.0 (compatible; SeoAuditBot/1.0)',
            crawl_sitemap: true,
            follow_links: true,
            max_depth: 3,
            custom_headers: {}
          },
          brightDataUsername,
          brightDataPassword,
          brightDataApiKey
        );
      } catch (error) {
        console.error("Crawl process error:", error);
        
        // Update crawl status to failed
        await supabase
          .from('seo_crawler_crawls')
          .update({
            status: 'failed',
            error_message: error instanceof Error ? error.message : String(error),
            completed_at: new Date().toISOString()
          })
          .eq('id', crawlId);
      }
    })();
    
    // Return immediate success response
    return new Response(
      JSON.stringify({
        success: true,
        message: "Crawl process started successfully and will continue in the background",
        crawlId
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }
});
