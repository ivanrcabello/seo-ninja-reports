
// Bright Data HTTP client for SEO crawler
import { BRIGHT_DATA_CONFIG, CRAWLER_CONFIG } from './config.ts';

/**
 * Fetch a page using the Bright Data web unlocker
 */
export async function fetchPage(
  url: string,
  customUsername?: string,
  customPassword?: string,
  customApiKey?: string
): Promise<string> {
  console.log(`[Bright Data] Fetching page: ${url}`);
  
  const username = customUsername || Deno.env.get("BRIGHT_DATA_USERNAME") || BRIGHT_DATA_CONFIG.DEFAULT_USER;
  const password = customPassword || Deno.env.get("BRIGHT_DATA_PASSWORD") || BRIGHT_DATA_CONFIG.DEFAULT_PASSWORD;
  const apiKey = customApiKey || Deno.env.get("BRIGHT_DATA_API_KEY") || BRIGHT_DATA_CONFIG.DEFAULT_API_KEY;
  
  console.log(`[Bright Data] Using credentials - Username: ${username ? 'provided' : 'not provided'}, API Key: ${apiKey ? 'provided' : 'not provided'}`);
  
  try {
    // If we have an API key, use the direct API method (preferred)
    if (apiKey && apiKey.trim() !== '') {
      console.log(`[Bright Data] Using direct API key method for ${url}`);
      return await fetchWithDirectApi(url, apiKey);
    }
    
    // Fallback to proxy method
    console.log(`[Bright Data] Falling back to proxy method for ${url}`);
    return await fetchWithProxy(url, username, password);
  } catch (error) {
    console.error(`[Bright Data] Error fetching page: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error(`[Bright Data] Stack trace: ${error instanceof Error ? error.stack : 'No stack trace'}`);
    throw error;
  }
}

/**
 * Fetch a page using Bright Data Direct API (preferred method)
 */
async function fetchWithDirectApi(url: string, apiKey: string): Promise<string> {
  console.log(`[Bright Data API] Fetching URL: ${url} with API key starting with ${apiKey.substring(0, 5)}...`);
  
  const apiEndpoint = 'https://api.brightdata.com/request';
  
  const payload = {
    zone: "web_unlocker",
    url: url,
    format: "json"  // We want structured JSON response with body field
  };
  
  console.log(`[Bright Data API] Request payload: ${JSON.stringify(payload)}`);
  
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  };
  
  try {
    console.log(`[Bright Data API] Sending request to ${apiEndpoint}`);
    const response = await fetch(apiEndpoint, options);
    
    // Log the response status
    console.log(`[Bright Data API] Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      let errorText = '';
      try {
        const errorJson = await response.json();
        errorText = JSON.stringify(errorJson);
      } catch (e) {
        errorText = await response.text();
      }
      
      const errorMessage = `Bright Data API error: ${response.status} ${response.statusText}. ${errorText}`;
      console.error(`[Bright Data API] ${errorMessage}`);
      throw new Error(errorMessage);
    }
    
    const contentType = response.headers.get('content-type') || '';
    console.log(`[Bright Data API] Response content type: ${contentType}`);
    
    if (contentType.includes('application/json')) {
      console.log('[Bright Data API] Response is JSON, parsing...');
      const jsonResponse = await response.json();
      
      // Log the response structure
      console.log('[Bright Data API] JSON response keys:', Object.keys(jsonResponse));
      console.log('[Bright Data API] JSON response sample:', JSON.stringify(jsonResponse).substring(0, 200) + '...');
      
      // Extract HTML from the response
      if (jsonResponse.body) {
        console.log('[Bright Data API] Found HTML in body property');
        return jsonResponse.body;
      } else if (jsonResponse.html) {
        console.log('[Bright Data API] Found HTML in html property');
        return jsonResponse.html;
      } else if (jsonResponse.content) {
        console.log('[Bright Data API] Found HTML in content property');
        return jsonResponse.content;
      } else if (typeof jsonResponse === 'string') {
        console.log('[Bright Data API] Response is a string');
        return jsonResponse;
      } else {
        // Return the entire JSON as a string if we can't find HTML
        console.log('[Bright Data API] Could not find HTML in response, returning JSON string');
        return JSON.stringify(jsonResponse);
      }
    } else {
      // Direct HTML or text response
      console.log('[Bright Data API] Response is not JSON, returning as text');
      const html = await response.text();
      console.log(`[Bright Data API] Got text response, length: ${html.length}`);
      return html;
    }
  } catch (error) {
    console.error(`[Bright Data API] Error: ${error.message}`);
    throw error;
  }
}

/**
 * Fetch a page using Bright Data proxy (backup method)
 */
async function fetchWithProxy(url: string, username: string, password: string): Promise<string> {
  console.log(`[Bright Data Proxy] Fetching URL: ${url}`);
  
  // Prepare proxy URL
  const proxyUrl = `http://${username}:${password}@brd.superproxy.io:22225`;
  console.log(`[Bright Data Proxy] Using proxy URL with username ${username}`);
  
  try {
    // With Deno, we need to use a different approach since we don't have http-proxy-agent
    // We'll use fetch with a custom user agent instead
    console.log('[Bright Data Proxy] Using Deno fetch with proxy headers');
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': CRAWLER_CONFIG.USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Proxy-Authorization': `Basic ${btoa(`${username}:${password}`)}`,
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!response.ok) {
      const errorMessage = `HTTP error: ${response.status} ${response.statusText}`;
      console.error(`[Bright Data Proxy] ${errorMessage}`);
      throw new Error(errorMessage);
    }
    
    console.log(`[Bright Data Proxy] Response status: ${response.status}`);
    
    const html = await response.text();
    console.log(`[Bright Data Proxy] Fetched HTML size: ${html.length} characters`);
    
    return html;
  } catch (error) {
    console.error(`[Bright Data Proxy] Error: ${error.message}`);
    
    // For easier debugging, return a fallback HTML with the error
    console.log('[Bright Data Proxy] Returning fallback HTML for debugging');
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Error fetching ${url}</title>
          <meta name="description" content="Bright Data proxy fetch error">
        </head>
        <body>
          <h1>Error Fetching Page</h1>
          <p>URL: ${url}</p>
          <p>Error: ${error.message}</p>
          <p>This is a fallback page returned due to an error in the proxy fetch.</p>
        </body>
      </html>
    `;
  }
}
