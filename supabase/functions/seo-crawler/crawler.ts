
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
          'Connection': 'keep-alive',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        signal: AbortSignal.timeout(BRIGHT_DATA_CONFIG.TIMEOUT)
      };
      
      console.log(`Making request to analyze: ${normalizedUrl} with timeout: ${BRIGHT_DATA_CONFIG.TIMEOUT}ms`);
      console.log('Request headers:', JSON.stringify(requestOptions.headers, null, 2));
      
      // ALTERNATIVE METHOD ATTEMPT: Using fetch with proxy URL in the target
      // Format: http://{username}:{password}@brd.superproxy.io:22225/{target_url}
      // Remove http:// or https:// from normalizedUrl
      const targetUrlWithoutProtocol = normalizedUrl.replace(/^https?:\/\//, '');
      const proxyUrlWithAuth = `http://${username}:${password}@brd.superproxy.io:22225/${targetUrlWithoutProtocol}`;
      
      console.log(`ALTERNATIVE: Will also try proxy URL with auth: ${proxyUrlWithAuth.replace(password, '[REDACTED]')}`);
      
      // Log proxy details
      console.log(`Using direct proxy: ${proxyUrl}`);
      
      // Try multiple methods to make this work
      let response;
      let html = '';
      let successMethod = '';
      
      // First attempt: Direct fetch to target URL (with Bright Data auth in headers)
      try {
        console.log(`METHOD 1: Starting direct fetch request at ${new Date().toISOString()}`);
        response = await fetch(normalizedUrl, requestOptions);
        console.log(`METHOD 1: Response status: ${response.status}`);
        
        if (response.ok) {
          html = await response.text();
          console.log(`METHOD 1: Received HTML content (${html.length} characters)`);
          successMethod = 'direct-fetch';
        } else {
          console.log(`METHOD 1: Failed with status ${response.status}`);
        }
      } catch (method1Error) {
        console.error(`METHOD 1: Error with direct fetch: ${method1Error instanceof Error ? method1Error.message : 'Unknown error'}`);
      }
      
      // If first method failed, try alternate method
      if (!html && !successMethod) {
        try {
          console.log(`METHOD 2: Trying fetch with proxy URL at ${new Date().toISOString()}`);
          
          // Remove Authorization header since we're putting auth in the URL
          const altOptions = { ...requestOptions };
          delete altOptions.headers.Authorization;
          
          response = await fetch(proxyUrlWithAuth, altOptions);
          console.log(`METHOD 2: Response status: ${response.status}`);
          
          if (response.ok) {
            html = await response.text();
            console.log(`METHOD 2: Received HTML content (${html.length} characters)`);
            successMethod = 'proxy-url';
          } else {
            console.log(`METHOD 2: Failed with status ${response.status}`);
          }
        } catch (method2Error) {
          console.error(`METHOD 2: Error with proxy URL: ${method2Error instanceof Error ? method2Error.message : 'Unknown error'}`);
        }
      }
      
      // If we still don't have content, try using the proxy URL in a different way
      if (!html && !successMethod) {
        try {
          console.log(`METHOD 3: Trying direct proxy request at ${new Date().toISOString()}`);
          
          // Try a completely different approach - direct string construction
          const proxyAuth = `${username}:${password}`;
          const fetchUrl = `http://${proxyAuth}@brd.superproxy.io:22225/${normalizedUrl.replace(/^https?:\/\//, '')}`;
          
          console.log(`METHOD 3: Using fetch URL: ${fetchUrl.replace(password, '[REDACTED]')}`);
          
          // Simplified options
          const simpleOptions = {
            method: 'GET',
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
            signal: AbortSignal.timeout(BRIGHT_DATA_CONFIG.TIMEOUT)
          };
          
          response = await fetch(fetchUrl, simpleOptions);
          console.log(`METHOD 3: Response status: ${response.status}`);
          
          if (response.ok) {
            html = await response.text();
            console.log(`METHOD 3: Received HTML content (${html.length} characters)`);
            successMethod = 'direct-proxy';
          } else {
            console.log(`METHOD 3: Failed with status ${response.status}`);
          }
        } catch (method3Error) {
          console.error(`METHOD 3: Error with direct proxy: ${method3Error instanceof Error ? method3Error.message : 'Unknown error'}`);
        }
      }
      
      // Verificar que hemos recibido un HTML válido
      if (!html || typeof html !== 'string' || !html.includes('<html')) {
        throw new Error('Respuesta inválida de Bright Data: HTML no recibido o incompleto.');
      }
      
      console.log(`Successfully retrieved HTML content using method: ${successMethod}`);
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

      if (html.includes('captcha') || html.includes('CAPTCHA')) {
        console.warn('CAPTCHA detected in the response - this may affect analysis');
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
}
