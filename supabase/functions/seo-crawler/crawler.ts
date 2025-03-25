
// Main crawler implementation
import { SupabaseInstance, PageCrawlResult } from './types.ts';
import { BRIGHT_DATA_CONFIG, SEO_ISSUES } from './constants.ts';
import { isInternalUrl, queueLinksForCrawling, registerCrawlerError, normalizeUrl } from './utils.ts';
import { processHtml } from './modules/html-processor.ts';

// Main crawler function - crawl a single page using Bright Data's Web Scraper API
export async function crawlPage(
  supabase: SupabaseInstance, 
  url: string, 
  crawlId: string,
  customUsername?: string,
  customPassword?: string
): Promise<PageCrawlResult | null> {
  try {
    console.log(`Starting page analysis for URL: ${url}, crawlId: ${crawlId}`);
    const startTime = Date.now();
    
    // Use provided Bright Data credentials or fallback to defaults
    const username = customUsername || 'brd-customer-hl_cbc2d791-zone-web_unlocker1';
    const password = customPassword || '5d024usr515b';
    
    console.log(`Using Bright Data credentials - Username: ${username.substring(0, 15)}..., Password length: ${password ? password.length : 0}`);
    
    if (!password) {
      throw new Error('No Bright Data API key/password provided');
    }
    
    // Normalize the URL
    const normalizedUrl = normalizeUrl(url);
    console.log(`Normalized URL: ${normalizedUrl}`);
    
    try {
      // Set up the Bright Data proxy with credentials
      const proxyUrl = 'http://brd.superproxy.io:22225';
      
      // Create proxy auth
      const auth = btoa(`${username}:${password}`);
      console.log('Auth token created successfully');
      
      // Set up the request options with better timeout handling
      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Connection': 'keep-alive'
        },
        signal: AbortSignal.timeout(BRIGHT_DATA_CONFIG.TIMEOUT)
      };
      
      console.log(`Making request to analyze: ${normalizedUrl} with timeout: ${BRIGHT_DATA_CONFIG.TIMEOUT}ms`);
      console.log('Request headers:', JSON.stringify(requestOptions.headers, null, 2));
      
      // Log proxy details
      console.log(`Using proxy: ${proxyUrl}`);
      
      // Make the request directly through Bright Data proxy
      console.log(`Starting fetch request at ${new Date().toISOString()}`);
      
      try {
        // First try direct fetch (will use Deno's global proxy settings)
        const response = await fetch(normalizedUrl, requestOptions);
        
        console.log(`Bright Data API response status: ${response.status}`);
        console.log(`Response headers:`, JSON.stringify(Object.fromEntries([...response.headers]), null, 2));
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`HTTP error from Bright Data API: ${response.status}, Response: ${errorText.substring(0, 500)}`);
          throw new Error(`Bright Data API error! Status: ${response.status}, Response: ${errorText.substring(0, 200)}`);
        }
        
        // Get response content as HTML
        const html = await response.text();
        
        console.log(`HTML content received, length: ${html.length} characters`);
        console.log(`HTML preview (first 300 chars): ${html.substring(0, 300).replace(/\n/g, ' ')}`);
        
        if (!html || html.length < 100) {
          console.error('Empty or too short HTML content received from Bright Data');
          console.log(`Full content preview: ${html}`);
          throw new Error('Invalid HTML content received from Bright Data API - content too short');
        }
        
        // Check if we got an error page instead of actual content
        if (html.includes('Access Denied') || html.includes('Request Rejected')) {
          console.error('Access Denied or Request Rejected content detected');
          console.log(`Error page preview: ${html.substring(0, 500)}`);
          throw new Error('Bright Data returned an error page - Access Denied or Request Rejected');
        }
        
        // Process the HTML content using our HTML processor module
        console.log('Processing HTML content...');
        const pageResult = await processHtml(supabase, normalizedUrl, crawlId, html);
        
        const endTime = Date.now();
        console.log(`Analysis completed in ${(endTime - startTime) / 1000} seconds`);
        
        if (pageResult) {
          console.log(`Found ${pageResult.issues || 0} SEO issues on the page`);
          console.log(`Page result:`, JSON.stringify(pageResult, null, 2));
        } else {
          console.error('processHtml returned null result');
        }
        
        return pageResult;
      } catch (innerFetchError) {
        console.error(`Inner fetch error: ${innerFetchError instanceof Error ? innerFetchError.message : 'Unknown error'}`);
        console.error(`Stack trace: ${innerFetchError instanceof Error ? innerFetchError.stack : 'No stack trace'}`);
        throw innerFetchError;
      }
      
    } catch (fetchError) {
      console.error(`Error fetching page from Bright Data: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`);
      console.error(`Stack trace: ${fetchError instanceof Error ? fetchError.stack : 'No stack trace'}`);
      
      // Try to register more detailed error
      let errorMessage = 'Unknown fetch error';
      if (fetchError instanceof Error) {
        errorMessage = `Fetch error: ${fetchError.message} (${fetchError.name})`;
        
        // Check for specific error types
        if (fetchError.name === 'AbortError') {
          errorMessage = `Request timeout after ${BRIGHT_DATA_CONFIG.TIMEOUT}ms - ${fetchError.message}`;
        } else if (fetchError.name === 'TypeError' && fetchError.message.includes('network')) {
          errorMessage = `Network error - ${fetchError.message}`;
        }
      }
      
      await registerCrawlerError(supabase, crawlId, url, errorMessage);
      return null;
    }
    
  } catch (error) {
    console.error(`General error analyzing page ${url}:`, error instanceof Error ? error.message : 'Unknown error');
    console.error(`Stack trace: ${error instanceof Error ? error.stack : 'No stack trace'}`);
    
    // Try to provide more context for the error
    let errorDetails = 'Unknown error';
    if (error instanceof Error) {
      errorDetails = `${error.name}: ${error.message}`;
    }
    
    await registerCrawlerError(supabase, crawlId, url, errorDetails);
    return null;
  }
}
