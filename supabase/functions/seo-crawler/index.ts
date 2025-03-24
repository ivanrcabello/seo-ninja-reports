
// SEO Crawler Edge Function
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

// Create a Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey);

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
    if (req.method === 'POST') {
      console.log('Processing POST request');
      
      // Parse request body
      let requestData;
      try {
        requestData = await req.json();
      } catch (e) {
        console.error('Error parsing JSON:', e);
        return new Response(
          JSON.stringify({ error: 'Invalid JSON in request body' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const { crawlId, url } = requestData;
      
      if (!url || !crawlId) {
        console.error('URL and crawlId are required');
        return new Response(
          JSON.stringify({ error: 'URL and crawlId are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      console.log(`Processing crawl for URL: ${url}, CrawlID: ${crawlId}`);
      
      // Here's where the actual crawling would happen
      // But for now, we'll just simulate success
      
      // Update the crawl status to completed
      const { error: updateError } = await supabase
        .from('seo_crawler_crawls')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          pages_crawled: 1,
          total_pages: 1
        })
        .eq('id', crawlId);
        
      if (updateError) {
        console.error('Error updating crawl status:', updateError);
        return new Response(
          JSON.stringify({ error: `Failed to update crawl status: ${updateError.message}` }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Insert a dummy page for demonstration
      const pageId = crypto.randomUUID();
      const { error: pageError } = await supabase
        .from('seo_crawler_pages')
        .insert({
          id: pageId,
          crawl_id: crawlId,
          url: url,
          status_code: 200,
          title: 'Demo Page Title',
          meta_description: 'This is a demo page for SEO crawler',
          h1: 'Demo H1 Tag',
          level: 0,
          internal_links_count: 5,
          external_links_count: 3,
          content_length: 1500,
          word_count: 300
        });
        
      if (pageError) {
        console.error('Error creating page:', pageError);
      }
      
      // Insert a demo issue
      const { error: issueError } = await supabase
        .from('seo_crawler_issues')
        .insert({
          page_id: pageId,
          crawl_id: crawlId,
          issue_type: 'meta_description_too_short',
          description: 'The meta description is too short',
          severity: 'minor',
          recommended_fix: 'Add a more descriptive meta description'
        });
        
      if (issueError) {
        console.error('Error creating issue:', issueError);
      }
      
      // Insert a demo link
      const { error: linkError } = await supabase
        .from('seo_crawler_links')
        .insert({
          page_id: pageId,
          crawl_id: crawlId,
          url: 'https://example.com',
          anchor_text: 'Example Link',
          is_internal: false,
          is_broken: false,
          status_code: 200,
          follow: true
        });
        
      if (linkError) {
        console.error('Error creating link:', linkError);
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Crawl completed successfully',
          pageId: pageId
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in Edge Function:', error);
    
    // Try to update crawl status to error
    if (req.method === 'POST') {
      try {
        const { crawlId } = await req.json();
        if (crawlId) {
          await supabase
            .from('seo_crawler_crawls')
            .update({
              status: 'failed',
              error_message: error instanceof Error ? error.message : 'Unknown error'
            })
            .eq('id', crawlId);
        }
      } catch (e) {
        console.error('Error reading crawlId from body:', e);
      }
    }
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error',
        stack: error instanceof Error ? error.stack : undefined
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
