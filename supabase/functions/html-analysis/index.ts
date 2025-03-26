
// Main HTML analysis module - entry point
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { extractHeadings } from "./extract-headings.ts";

// Create Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Constants
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Handle CORS preflight request
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }
  
  try {
    const { pageId, html, crawlId } = await req.json();
    
    if (!pageId || !html || !crawlId) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters: pageId, html, crawlId" }),
        { headers: { ...CORS_HEADERS, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // Extract headings from HTML
    const headings = extractHeadings(html);
    console.log(`Extracted ${headings.length} headings from HTML`);
    
    // Save headings to database
    if (headings.length > 0) {
      const formattedHeadings = headings.map((heading, index) => ({
        crawl_id: crawlId,
        page_id: pageId,
        heading_type: heading.type,
        content: heading.content,
        position: index
      }));
      
      const { error } = await supabase
        .from('seo_crawler_headings')
        .insert(formattedHeadings);
        
      if (error) {
        console.error('Error inserting headings:', error);
        return new Response(
          JSON.stringify({ error: error.message, details: error.details }),
          { headers: { ...CORS_HEADERS, "Content-Type": "application/json" }, status: 500 }
        );
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        headings: headings,
        message: `Successfully extracted and saved ${headings.length} headings` 
      }),
      { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error('Error in HTML analysis function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...CORS_HEADERS, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
