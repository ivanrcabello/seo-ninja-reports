
// Request handler for SEO crawler edge function
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { Request, Response } from "https://deno.land/std@0.177.0/http/server.ts";
import { crawlPage } from "./crawler.ts";
import { normalizeUrl } from "./utils.ts";

// Define CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Handle crawl request
 */
export async function handleRequest(req: Request, supabase: any): Promise<Response> {
  // Get request data
  let requestData;
  try {
    requestData = await req.json();
    console.log('Request data received:', JSON.stringify({
      url: requestData.url,
      crawlId: requestData.crawlId,
      settingsReceived: !!requestData.settings,
      brightDataCredentialsReceived: {
        username: !!requestData.brightDataUsername,
        password: !!requestData.brightDataPassword
      }
    }));
  } catch (error) {
    console.error('Error parsing request data:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Invalid request data format' 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }

  // Validate required parameters
  const { url, crawlId } = requestData;
  if (!url || !crawlId) {
    console.error('Missing required parameters:', { url, crawlId });
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Missing required parameters: url, crawlId' 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }

  // Log parameters
  console.log(`Parameters received - URL: ${url}, CrawlID: ${crawlId}`);
  
  // Get Bright Data credentials from request or environment
  const brightDataUsername = requestData.brightDataUsername || Deno.env.get("BRIGHT_DATA_USERNAME");
  const brightDataPassword = requestData.brightDataPassword || Deno.env.get("BRIGHT_DATA_PASSWORD");
  
  console.log(`Bright Data credentials configured: Username available: ${!!brightDataUsername}, Password available: ${!!brightDataPassword}`);

  // Validate URL format
  try {
    // Simple URL validation
    const isEmpty = !url || url.trim() === '';
    const urlPattern = /^(https?:\/\/)?([a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,})(:[0-9]{1,5})?(\/.*)?$/i;
    const isValidURL = urlPattern.test(url);
    const matches = url.match(urlPattern);
    
    console.log(`URL validation check: isEmpty=${isEmpty}, isValidURL=${isValidURL},${matches ? matches.join(',') : 'no matches'}`);
    
    if (isEmpty || !isValidURL) {
      console.error('Invalid URL format:', url);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid URL format' 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    
    // Normalize URL
    const normalizedUrl = normalizeUrl(url);
    console.log(`Normalized URL: ${normalizedUrl}`);
    
    // Test if URL is accessible directly before crawling
    try {
      console.log(`Testing URL accessibility: ${normalizedUrl}`);
      const testResponse = await fetch(normalizedUrl, {
        method: 'HEAD',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        redirect: 'follow',
        signal: AbortSignal.timeout(10000)
      });
      
      console.log(`URL accessibility test response: ${testResponse.status}`);
      
      if (testResponse.status >= 400) {
        console.warn(`URL returned status ${testResponse.status}, but we'll still try to crawl it with Bright Data`);
      }
    } catch (testError) {
      console.warn(`Error testing URL accessibility: ${testError.message}, but we'll still try to crawl it with Bright Data`);
    }

    // Update crawl status to 'processing' immediately
    try {
      const { error: updateError } = await supabase
        .from('seo_crawler_crawls')
        .update({ 
          status: 'processing',
          started_at: new Date().toISOString()
        })
        .eq('id', crawlId);
      
      if (updateError) {
        console.error('Error updating crawl status:', updateError);
      } else {
        console.log(`Updated crawl status to 'processing' for ID: ${crawlId}`);
      }
    } catch (dbError) {
      console.error('Database error updating crawl status:', dbError);
    }

    // Start the crawl process
    console.log(`Starting analysis of main page with Bright Data...`);
    const pageResult = await crawlPage(
      supabase, 
      normalizedUrl, 
      crawlId,
      brightDataUsername,
      brightDataPassword
    );
    
    if (!pageResult) {
      console.error('Could not analyze main page - crawlPage returned null');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Could not analyze main page - see logs for details' 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Crawl completed successfully',
        crawlId,
        pagesCrawled: 1,
        issues: pageResult.issues || 0
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error(`Error in crawl process: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error(`Stack trace: ${error instanceof Error ? error.stack : 'No stack trace'}`);
    
    // Update crawl status to 'failed'
    try {
      const { error: updateError } = await supabase
        .from('seo_crawler_crawls')
        .update({ 
          status: 'failed',
          error_message: error instanceof Error ? error.message : String(error),
          completed_at: new Date().toISOString()
        })
        .eq('id', crawlId);
      
      if (updateError) {
        console.error('Error updating crawl status to failed:', updateError);
      }
    } catch (dbError) {
      console.error('Database error updating crawl status to failed:', dbError);
    }
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Error in crawl process: ${error instanceof Error ? error.message : 'Unknown error'}` 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}
