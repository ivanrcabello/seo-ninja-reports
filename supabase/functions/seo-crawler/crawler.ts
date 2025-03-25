
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
    
    // Use Bright Data proxy or API credentials
    const username = customUsername || Deno.env.get('BRIGHT_DATA_USERNAME') || '';
    const password = customPassword || Deno.env.get('BRIGHT_DATA_PASSWORD') || '';
    
    console.log(`Using Bright Data credentials - Username: ${username ? 'Available (length: ' + username.length + ')' : 'Not available'}`);
    console.log(`Bright Data API key available: ${password ? 'Yes (length: ' + password.length + ')' : 'No'}`);
    
    if (!password) {
      throw new Error('No Bright Data API key/password configured');
    }
    
    // Normalize the URL
    const normalizedUrl = normalizeUrl(url);
    console.log(`Normalized URL: ${normalizedUrl}`);
    
    try {
      // Use Bright Data's API to fetch the page
      console.log(`Calling Bright Data API to analyze: ${normalizedUrl}`);
      
      // Bright Data API endpoint - using the request endpoint
      const apiEndpoint = 'https://api.brightdata.com/request';
      
      const zone = username || 'web_unlocker1';
      
      // Format request according to Bright Data's API documentation
      const apiRequestBody = {
        zone: zone,
        url: normalizedUrl,
        format: "json"  // Get JSON response with HTML content
      };
      
      console.log('API Request Body:', JSON.stringify(apiRequestBody, null, 2));
      
      const apiRequestHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${password}` // Using password as API key
      };
      
      console.log('Sending request to Bright Data API...');
      console.log(`Endpoint: ${apiEndpoint}`);
      
      // Make the actual request to Bright Data API
      const scrapeResponse = await fetch(apiEndpoint, {
        method: 'POST',
        headers: apiRequestHeaders,
        body: JSON.stringify(apiRequestBody),
        signal: AbortSignal.timeout(BRIGHT_DATA_CONFIG.TIMEOUT)
      });
      
      console.log(`Response received: status ${scrapeResponse.status}`);
      
      if (!scrapeResponse.ok) {
        const errorText = await scrapeResponse.text();
        console.error(`HTTP error: ${scrapeResponse.status}, Response: ${errorText}`);
        throw new Error(`HTTP error! Status: ${scrapeResponse.status}, Response: ${errorText}`);
      }
      
      // Get response content
      const contentType = scrapeResponse.headers.get('content-type') || '';
      let html = '';
      
      if (contentType.includes('application/json')) {
        // Parse JSON response
        const responseData = await scrapeResponse.json();
        console.log('JSON response structure:', Object.keys(responseData));
        
        // Extract HTML content based on Bright Data API response format
        if (responseData.body) {
          html = responseData.body;
        } else if (responseData.html) {
          html = responseData.html;
        } else if (responseData.data) {
          html = typeof responseData.data === 'string' ? responseData.data : JSON.stringify(responseData.data);
        } else {
          console.error('Unexpected response format from Bright Data:', JSON.stringify(responseData, null, 2));
          throw new Error('Unexpected response format from Bright Data');
        }
      } else {
        // If response is not JSON, treat it as raw HTML
        html = await scrapeResponse.text();
      }
      
      if (!html || html.trim().length === 0) {
        console.error('No valid HTML content received from Bright Data');
        throw new Error('No valid HTML content received');
      }
      
      console.log(`HTML content received: ${html.length} characters`);
      console.log(`First 200 characters: ${html.substring(0, 200)}`);
      
      // Process the HTML content using our HTML processor module
      const pageResult = await processHtml(supabase, normalizedUrl, crawlId, html);
      
      const endTime = Date.now();
      console.log(`Analysis completed in ${(endTime - startTime) / 1000} seconds`);
      
      if (pageResult) {
        console.log(`Found ${pageResult.issues} SEO issues`);
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
