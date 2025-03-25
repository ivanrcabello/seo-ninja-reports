
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
    console.log(`Starting page analysis: ${url}`);
    const startTime = Date.now();
    
    // Use provided Bright Data credentials or fallback to defaults
    const username = customUsername || 'brd-customer-hl_cbc2d791-zone-web_unlocker1';
    const password = customPassword || '5d024usr515b';
    
    console.log(`Using Bright Data credentials - Username: ${username}, Password: ${password ? 'Available (length: ' + password.length + ')' : 'Not available'}`);
    
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
      
      // Set up the request options
      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        signal: AbortSignal.timeout(BRIGHT_DATA_CONFIG.TIMEOUT)
      };
      
      console.log(`Making request through Bright Data proxy to analyze: ${normalizedUrl}`);
      
      // Make the request directly to the target URL
      // Bright Data will intercept this via proxy settings
      const response = await fetch(normalizedUrl, requestOptions);
      
      console.log(`Bright Data API response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error from Bright Data API: ${response.status}, Response: ${errorText}`);
        throw new Error(`Bright Data API error! Status: ${response.status}, Response: ${errorText}`);
      }
      
      // Get response content as HTML
      const html = await response.text();
      
      console.log(`HTML content received, length: ${html.length} characters`);
      
      if (!html || html.length < 100) {
        console.error('Empty or too short HTML content received from Bright Data');
        console.log(`Content preview: ${html}`);
        throw new Error('Invalid HTML content received from Bright Data API');
      }
      
      // Process the HTML content using our HTML processor module
      const pageResult = await processHtml(supabase, normalizedUrl, crawlId, html);
      
      const endTime = Date.now();
      console.log(`Analysis completed in ${(endTime - startTime) / 1000} seconds`);
      
      if (pageResult) {
        console.log(`Found ${pageResult.issues || 0} SEO issues on the page`);
      }
      
      return pageResult;
      
    } catch (fetchError) {
      console.error(`Error fetching page from Bright Data: ${fetchError}`);
      console.error(`Stack trace: ${fetchError instanceof Error ? fetchError.stack : 'No stack trace'}`);
      await registerCrawlerError(supabase, crawlId, url, fetchError instanceof Error ? fetchError.message : 'Unknown error in Bright Data API');
      return null;
    }
    
  } catch (error) {
    console.error(`General error analyzing page ${url}:`, error);
    await registerCrawlerError(supabase, crawlId, url, error instanceof Error ? error.message : String(error));
    return null;
  }
}
