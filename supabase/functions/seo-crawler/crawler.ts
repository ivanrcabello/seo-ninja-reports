
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
    
    // Use Bright Data API credentials
    // The new Bright Data username format
    const username = customUsername || 'brd-customer-hl_cbc2d791-zone-web_unlocker1';
    const password = customPassword || 'f5d2a610003ca042f0500f50e9aa8366f2143369867522e170fa004b084ec382';
    
    console.log(`Using Bright Data credentials - Username: ${username}, Password: ${password ? 'Available (length: ' + password.length + ')' : 'Not available'}`);
    
    if (!password) {
      throw new Error('No Bright Data API key/password provided');
    }
    
    // Normalize the URL
    const normalizedUrl = normalizeUrl(url);
    console.log(`Normalized URL: ${normalizedUrl}`);
    
    try {
      // Use Bright Data's API to fetch the page
      console.log(`Calling Bright Data API to analyze: ${normalizedUrl}`);
      
      // Bright Data API endpoint
      const apiEndpoint = 'https://api.brightdata.com/request';
      
      // Format request according to Bright Data's API documentation
      const requestBody = {
        zone: 'web_unlocker1', // Using just the zone part
        url: normalizedUrl,
        format: "raw"  // Get raw HTML response
      };
      
      console.log('Request Body:', JSON.stringify(requestBody, null, 2));
      
      const requestHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${password}`
      };
      
      console.log('Sending request to Bright Data API...');
      
      // Make the actual request to Bright Data API
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(BRIGHT_DATA_CONFIG.TIMEOUT)
      });
      
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
