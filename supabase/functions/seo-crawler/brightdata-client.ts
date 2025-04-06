
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
  console.log(`[Bright Data] API Key (first 10 chars): ${apiKey ? apiKey.substring(0, 10) + '...' : 'not provided'}`);
  
  try {
    // If we have an API key, use that to fetch the page via Bright Data API
    if (apiKey && apiKey.trim() !== '') {
      console.log(`[Bright Data] Using API Key to fetch page: ${url}`);
      return await fetchWithBrightDataApi(url, apiKey);
    }
    
    // Otherwise use the proxy method
    console.log(`[Bright Data] Using proxy method to fetch page: ${url}`);
    return await fetchWithProxy(url, username, password);
  } catch (error) {
    console.error(`[Bright Data] Error fetching page: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error(`[Bright Data] Stack trace: ${error instanceof Error ? error.stack : 'No stack trace'}`);
    throw error;
  }
}

/**
 * Fetch a page using Bright Data API
 */
async function fetchWithBrightDataApi(url: string, apiKey: string): Promise<string> {
  console.log(`[Bright Data API] Fetching URL: ${url}`);
  
  // Updated API endpoint for Web Unlocker
  const brightDataApiUrl = 'https://api.brightdata.com/dca/fetch';
  
  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      url: url,
      render_js: true,
      response_type: 'html'
    })
  };
  
  console.log(`[Bright Data API] Making request to ${brightDataApiUrl}`);
  console.log(`[Bright Data API] Request body: ${options.body}`);
  
  const response = await fetch(brightDataApiUrl, options);
  
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
    console.log('[Bright Data API] JSON response keys:', Object.keys(jsonResponse));
    
    // Log the first 500 characters of the JSON response for debugging
    console.log('[Bright Data API] JSON response sample:', JSON.stringify(jsonResponse).substring(0, 500));
    
    // Check for different possible response formats
    if (jsonResponse.body) {
      console.log('[Bright Data API] Found HTML in body property, length:', jsonResponse.body.length);
      return jsonResponse.body;
    } else if (jsonResponse.html) {
      console.log('[Bright Data API] Found HTML in html property, length:', jsonResponse.html.length);
      return jsonResponse.html;
    } else if (jsonResponse.content) {
      console.log('[Bright Data API] Found HTML in content property, length:', jsonResponse.content.length);
      return jsonResponse.content;
    } else if (jsonResponse.data && jsonResponse.data.body) {
      console.log('[Bright Data API] Found HTML in data.body property, length:', jsonResponse.data.body.length);
      return jsonResponse.data.body;
    } else if (jsonResponse.data && jsonResponse.data.html) {
      console.log('[Bright Data API] Found HTML in data.html property, length:', jsonResponse.data.html.length);
      return jsonResponse.data.html;
    } else if (jsonResponse.data && typeof jsonResponse.data === 'string' && jsonResponse.data.includes('<html')) {
      console.log('[Bright Data API] Found HTML in data string property, length:', jsonResponse.data.length);
      return jsonResponse.data;
    } else if (typeof jsonResponse === 'string' && jsonResponse.includes('<html')) {
      console.log('[Bright Data API] JSON response is actually HTML string, length:', jsonResponse.length);
      return jsonResponse;
    } else {
      // If we didn't find HTML in any of the expected properties, throw an error
      console.error('[Bright Data API] Could not extract HTML from JSON response');
      throw new Error('Could not extract HTML from Bright Data API response');
    }
  } else {
    // Direct HTML response
    console.log('[Bright Data API] Response is not JSON, returning as text');
    const html = await response.text();
    console.log(`[Bright Data API] Got HTML response, length: ${html.length}`);
    return html;
  }
}

/**
 * Fetch a page using Bright Data proxy
 */
async function fetchWithProxy(url: string, username: string, password: string): Promise<string> {
  console.log(`[Bright Data Proxy] Fetching URL: ${url}`);
  
  // Encode the URL to ensure correct transmission
  const encodedUrl = encodeURIComponent(url);
  
  const options = {
    method: 'GET',
    headers: {
      'User-Agent': CRAWLER_CONFIG.USER_AGENT,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Cache-Control': 'max-age=0'
    },
    redirect: 'follow',
    timeout: CRAWLER_CONFIG.TIMEOUT_MS
  };
  
  const host = BRIGHT_DATA_CONFIG.PROXY_HOST;
  const port = BRIGHT_DATA_CONFIG.PROXY_PORT;
  const proxyUrl = `http://${username}:${password}@${host}:${port}`;
  console.log(`[Bright Data Proxy] Using proxy URL: ${proxyUrl}`);
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CRAWLER_CONFIG.TIMEOUT_MS);
  
  try {
    // Use proxy directly in the URL for Deno fetch
    // This requires username:password to be in the URL
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      client: {
        proxy: proxyUrl
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const responseText = await response.text();
      console.error(`[Bright Data Proxy] HTTP error: ${response.status} ${response.statusText}`);
      console.error(`[Bright Data Proxy] Response: ${responseText.substring(0, 500)}...`);
      throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
    }
    
    console.log(`[Bright Data Proxy] Response status: ${response.status}`);
    
    const html = await response.text();
    console.log(`[Bright Data Proxy] Fetched HTML size: ${html.length} characters`);
    
    if (html.length < 50) {
      console.warn(`[Bright Data Proxy] HTML content is suspiciously short: ${html}`);
    }
    
    return html;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${CRAWLER_CONFIG.TIMEOUT_MS}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
