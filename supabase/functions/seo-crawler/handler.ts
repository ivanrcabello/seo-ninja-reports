
// Request handler for SEO Crawler
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { corsHeaders } from './constants.ts';
import { crawlPage } from './crawler.ts';
import { normalizeUrl } from './utils.ts';

export async function handleRequest(req: Request, supabase: SupabaseClient) {
  console.log('Processing request for SEO Crawler at', new Date().toISOString());
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Returning CORS headers for preflight');
    return new Response(null, {
      headers: corsHeaders
    });
  }
  
  let crawlId: string | null = null;
  
  try {
    if (req.method === 'POST') {
      console.log('Processing POST request for SEO Crawler');
      
      // Parse request body
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
      } catch (e) {
        console.error('Error parsing JSON:', e);
        return new Response(
          JSON.stringify({ error: 'Invalid JSON in request body' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const { url, settings = {} } = requestData;
      crawlId = requestData.crawlId;
      const brightDataUsername = requestData.brightDataUsername || 'brd-customer-hl_cbc2d791-zone-web_unlocker1';
      const brightDataPassword = requestData.brightDataPassword || '5d024usr515b';
      
      console.log(`Parameters received - URL: ${url}, CrawlID: ${crawlId}`);
      console.log(`Bright Data credentials configured: Username available: ${!!brightDataUsername}, Password available: ${!!brightDataPassword}`);
      console.log(`URL validation check: isEmpty=${!url}, isValidURL=${/^https?:\/\//i.test(url)}`);
      
      if (!url || !crawlId) {
        console.error('URL and crawlId are required');
        return new Response(
          JSON.stringify({ error: 'URL and crawlId are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Validate URL format
      if (!url.match(/^https?:\/\//i)) {
        console.error('Invalid URL format (must start with http:// or https://)', url);
        
        // Update crawl status to failed
        try {
          await supabase
            .from('seo_crawler_crawls')
            .update({
              status: 'failed',
              error_message: 'URL inválida. La URL debe comenzar con http:// o https://',
              completed_at: new Date().toISOString()
            })
            .eq('id', crawlId);
        } catch (updateError) {
          console.error('Error updating crawl status:', updateError);
        }
          
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: 'URL inválida. La URL debe comenzar con http:// o https://' 
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Make sure we have credentials
      if (!brightDataPassword) {
        console.error('No Bright Data API key available');
        
        // Update crawl status to failed
        try {
          await supabase
            .from('seo_crawler_crawls')
            .update({
              status: 'failed',
              error_message: 'Bright Data API key is required. Please configure it in Settings -> API Settings -> Value SERP tab.',
              completed_at: new Date().toISOString()
            })
            .eq('id', crawlId);
        } catch (updateError) {
          console.error('Error updating crawl status:', updateError);
        }
          
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: 'Bright Data API key is required. Please configure it in Settings -> API Settings -> Value SERP tab.' 
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Normalize the URL
      const normalizedUrl = normalizeUrl(url);
      console.log(`Normalized URL: ${normalizedUrl}`);
      
      // Check if the URL is accessible with a basic test
      console.log(`Testing URL accessibility: ${normalizedUrl}`);
      let isUrlAccessible = false;
      
      try {
        const testResponse = await fetch(normalizedUrl, {
          method: 'HEAD',
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; SeoAuditBot/1.0)'
          },
          signal: AbortSignal.timeout(5000) // 5 second timeout for the test
        });
        
        console.log(`URL accessibility test response: ${testResponse.status}`);
        isUrlAccessible = testResponse.status < 400;
        
        if (!isUrlAccessible) {
          console.error(`URL accessibility test failed with status ${testResponse.status}`);
          console.log('Will still attempt to use Bright Data as it may be able to access the page');
        }
      } catch (testError) {
        console.error(`URL accessibility test error:`, testError);
        console.log('Will still attempt to use Bright Data as it may be able to access the page');
        // Continue anyway, as this might be a transient error or specific to the test
      }
      
      // Update crawl status to processing
      try {
        await supabase
          .from('seo_crawler_crawls')
          .update({
            status: 'processing',
            started_at: new Date().toISOString()
          })
          .eq('id', crawlId);
          
        console.log(`Updated crawl status to 'processing' for ID: ${crawlId}`);
      } catch (updateError) {
        console.error('Error updating crawl status to processing:', updateError);
      }
      
      // Analyze the page using Bright Data
      console.log('Starting analysis of main page with Bright Data...');
      
      try {
        const mainPage = await crawlPage(
          supabase, 
          normalizedUrl, 
          crawlId, 
          brightDataUsername, 
          brightDataPassword
        );
        
        if (!mainPage) {
          console.error('Could not analyze main page - crawlPage returned null');
          
          // Update crawl status to error
          try {
            await supabase
              .from('seo_crawler_crawls')
              .update({
                status: 'failed',
                error_message: 'Error analyzing the main page. Please check that the URL is accessible and the Bright Data API key is valid.',
                completed_at: new Date().toISOString()
              })
              .eq('id', crawlId);
          } catch (updateError) {
            console.error('Error updating crawl status to failed:', updateError);
          }
            
          return new Response(
            JSON.stringify({ 
              success: false, 
              message: 'Error analyzing the main page. Please check that the URL is accessible and the Bright Data API key is valid.' 
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        console.log('Main page analysis completed successfully');
        console.log(`Results - pageId: ${mainPage.pageId || 'unknown'}, issues: ${mainPage.issues || 0}`);
        
        // Update crawl status to completed
        try {
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
            
          console.log(`Updated crawl status to 'completed' for ID: ${crawlId}`);
        } catch (updateError) {
          console.error('Error updating crawl status to completed:', updateError);
        }
        
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
      } catch (crawlerError) {
        console.error('Error during page crawling:', crawlerError);
        console.error('Stack trace:', crawlerError instanceof Error ? crawlerError.stack : 'No stack trace available');
        
        // Determine a more specific error message
        let errorMessage = 'Unknown error during crawling';
        if (crawlerError instanceof Error) {
          errorMessage = crawlerError.message;
          
          if (crawlerError.message.includes('timeout')) {
            errorMessage = 'Request timeout while fetching the page. The site may be slow or blocking our requests.';
          } else if (crawlerError.message.includes('network')) {
            errorMessage = 'Network error while connecting to the site. The URL may be unreachable.';
          } else if (crawlerError.message.includes('Access Denied') || crawlerError.message.includes('Rejected')) {
            errorMessage = 'The website is blocking our crawler. Try with a different URL or contact support.';
          }
        }
        
        // Update crawl status to error
        try {
          await supabase
            .from('seo_crawler_crawls')
            .update({
              status: 'failed',
              error_message: errorMessage,
              completed_at: new Date().toISOString()
            })
            .eq('id', crawlId);
        } catch (updateError) {
          console.error('Error updating crawl status to failed:', updateError);
        }
          
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: errorMessage
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
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
      if (crawlId) {
        await supabase
          .from('seo_crawler_crawls')
          .update({
            status: 'failed',
            error_message: error instanceof Error ? error.message : 'Unknown server error',
            completed_at: new Date().toISOString()
          })
          .eq('id', crawlId);
          
        console.log(`Updated crawl status to 'failed' for ID: ${crawlId}`);
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
