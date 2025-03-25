
// Request handler for SEO Crawler
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { corsHeaders } from './constants.ts';
import { crawlPage } from './crawler.ts';
import { normalizeUrl } from './utils.ts';

export async function handleRequest(req: Request, supabase: SupabaseClient) {
  console.log('Processing request for SEO Crawler');
  
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
      
      const { url, crawlId, settings = {} } = requestData;
      let brightDataUsername = requestData.brightDataUsername;
      let brightDataPassword = requestData.brightDataPassword;
      
      console.log(`Parameters received - URL: ${url}, CrawlID: ${crawlId}`);
      console.log(`Bright Data credentials received: ${brightDataUsername ? 'Yes' : 'No'}, ${brightDataPassword ? 'Yes' : 'No'}`);
      
      if (!url || !crawlId) {
        console.error('URL and crawlId are required');
        return new Response(
          JSON.stringify({ error: 'URL and crawlId are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Fallback to environment variables if credentials not provided in request
      if (!brightDataUsername) {
        brightDataUsername = Deno.env.get('BRIGHT_DATA_USERNAME') || '';
        console.log(`Using environment variable for Bright Data username: ${brightDataUsername ? 'Available' : 'Not available'}`);
      }
      
      if (!brightDataPassword) {
        brightDataPassword = Deno.env.get('BRIGHT_DATA_PASSWORD') || '';
        console.log(`Using environment variable for Bright Data password: ${brightDataPassword ? 'Available' : 'Not available'}`);
      }
      
      if (!brightDataPassword) {
        console.error('No Bright Data API key available');
        return new Response(
          JSON.stringify({ 
            error: 'Bright Data API key is required. Please configure it in Settings -> API Settings -> Value SERP tab.' 
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Normalize the URL
      const normalizedUrl = normalizeUrl(url);
      console.log(`Normalized URL: ${normalizedUrl}`);
      
      // Update crawl status to processing
      await supabase
        .from('seo_crawler_crawls')
        .update({
          status: 'processing',
          started_at: new Date().toISOString()
        })
        .eq('id', crawlId);
      
      // Analyze the page using Bright Data
      console.log('Starting analysis of main page with Bright Data...');
      
      const mainPage = await crawlPage(supabase, normalizedUrl, crawlId, brightDataUsername, brightDataPassword);
      
      if (!mainPage) {
        console.error('Could not analyze main page');
        
        // Update crawl status to error
        await supabase
          .from('seo_crawler_crawls')
          .update({
            status: 'failed',
            error_message: 'Error analyzing the main page',
            completed_at: new Date().toISOString()
          })
          .eq('id', crawlId);
          
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: 'Error analyzing the main page. Check that the URL is accessible and the proxy configuration is correct.'
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      console.log('Main page analysis completed successfully');
      console.log(`Results - pageId: ${mainPage.pageId}, issues: ${mainPage.issues}`);
      
      // Update crawl status to completed
      await supabase
        .from('seo_crawler_crawls')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          pages_crawled: 1,
          total_pages: 1,
          total_issues: mainPage.issues || 0
        })
        .eq('id', crawlId);
      
      console.log('Sending successful response');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Page analyzed correctly',
          pageId: mainPage.pageId,
          issuesCount: mainPage.issues
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.error('Method not allowed:', req.method);
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in function:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace available');
    
    // Try to update crawl status to error
    try {
      if (req.method === 'POST') {
        try {
          const { crawlId } = await req.json();
          if (crawlId) {
            await supabase
              .from('seo_crawler_crawls')
              .update({
                status: 'failed',
                error_message: error instanceof Error ? error.message : 'Unknown error',
                completed_at: new Date().toISOString()
              })
              .eq('id', crawlId);
          }
        } catch (e) {
          console.error('Error reading crawlId from body:', e);
        }
      }
    } catch (e) {
      console.error('Error updating crawl status to error:', e);
    }
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error',
        stack: error instanceof Error ? error.stack : undefined,
        code: 'INTERNAL_SERVER_ERROR'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
