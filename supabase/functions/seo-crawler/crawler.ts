
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
    console.log(`Current time: ${new Date().toISOString()}`);
    const startTime = Date.now();
    
    // Use provided Bright Data credentials or fallback to defaults
    const username = customUsername || 'brd-customer-hl_cbc2d791-zone-web_unlocker1';
    const password = customPassword || '5d024usr515b';
    
    console.log(`Using Bright Data credentials - Username: ${username.substring(0, 15)}..., Password length: ${password ? password.length : 0}`);
    console.log(`Bright Data zone: ${username.includes('-zone-') ? username.split('-zone-')[1] : 'unknown'}`);
    
    if (!password) {
      console.error('CRITICAL ERROR: No Bright Data API key/password provided');
      throw new Error('No Bright Data API key/password provided');
    }
    
    // Normalize the URL
    const normalizedUrl = normalizeUrl(url);
    console.log(`Normalized URL: ${normalizedUrl}`);
    
    try {
      // Create proxy auth
      const auth = btoa(`${username}:${password}`);
      console.log('Auth token created successfully');
      
      // Set up the request options with better timeout handling and headers
      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Connection': 'keep-alive',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
        signal: AbortSignal.timeout(BRIGHT_DATA_CONFIG.TIMEOUT || 60000) // Increased timeout to 60 seconds
      };
      
      console.log(`Making request to analyze: ${normalizedUrl} with timeout: ${BRIGHT_DATA_CONFIG.TIMEOUT || 60000}ms`);
      console.log('Request headers:', JSON.stringify(requestOptions.headers, null, 2));
      
      // Prepare the target URL for different fetching methods
      const targetUrlWithoutProtocol = normalizedUrl.replace(/^https?:\/\//, '');
      
      // Method 1: Try Bright Data super proxy format
      const proxyUrlWithAuth = `http://${username}:${password}@brd.superproxy.io:22225/${targetUrlWithoutProtocol}`;
      console.log(`Using proxy URL with auth: ${proxyUrlWithAuth.replace(password, '[REDACTED]')}`);
      
      // Try multiple methods to make this work
      let response;
      let html = '';
      let successMethod = '';
      
      // Method 1: Using the proxy URL directly
      try {
        console.log(`METHOD 1: Starting proxy request at ${new Date().toISOString()}`);
        
        // Simplified options without Authorization header (since it's in the URL)
        const simpleOptions = {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
          },
          signal: AbortSignal.timeout(BRIGHT_DATA_CONFIG.TIMEOUT || 60000)
        };
        
        response = await fetch(proxyUrlWithAuth, simpleOptions);
        console.log(`METHOD 1: Response status: ${response.status}`);
        
        if (response.ok) {
          html = await response.text();
          console.log(`METHOD 1: Received HTML content (${html.length} characters)`);
          successMethod = 'proxy-url';
        } else {
          console.log(`METHOD 1: Failed with status ${response.status}`);
          if (response.status === 407) {
            console.log(`METHOD 1: Received 407 Proxy Authentication Required - auth issue with Bright Data`);
            // Try to read the response body for more details
            const errorText = await response.text();
            console.log(`METHOD 1: Error response body: ${errorText}`);
          }
        }
      } catch (method1Error) {
        console.error(`METHOD 1: Error with proxy URL: ${method1Error instanceof Error ? method1Error.message : 'Unknown error'}`);
      }
      
      // Method 2: Try direct fetch with auth in headers
      if (!html) {
        try {
          console.log(`METHOD 2: Starting direct fetch request at ${new Date().toISOString()}`);
          
          // Method 2 - Modified to use the Bright Data format directly
          const urlWithCredentials = `http://${username}:${password}@brd.superproxy.io:22225`;
          
          const method2Options = {
            method: 'GET',
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache',
              'Referer': 'https://www.google.com/', // Adding referer sometimes helps
              'X-Forwarded-For': normalizedUrl // Add target as forwarded for
            },
            signal: AbortSignal.timeout(BRIGHT_DATA_CONFIG.TIMEOUT || 60000)
          };
          
          response = await fetch(`${urlWithCredentials}/${targetUrlWithoutProtocol}`, method2Options);
          console.log(`METHOD 2: Response status: ${response.status}`);
          
          if (response.ok) {
            html = await response.text();
            console.log(`METHOD 2: Received HTML content (${html.length} characters)`);
            successMethod = 'direct-fetch-with-credentials';
          } else {
            console.log(`METHOD 2: Failed with status ${response.status}`);
            // Try to read the response body for more details
            try {
              const errorText = await response.text();
              console.log(`METHOD 2: Error response body: ${errorText.substring(0, 500)}...`);
            } catch (e) {
              console.log(`METHOD 2: Could not read error response body`);
            }
          }
        } catch (method2Error) {
          console.error(`METHOD 2: Error with direct fetch: ${method2Error instanceof Error ? method2Error.message : 'Unknown error'}`);
        }
      }
      
      // Method 3: Try with API key auth directly in URL
      if (!html) {
        try {
          console.log(`METHOD 3: Trying direct proxy approach at ${new Date().toISOString()}`);
          
          // Use the Bright Data direct URL format
          const apiUrl = `https://brd.superproxy.io:22225/crawl?url=${encodeURIComponent(normalizedUrl)}`;
          
          // Create a new request with explicit authentication
          const directRequestOptions = {
            method: 'GET',
            headers: {
              'Authorization': `Basic ${auth}`,
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.9',
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache',
            },
            signal: AbortSignal.timeout(BRIGHT_DATA_CONFIG.TIMEOUT || 60000)
          };
          
          response = await fetch(apiUrl, directRequestOptions);
          console.log(`METHOD 3: Response status: ${response.status}`);
          
          if (response.ok) {
            html = await response.text();
            console.log(`METHOD 3: Received HTML content (${html.length} characters)`);
            successMethod = 'direct-api';
          } else {
            console.log(`METHOD 3: Failed with status ${response.status}`);
            // Try to read the response body for more details
            try {
              const errorText = await response.text();
              console.log(`METHOD 3: Error response body: ${errorText.substring(0, 200)}`);
            } catch (e) {
              console.log(`METHOD 3: Could not read error response body`);
            }
          }
        } catch (method3Error) {
          console.error(`METHOD 3: Error with direct api: ${method3Error instanceof Error ? method3Error.message : 'Unknown error'}`);
        }
      }
      
      // Method 4: Try a pure fetch to the URL (without proxy) as last resort
      if (!html) {
        try {
          console.log(`METHOD 4: Trying plain direct fetch to URL at ${new Date().toISOString()}`);
          
          const plainOptions = {
            method: 'GET',
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.9',
            },
            signal: AbortSignal.timeout(30000)
          };
          
          response = await fetch(normalizedUrl, plainOptions);
          console.log(`METHOD 4: Response status: ${response.status}`);
          
          if (response.ok) {
            html = await response.text();
            console.log(`METHOD 4: Received HTML content directly (${html.length} characters)`);
            successMethod = 'direct-url-fetch';
          } else {
            console.log(`METHOD 4: Failed with status ${response.status}`);
          }
        } catch (method4Error) {
          console.error(`METHOD 4: Error with direct URL fetch: ${method4Error instanceof Error ? method4Error.message : 'Unknown error'}`);
        }
      }
      
      // If we still have no HTML, try a different zone
      if (!html && username === 'brd-customer-hl_cbc2d791-zone-web_unlocker1') {
        try {
          console.log(`FALLBACK: Trying with residential zone`);
          
          // Use residential zone as fallback
          const fallbackUsername = 'brd-customer-hl_cbc2d791-zone-residential-country-es';
          const fallbackAuth = btoa(`${fallbackUsername}:${password}`);
          
          const fallbackUrl = `http://${fallbackUsername}:${password}@brd.superproxy.io:22225/${targetUrlWithoutProtocol}`;
          
          const fallbackOptions = {
            method: 'GET',
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            },
            signal: AbortSignal.timeout(BRIGHT_DATA_CONFIG.TIMEOUT || 60000)
          };
          
          response = await fetch(fallbackUrl, fallbackOptions);
          console.log(`FALLBACK: Response status: ${response.status}`);
          
          if (response.ok) {
            html = await response.text();
            console.log(`FALLBACK: Received HTML content (${html.length} characters)`);
            successMethod = 'fallback-residential-zone';
          } else {
            console.log(`FALLBACK: Failed with status ${response.status}`);
          }
        } catch (fallbackError) {
          console.error(`FALLBACK: Error with residential zone: ${fallbackError instanceof Error ? fallbackError.message : 'Unknown error'}`);
        }
      }
      
      // Verificar que hemos recibido un HTML válido
      if (!html || html.length === 0) {
        console.error('Empty HTML content received');
        throw new Error('No HTML content received from any Bright Data connection method');
      }
      
      if (html.length < 50) {
        console.error('Too short HTML content received from Bright Data');
        console.log(`Full content preview: ${html}`);
        throw new Error('Invalid HTML content received from Bright Data - content too short');
      }
      
      // Additional validation for common error pages
      if (html.includes('Access Denied') || html.includes('Request Rejected') || html.includes('captcha')) {
        console.warn('Possible error page or CAPTCHA detected in the response');
        console.log(`Error page preview: ${html.substring(0, 500)}`);
      }
      
      console.log(`Successfully retrieved HTML content using method: ${successMethod}`);
      console.log(`HTML content received, length: ${html.length} characters`);
      console.log(`HTML preview (first 300 chars): ${html.substring(0, 300).replace(/\n/g, ' ')}`);
      
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
        errorMessage = `Request timeout after ${BRIGHT_DATA_CONFIG.TIMEOUT || 60000}ms - ${fetchError.message}`;
      } else if (fetchError.name === 'TypeError' && fetchError.message.includes('network')) {
        errorMessage = `Network error - ${fetchError.message}`;
      }
    }
    
    await registerCrawlerError(supabase, crawlId, url, errorMessage);
    return null;
  }
}
