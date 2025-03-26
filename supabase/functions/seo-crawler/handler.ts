
// Main SEO Crawler handler
import { corsHeaders } from './constants.ts';
import { crawlPage } from './crawler.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { normalizeUrl } from './utils.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';

export async function handleRequest(req: Request): Promise<Response> {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Returning CORS headers for preflight');
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    console.log('Processing request for SEO Crawler at ' + new Date().toISOString());
    
    // Only allow POST requests for this endpoint
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({
        success: false,
        message: 'This endpoint only accepts POST requests'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405
      });
    }
    
    console.log('Processing POST request for SEO Crawler');
    
    // Parse request body
    const requestData = await req.json();
    console.log(`Request data received: ${JSON.stringify({
      url: requestData.url,
      crawlId: requestData.crawlId,
      settingsReceived: !!requestData.settings,
      brightDataCredentialsReceived: {
        username: !!requestData.brightDataUsername,
        password: !!requestData.brightDataPassword
      }
    })}`);
    
    // Validate required parameters
    if (!requestData.url || !requestData.crawlId) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Missing required parameters: url and crawlId are required'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      });
    }
    
    console.log(`Parameters received - URL: ${requestData.url}, CrawlID: ${requestData.crawlId}`);
    
    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Check Bright Data credentials
    console.log(`Bright Data credentials configured: Username available: ${!!requestData.brightDataUsername}, Password available: ${!!requestData.brightDataPassword}`);
    if (!requestData.brightDataUsername || !requestData.brightDataPassword) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Missing Bright Data credentials. Please add them in Settings.'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      });
    }
    
    // Check URL validity
    const isEmpty = !requestData.url || requestData.url.trim() === '';
    const isValidURL = !isEmpty && requestData.url.match(/^(https?:\/\/)?([a-z0-9-]+\.)+[a-z0-9]{2,}(\/.*)?$/i);
    console.log(`URL validation check: isEmpty=${isEmpty}, isValidURL=${isValidURL}`);
    
    if (isEmpty || !isValidURL) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Invalid URL. Please provide a valid website URL.'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      });
    }
    
    // Normalize URL
    const normalizedUrl = normalizeUrl(requestData.url);
    console.log(`Normalized URL: ${normalizedUrl}`);
    
    // Check if URL is accessible
    try {
      console.log(`Testing URL accessibility: ${normalizedUrl}`);
      const test = await fetch(normalizedUrl, {
        method: 'HEAD',
        redirect: 'follow',
      });
      console.log(`URL accessibility test response: ${test.status}`);
      
      if (test.status >= 400) {
        return new Response(JSON.stringify({
          success: false,
          message: `The URL returned an error status: ${test.status}. Please check that the website is accessible.`
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }
    } catch (error) {
      console.error('Error testing URL accessibility:', error);
      return new Response(JSON.stringify({
        success: false,
        message: `Could not access the URL: ${error instanceof Error ? error.message : 'Unknown error'}`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      });
    }
    
    // Update crawl status to processing
    try {
      const { error: updateError } = await supabase
        .from('seo_crawler_crawls')
        .update({ status: 'processing' })
        .eq('id', requestData.crawlId);
      
      if (updateError) {
        console.error(`Error updating crawl status: ${updateError.message}`);
      } else {
        console.log(`Updated crawl status to 'processing' for ID: ${requestData.crawlId}`);
      }
    } catch (updateError) {
      console.error('Error updating crawl status:', updateError);
    }
    
    // Start analyzing the main page
    console.log('Starting analysis of main page with Bright Data...');
    
    try {
      // Analyze the main page first
      const pageResult = await crawlPage(
        supabase,
        normalizedUrl,
        requestData.crawlId,
        requestData.brightDataUsername,
        requestData.brightDataPassword
      );
      
      if (!pageResult) {
        console.error('Could not analyze main page - crawlPage returned null');
        // Update crawl status to failed
        try {
          const { error: updateError } = await supabase
            .from('seo_crawler_crawls')
            .update({ 
              status: 'failed', 
              error_message: 'Error analyzing the main page. Please check that the URL is accessible and the Bright Data API key is valid.',
              completed_at: new Date().toISOString()
            })
            .eq('id', requestData.crawlId);
          
          if (updateError) {
            console.error(`Error updating crawl status to failed: ${updateError.message}`);
          }
        } catch (updateError) {
          console.error('Error updating crawl status to failed:', updateError);
        }
        
        return new Response(JSON.stringify({
          success: false,
          message: 'Error analyzing the main page. Please check that the URL is accessible and the Bright Data API key is valid.'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        });
      }
      
      console.log('Main page analysis completed successfully');
      console.log(`Results - pageId: ${pageResult.pageId}, issues: ${pageResult.issues}`);
      
      // Run a lightweight crawl process to get some more pages
      // Get the settings to determine max pages and depth
      const { data: crawlData } = await supabase
        .from('seo_crawler_crawls')
        .select('settings, pages_crawled')
        .eq('id', requestData.crawlId)
        .single();
        
      if (!crawlData || !crawlData.settings) {
        console.error('Failed to retrieve crawl settings');
      } else {
        const settings = crawlData.settings;
        const maxPages = settings.max_pages || 25; // Default to 25 if not specified
        let pagesCrawled = crawlData.pages_crawled || 1; // Count the main page
        
        // Get links from the database that we haven't processed yet
        // We'll only process a limited number based on the settings
        if (pageResult.links && pageResult.links.length > 0) {
          // Process links in batches to avoid overwhelming the system
          const maxLinksToProcess = Math.min(maxPages - pagesCrawled, 10);
          const linksToProcess = pageResult.links.slice(0, maxLinksToProcess);
          
          console.log(`Processing ${linksToProcess.length} additional links from the main page`);
          
          // Process each link
          for (const link of linksToProcess) {
            if (pagesCrawled >= maxPages) {
              console.log(`Reached maximum pages limit (${maxPages})`);
              break;
            }
            
            try {
              console.log(`Crawling link: ${link}`);
              const linkResult = await crawlPage(
                supabase,
                link,
                requestData.crawlId,
                requestData.brightDataUsername,
                requestData.brightDataPassword
              );
              
              if (linkResult) {
                pagesCrawled++;
                console.log(`Successfully crawled ${link}. Total pages crawled: ${pagesCrawled}`);
                
                // Update the crawl record with the new count
                await supabase
                  .from('seo_crawler_crawls')
                  .update({ 
                    pages_crawled: pagesCrawled,
                    total_pages: pagesCrawled // Also update total_pages
                  })
                  .eq('id', requestData.crawlId);
              } else {
                console.error(`Failed to crawl ${link}`);
              }
            } catch (linkError) {
              console.error(`Error crawling ${link}:`, linkError);
            }
          }
        }
      }
      
      // Update crawl status to completed
      try {
        // Get totals for links and issues
        const { data: issuesData } = await supabase
          .from('seo_crawler_issues')
          .select('id', { count: 'exact' })
          .eq('crawl_id', requestData.crawlId);
          
        const { data: linksData } = await supabase
          .from('seo_crawler_links')
          .select('id, is_internal, is_broken', { count: 'exact' })
          .eq('crawl_id', requestData.crawlId);
          
        const totalIssues = issuesData?.count || 0;
        const totalLinks = linksData?.count || 0;
        
        // Count internal and broken links
        let totalInternalLinks = 0;
        let totalBrokenLinks = 0;
        
        if (linksData) {
          for (const link of linksData) {
            if (link.is_internal) totalInternalLinks++;
            if (link.is_broken) totalBrokenLinks++;
          }
        }
        
        const totalExternalLinks = totalLinks - totalInternalLinks;
        
        // Update the crawl record with totals and completion
        const { error: updateError } = await supabase
          .from('seo_crawler_crawls')
          .update({ 
            status: 'completed',
            completed_at: new Date().toISOString(),
            total_issues: totalIssues,
            total_links: totalLinks,
            total_internal_links: totalInternalLinks,
            total_external_links: totalExternalLinks,
            total_broken_links: totalBrokenLinks
          })
          .eq('id', requestData.crawlId);
        
        if (updateError) {
          console.error(`Error updating crawl status to completed: ${updateError.message}`);
        } else {
          console.log(`Updated crawl status to 'completed' for ID: ${requestData.crawlId}`);
        }
      } catch (updateError) {
        console.error('Error updating crawl status to completed:', updateError);
      }
      
      // Send successful response
      console.log('Sending successful response');
      return new Response(JSON.stringify({
        success: true,
        message: 'Page analyzed correctly',
        pageId: pageResult.pageId,
        issuesCount: pageResult.issues
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
      
    } catch (error) {
      console.error('Error in crawl process:', error);
      
      // Update crawl status to failed
      try {
        const { error: updateError } = await supabase
          .from('seo_crawler_crawls')
          .update({ 
            status: 'failed', 
            error_message: error instanceof Error ? error.message : 'Unknown error during crawl',
            completed_at: new Date().toISOString()
          })
          .eq('id', requestData.crawlId);
        
        if (updateError) {
          console.error(`Error updating crawl status to failed after error: ${updateError.message}`);
        }
      } catch (updateError) {
        console.error('Error updating crawl status to failed after error:', updateError);
      }
      
      return new Response(JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error during crawl process'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      });
    }
    
  } catch (error) {
    console.error('Unhandled error in request handler:', error);
    return new Response(JSON.stringify({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error in request handler'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
}
