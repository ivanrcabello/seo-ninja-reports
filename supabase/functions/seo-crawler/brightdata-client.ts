
// Client for Bright Data web unlocker and scraping
import { corsHeaders } from './cors-headers.ts';

// List of common user agents for better compatibility
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
];

// Get a random user agent from the list
function getRandomUserAgent() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

/**
 * Fetch a page using Bright Data's Scraping Browser
 */
export async function fetchPage(
  url: string,
  brightDataUsername?: string,
  brightDataPassword?: string,
  brightDataApiKey?: string
): Promise<string> {
  console.log(`[Bright Data] Fetching page: ${url}`);
  console.log(`[Bright Data] Using credentials - Username: ${brightDataUsername ? 'provided' : 'not provided'}, API Key: ${brightDataApiKey ? 'provided' : 'not provided'}`);
  
  // Try each method in sequence
  try {
    // Method 1: Direct API Key method (preferred)
    if (brightDataApiKey) {
      try {
        console.log(`[Bright Data] Attempting direct API call with key`);
        const html = await fetchWithScrapingBrowser(url, brightDataApiKey);
        if (html && html.length > 1000) {
          console.log(`[Bright Data] Successfully fetched page with API key (${html.length} chars)`);
          return html;
        } else {
          console.warn(`[Bright Data] API response too short (${html?.length || 0} chars), trying next method`);
        }
      } catch (error) {
        console.error(`[Bright Data] API Key method failed: ${error.message}`);
      }
    }
    
    // Method 2: Web Unlocker zone with username/password
    if (brightDataUsername && brightDataPassword) {
      try {
        console.log(`[Bright Data] Attempting Web Unlocker direct API call`);
        const html = await fetchWithWebUnlocker(url, brightDataUsername, brightDataPassword);
        if (html && html.length > 1000) {
          console.log(`[Bright Data] Successfully fetched with Web Unlocker (${html.length} chars)`);
          return html;
        } else {
          console.warn(`[Bright Data] Web Unlocker response too short (${html?.length || 0} chars), trying next method`);
        }
      } catch (error) {
        console.error(`[Bright Data] Web Unlocker method failed: ${error.message}`);
      }
    }
    
    // Method 3: Direct fetch (fallback, less reliable)
    try {
      console.log(`[Bright Data] Attempting direct fetch as fallback`);
      const response = await fetch(url, {
        headers: {
          'User-Agent': getRandomUserAgent(),
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9,es;q=0.8',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        redirect: 'follow'
      });
      
      if (response.ok) {
        const html = await response.text();
        console.log(`[Bright Data] Direct fetch succeeded (${html.length} chars)`);
        
        if (html && html.length > 1000) {
          return html;
        } else {
          console.warn(`[Bright Data] Direct fetch response too short (${html.length} chars)`);
        }
      } else {
        console.warn(`[Bright Data] Direct fetch failed with status ${response.status}`);
      }
    } catch (error) {
      console.error(`[Bright Data] Direct fetch method failed: ${error.message}`);
    }
    
    // All methods failed, try one more time with a proxy-like approach
    console.log(`[Bright Data] All methods failed, trying alternative approach...`);
    const puppeteerHtml = await simulatePuppeteerApproach(url);
    if (puppeteerHtml) {
      return puppeteerHtml;
    }
    
    // If everything fails, throw an error
    throw new Error("All HTML fetching methods failed");
    
  } catch (error) {
    console.error(`[Bright Data] Error in fetchPage: ${error.message}`);
    throw error;
  }
}

/**
 * Fetch page using Bright Data Scraping Browser API
 */
async function fetchWithScrapingBrowser(url: string, apiKey: string): Promise<string> {
  const endpoint = 'https://api.brightdata.com/scrape';
  
  const payload = {
    url: url,
    render_js: true,
    browser: true,
    browser_headers: {
      'User-Agent': getRandomUserAgent()
    },
    wait_for_selectors: ["title", "h1", "meta[name='description']"],
    wait_for: 5000, // 5 seconds
    timeout: 60000, // 60 seconds
    // More options for better rendering
    browser_idle_for: 3000, // Wait 3s after page loaded
    waitForNetworkIdle: true,
  };
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Bright Data API error (${response.status}): ${errorText}`);
  }
  
  try {
    const data = await response.json();
    
    if (data.body) {
      return data.body;
    } else if (data.html) {
      return data.html;
    } else if (data.content) {
      return data.content;
    } else if (data.results && data.results.content) {
      return data.results.content;
    } else {
      console.error("No HTML content found in API response:", JSON.stringify(data).substring(0, 200) + "...");
      throw new Error("No HTML content in API response");
    }
  } catch (error) {
    // If JSON parsing fails, try to get raw text
    const text = await response.text();
    if (text && text.includes("<html")) {
      return text;
    }
    throw error;
  }
}

/**
 * Fetch page using Bright Data Web Unlocker
 */
async function fetchWithWebUnlocker(url: string, username: string, password: string): Promise<string> {
  // Web Unlocker direct access API endpoint
  const endpoint = 'https://brightdata.com/api/direct-access';
  const auth = btoa(`${username}:${password}`);
  
  const payload = {
    url: url,
    render_js: true,
    zone: 'web_unlocker',
    browser: true,
    wait_for: 5000
  };
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${auth}`
    },
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Web Unlocker error (${response.status}): ${errorText}`);
  }
  
  try {
    const data = await response.json();
    
    if (data.body) {
      return data.body;
    } else if (data.html) {
      return data.html;
    } else if (data.content) {
      return data.content;
    } else {
      console.error("No HTML content found in Web Unlocker response");
      throw new Error("No HTML content in Web Unlocker response");
    }
  } catch (error) {
    // If JSON parsing fails, try to get raw text
    const text = await response.text();
    if (text && text.includes("<html")) {
      return text;
    }
    throw error;
  }
}

/**
 * Simulate a Puppeteer-like approach as a last resort
 * This doesn't actually use Puppeteer (not available in Deno) but mimics a similar request pattern
 */
async function simulatePuppeteerApproach(url: string): Promise<string | null> {
  try {
    console.log(`[Bright Data] Simulating browser-like request for ${url}`);
    
    // Make the request with browser-like headers
    const response = await fetch(url, {
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Referer': 'https://www.google.com/',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Sec-Ch-Ua': '"Google Chrome";v="115", "Chromium";v="115"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'cross-site',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1'
      },
      redirect: 'follow'
    });
    
    if (response.ok) {
      const html = await response.text();
      if (html && html.length > 1000) {
        console.log(`[Bright Data] Simulated browser approach succeeded (${html.length} chars)`);
        return html;
      }
    }
    
    console.log(`[Bright Data] Simulated browser approach failed (status: ${response.status})`);
    return null;
  } catch (error) {
    console.error(`[Bright Data] Simulated browser approach error: ${error.message}`);
    return null;
  }
}
