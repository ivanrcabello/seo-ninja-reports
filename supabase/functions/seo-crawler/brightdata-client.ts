// Client module for Bright Data API
import { BRIGHT_DATA_CONFIG } from "./config.ts";

/**
 * Fetches a page using Bright Data proxy service
 */
export async function fetchPage(
  url: string, 
  username?: string, 
  password?: string,
  apiKey?: string
): Promise<string> {
  try {
    console.log(`[BrightData] Fetching URL: ${url}`);
    
    // Use provided credentials or fall back to defaults
    const proxyUsername = username || Deno.env.get("BRIGHT_DATA_USERNAME") || BRIGHT_DATA_CONFIG.DEFAULT_USER;
    const proxyPassword = password || Deno.env.get("BRIGHT_DATA_PASSWORD") || BRIGHT_DATA_CONFIG.DEFAULT_PASSWORD;
    const brightDataApiKey = apiKey || Deno.env.get("BRIGHT_DATA_API_KEY") || BRIGHT_DATA_CONFIG.DEFAULT_API_KEY;
    
    console.log(`[BrightData] Using credentials - Username: ${proxyUsername.substring(0, 10)}..., Password: ${proxyPassword ? '***' : 'not set'}`);
    
    // Use Bright Data API if key is provided
    if (brightDataApiKey && brightDataApiKey.length > 10) {
      console.log(`[BrightData] Using Bright Data API with key: ${brightDataApiKey.substring(0, 10)}...`);
      return await fetchWithBrightDataApi(url, brightDataApiKey);
    }
    
    // Otherwise, use Bright Data Proxy
    console.log(`[BrightData] Using Bright Data Proxy with host: ${BRIGHT_DATA_CONFIG.PROXY_HOST}`);
    return await fetchWithBrightDataProxy(url, proxyUsername, proxyPassword);
  } catch (error) {
    console.error(`[BrightData] Error fetching URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

/**
 * Fetches a page using Bright Data HTTP proxy
 */
async function fetchWithBrightDataProxy(url: string, username: string, password: string): Promise<string> {
  try {
    const proxyUrl = `http://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${BRIGHT_DATA_CONFIG.PROXY_HOST}:${BRIGHT_DATA_CONFIG.PROXY_PORT}`;
    console.log(`[BrightData] Using proxy URL: ${proxyUrl.substring(0, 10)}...`);
    
    const controller = new AbortController();
    // Timeout after 30 seconds
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    // Fetch with Bright Data proxy using fetch options
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'max-age=0'
      },
      signal: controller.signal,
      // @ts-ignore - Deno fetch has a different signature than standard fetch
      client: {
        proxy: proxyUrl
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[BrightData] HTTP error! Status: ${response.status}, Response: ${errorText.substring(0, 200)}...`);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const html = await response.text();
    console.log(`[BrightData] Successfully fetched HTML (length: ${html.length})`);
    
    return html;
  } catch (error) {
    console.error(`[BrightData] Error fetching with proxy: ${error instanceof Error ? error.message : 'Unknown error'}`);
    
    if (error.name === 'AbortError') {
      throw new Error('Request to Bright Data proxy timed out after 30 seconds');
    }
    
    throw error;
  }
}

/**
 * Fetches a page using Bright Data API
 */
async function fetchWithBrightDataApi(url: string, apiKey: string): Promise<string> {
  try {
    const apiUrl = 'https://api.brightdata.com/scrape';
    console.log(`[BrightData] Using API URL: ${apiUrl}`);
    
    const controller = new AbortController();
    // Timeout after 60 seconds
    const timeoutId = setTimeout(() => controller.abort(), 60000);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        url: url,
        render: 'html',
        proxy_type: 'residential',
        timeout: 30000, // 30 second timeout
        keep_headers: true,
        keep_cookies: true,
        // Optional settings to improve success rate
        stealth_mode: true,
        browser_instructions: [
          { wait_for: 'body' },
          { wait: 2000 } // Wait 2 seconds after body is loaded
        ],
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[BrightData] API error! Status: ${response.status}, Response: ${errorText.substring(0, 200)}...`);
      throw new Error(`Bright Data API error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    const html = data.body || data.html || '';
    
    if (!html || html.length < 50) {
      console.error(`[BrightData] API returned empty or very short HTML: ${html}`);
      throw new Error('Bright Data API returned empty or invalid HTML');
    }
    
    console.log(`[BrightData] Successfully fetched HTML from API (length: ${html.length})`);
    return html;
  } catch (error) {
    console.error(`[BrightData] Error fetching with API: ${error instanceof Error ? error.message : 'Unknown error'}`);
    
    if (error.name === 'AbortError') {
      throw new Error('Request to Bright Data API timed out after 60 seconds');
    }
    
    throw error;
  }
}
