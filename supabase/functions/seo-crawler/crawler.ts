
// Main crawler implementation
import { SupabaseInstance, PageCrawlResult } from './types.ts';
import { registerCrawlerError, normalizeUrl } from './utils.ts';
import { processHtml } from './modules/html-processor.ts';

// Main crawler function - crawl a single page using Bright Data's Web Scraper API
export async function crawlPage(
  supabase: SupabaseInstance, 
  url: string, 
  crawlId: string,
  customUsername?: string,
  customPassword?: string,
  apiKey?: string
): Promise<PageCrawlResult | null> {
  try {
    console.log(`Starting page analysis for URL: ${url}, crawlId: ${crawlId}`);
    console.log(`Current time: ${new Date().toISOString()}`);
    const startTime = Date.now();
    
    // Use provided Bright Data credentials or fallback to defaults
    const username = customUsername || 'brd-customer-hl_2a8d2c33-zone-web_unlocker';
    const password = customPassword || 'obz0lal9qh4g';
    const brightDataApiKey = apiKey || '';
    
    console.log(`Using Bright Data credentials - Username: ${username.substring(0, 15)}..., Password length: ${password ? password.length : 0}`);
    console.log(`Bright Data API Key provided: ${brightDataApiKey ? 'Yes' : 'No'}`);
    console.log(`Bright Data zone: ${username.includes('-zone-') ? username.split('-zone-')[1] : 'unknown'}`);
    
    // Normalize the URL
    const normalizedUrl = normalizeUrl(url);
    console.log(`Normalized URL: ${normalizedUrl}`);
    
    // Initialize HTML content variable
    let html = '';
    
    try {
      // Create proxy auth
      const auth = btoa(`${username}:${password}`);
      console.log('Auth token created successfully');
      
      // Try multiple methods to handle connectivity issues with Bright Data
      
      // METHOD 1: Standard Bright Data proxy approach with superproxy.io
      try {
        console.log('METHOD 1: Using superproxy.io direct connection');
        const proxyUrl = `http://brd.superproxy.io:22225`;  // Updated port to 22225
        const requestOptions = {
          method: 'GET',
          headers: {
            'Authorization': `Basic ${auth}`,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'X-Crawlera-Session': 'create',
            'X-BRD-Mode': 'render',
            'X-BRD-Timeout': '60000',
            'X-BRD-URL': normalizedUrl,
            'Proxy-Authorization': `Basic ${auth}`, // Added explicit Proxy-Authorization header
            ...(brightDataApiKey ? { 'X-BrightData-Key': brightDataApiKey } : {})
          },
          signal: AbortSignal.timeout(90000) // 90 seconds timeout
        };
        
        const response = await fetch(proxyUrl, requestOptions);
        console.log(`METHOD 1: Response status: ${response.status}`);
        
        if (response.ok) {
          html = await response.text();
          console.log(`METHOD 1: Successfully retrieved HTML content (${html.length} characters)`);
        } else {
          console.log(`METHOD 1: Failed with status ${response.status}`);
          const errorBody = await response.text();
          console.log(`METHOD 1: Error response: ${errorBody.substring(0, 200)}...`);
        }
      } catch (method1Error) {
        console.error(`METHOD 1 error: ${method1Error instanceof Error ? method1Error.message : 'Unknown error'}`);
      }
      
      // METHOD 2: Try using the Bright Data REST API directly with API Key if available
      if ((!html || html.length < 100) && brightDataApiKey) {
        try {
          console.log('METHOD 2: Using Bright Data REST API with API Key');
          
          // Build the correct Bright Data API endpoint
          const apiUrl = `https://api.brightdata.com/dca/direct_access`;
          const requestData = {
            url: normalizedUrl,
            render_js: true,
            country: 'es'
          };
          
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/json',
              'X-BrightData-Key': brightDataApiKey
            },
            body: JSON.stringify(requestData),
            signal: AbortSignal.timeout(90000) // 90 seconds timeout
          });
          
          console.log(`METHOD 2: Response status: ${response.status}`);
          
          if (response.ok) {
            const data = await response.json();
            html = data.body || data.html || '';
            console.log(`METHOD 2: Successfully retrieved HTML content (${html.length} characters)`);
          } else {
            console.log(`METHOD 2: Failed with status ${response.status}`);
            try {
              const errorBody = await response.text();
              console.log(`METHOD 2: Error response: ${errorBody.substring(0, 200)}...`);
            } catch (e) {
              console.log('METHOD 2: Could not parse error response');
            }
          }
        } catch (method2Error) {
          console.error(`METHOD 2 error: ${method2Error instanceof Error ? method2Error.message : 'Unknown error'}`);
        }
      } else if (!html || html.length < 100) {
        try {
          console.log('METHOD 2: Using Bright Data REST API without API Key');
          
          // Build the correct Bright Data API endpoint
          const apiUrl = `https://api.brightdata.com/dca/direct_access`;
          const requestData = {
            url: normalizedUrl,
            render_js: true,
            country: 'es'
          };
          
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData),
            signal: AbortSignal.timeout(90000) // 90 seconds timeout
          });
          
          console.log(`METHOD 2: Response status: ${response.status}`);
          
          if (response.ok) {
            const data = await response.json();
            html = data.body || data.html || '';
            console.log(`METHOD 2: Successfully retrieved HTML content (${html.length} characters)`);
          } else {
            console.log(`METHOD 2: Failed with status ${response.status}`);
            try {
              const errorBody = await response.text();
              console.log(`METHOD 2: Error response: ${errorBody.substring(0, 200)}...`);
            } catch (e) {
              console.log('METHOD 2: Could not parse error response');
            }
          }
        } catch (method2Error) {
          console.error(`METHOD 2 error: ${method2Error instanceof Error ? method2Error.message : 'Unknown error'}`);
        }
      }
      
      // METHOD 3: Try the Web Unlocker specific endpoint with API Key if available
      if ((!html || html.length < 100) && brightDataApiKey) {
        try {
          console.log('METHOD 3: Using Web Unlocker specific endpoint with API Key');
          
          const unlockerUrl = 'https://api.brightdata.com/web_unlocker';
          const requestData = {
            url: normalizedUrl,
            country: 'es'
          };
          
          const response = await fetch(unlockerUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/json',
              'X-BrightData-Key': brightDataApiKey
            },
            body: JSON.stringify(requestData),
            signal: AbortSignal.timeout(90000) // 90 seconds timeout
          });
          
          console.log(`METHOD 3: Response status: ${response.status}`);
          
          if (response.ok) {
            const data = await response.json();
            html = data.body || data.html || '';
            console.log(`METHOD 3: Successfully retrieved HTML content (${html.length} characters)`);
          } else {
            console.log(`METHOD 3: Failed with status ${response.status}`);
            try {
              const errorBody = await response.text();
              console.log(`METHOD 3: Error response: ${errorBody.substring(0, 200)}...`);
            } catch (e) {
              console.log('METHOD 3: Could not parse error response');
            }
          }
        } catch (method3Error) {
          console.error(`METHOD 3 error: ${method3Error instanceof Error ? method3Error.message : 'Unknown error'}`);
        }
      } else if (!html || html.length < 100) {
        try {
          console.log('METHOD 3: Using Web Unlocker specific endpoint without API Key');
          
          const unlockerUrl = 'https://api.brightdata.com/web_unlocker';
          const requestData = {
            url: normalizedUrl,
            country: 'es'
          };
          
          const response = await fetch(unlockerUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData),
            signal: AbortSignal.timeout(90000) // 90 seconds timeout
          });
          
          console.log(`METHOD 3: Response status: ${response.status}`);
          
          if (response.ok) {
            const data = await response.json();
            html = data.body || data.html || '';
            console.log(`METHOD 3: Successfully retrieved HTML content (${html.length} characters)`);
          } else {
            console.log(`METHOD 3: Failed with status ${response.status}`);
            try {
              const errorBody = await response.text();
              console.log(`METHOD 3: Error response: ${errorBody.substring(0, 200)}...`);
            } catch (e) {
              console.log('METHOD 3: Could not parse error response');
            }
          }
        } catch (method3Error) {
          console.error(`METHOD 3 error: ${method3Error instanceof Error ? method3Error.message : 'Unknown error'}`);
        }
      }
      
      // METHOD 4: Direct format with credentials in URL
      if (!html || html.length < 100) {
        try {
          console.log('METHOD 4: Using direct format with credentials in URL');
          
          // Format: http://username:password@brd.superproxy.io:22225
          const directProxyUrl = `http://${username}:${password}@brd.superproxy.io:22225`;
          
          // Make the request directly to the target URL through the proxy
          const headers: Record<string, string> = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache'
          };
          
          if (brightDataApiKey) {
            headers['X-BrightData-Key'] = brightDataApiKey;
          }
          
          const response = await fetch(normalizedUrl, {
            method: 'GET',
            headers,
            signal: AbortSignal.timeout(90000) // 90 seconds timeout
          });
          
          console.log(`METHOD 4: Response status: ${response.status}`);
          
          if (response.ok) {
            html = await response.text();
            console.log(`METHOD 4: Successfully retrieved HTML content (${html.length} characters)`);
          } else {
            console.log(`METHOD 4: Failed with status ${response.status}`);
            try {
              const errorBody = await response.text();
              console.log(`METHOD 4: Error response: ${errorBody.substring(0, 200)}...`);
            } catch (e) {
              console.log('METHOD 4: Could not parse error response');
            }
          }
        } catch (method4Error) {
          console.error(`METHOD 4 error: ${method4Error instanceof Error ? method4Error.message : 'Unknown error'}`);
        }
      }
      
      // Validate HTML content
      if (!html || html.length === 0) {
        throw new Error('No HTML content received from any Bright Data connection method');
      }
      
      // Log HTML preview
      console.log(`Final HTML content length: ${html.length} characters`);
      console.log(`HTML preview (first 300 chars): ${html.substring(0, 300).replace(/\n/g, ' ')}`);
      
      // Process the HTML content
      console.log('Processing HTML content...');
      const pageResult = await processHtml(supabase, normalizedUrl, crawlId, html);
      
      // Log completion time
      const endTime = Date.now();
      console.log(`Analysis completed in ${(endTime - startTime) / 1000} seconds`);
      
      if (pageResult) {
        console.log(`Found ${pageResult.issues || 0} SEO issues on the page`);
        console.log(`Page result:`, JSON.stringify(pageResult, null, 2));
        
        // Update the crawl record with successful completion
        await supabase
          .from('seo_crawler_crawls')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
            pages_crawled: 1,
            total_issues: pageResult.issues || 0
          })
          .eq('id', crawlId);
      } else {
        console.error('processHtml returned null result');
        
        // Update the crawl record with failed status
        await supabase
          .from('seo_crawler_crawls')
          .update({
            status: 'failed',
            error_message: 'Failed to process HTML content',
            completed_at: new Date().toISOString()
          })
          .eq('id', crawlId);
      }
      
      return pageResult;
    } catch (innerError) {
      console.error(`Error in HTML processing: ${innerError instanceof Error ? innerError.message : 'Unknown error'}`);
      console.error(`Stack trace: ${innerError instanceof Error ? innerError.stack : 'No stack trace'}`);
      
      // Update the crawl record with error details
      await supabase
        .from('seo_crawler_crawls')
        .update({
          status: 'failed',
          error_message: innerError instanceof Error ? innerError.message : 'Unknown error in HTML processing',
          completed_at: new Date().toISOString()
        })
        .eq('id', crawlId);
        
      throw innerError;
    }
    
  } catch (outerError) {
    console.error(`Outer error in crawl process: ${outerError instanceof Error ? outerError.message : 'Unknown error'}`);
    console.error(`Stack trace: ${outerError instanceof Error ? outerError.stack : 'No stack trace'}`);
    
    // Register the crawler error in the database
    await registerCrawlerError(supabase, crawlId, url, outerError instanceof Error ? outerError.message : String(outerError));
    
    return null;
  }
}
