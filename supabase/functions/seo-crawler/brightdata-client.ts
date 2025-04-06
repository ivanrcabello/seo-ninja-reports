
// Client for Bright Data web unlocker and scraping
import { corsHeaders } from './cors-headers.ts';

// Helper functions for debugging
const logRequestStart = (url: string, method: string) => {
  console.log(`[Bright Data] ${method} request to: ${url}`);
};

const logRequestSuccess = (url: string, method: string, responseSize: number) => {
  console.log(`[Bright Data] ${method} request succeeded, received ${responseSize} bytes`);
};

const logRequestError = (url: string, method: string, error: any) => {
  console.error(`[Bright Data] ${method} request failed: ${error.message || 'Unknown error'}`);
  console.error(`[Bright Data] Stack trace: ${error.stack || 'No stack trace'}`);
};

/**
 * Fetch a page using one of multiple methods to ensure reliability
 */
export async function fetchPage(
  url: string,
  brightDataUsername?: string,
  brightDataPassword?: string,
  brightDataApiKey?: string
): Promise<string> {
  console.log(`[Bright Data] Fetching page: ${url}`);
  console.log(`[Bright Data] Using credentials - Username: ${brightDataUsername ? 'provided' : 'not provided'}, API Key: ${brightDataApiKey ? 'provided' : 'not provided'}`);
  
  // Store attempts to track what has been tried
  const attempts: Array<{method: string, status?: number, error?: string}> = [];
  
  // Function to create a fallback HTML in case all methods fail
  const createFallbackHtml = (error: any): string => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Fallback Page for ${url}</title>
        <meta name="description" content="This is a fallback page because the content could not be retrieved.">
      </head>
      <body>
        <h1>Fallback Page</h1>
        <p>This is a fallback page for URL: ${url}</p>
        <p>The actual page could not be retrieved due to technical difficulties:</p>
        <p>Error: ${error instanceof Error ? error.message : String(error)}</p>
        <div>
          <h2>Attempted Methods:</h2>
          <ul>
            ${attempts.map(a => `<li>${a.method}: ${a.status ? `Status: ${a.status}` : a.error || 'Unknown error'}</li>`).join('')}
          </ul>
        </div>
        <a href="https://example.com">Example Link</a>
      </body>
      </html>
    `;
  };
  
  try {
    // Method 1: Direct API key method (if we have an API key)
    if (brightDataApiKey) {
      console.log(`[Bright Data] Using direct API key method for ${url}`);
      
      try {
        const html = await fetchWithDirectApi(url, brightDataApiKey);
        if (html && html.length > 500) {
          console.log(`[Bright Data] Direct API key method successful, got ${html.length} characters`);
          return html;
        } else {
          console.warn(`[Bright Data] Direct API key method returned insufficient data: ${html?.length || 0} characters`);
          attempts.push({method: 'Direct API', error: 'Insufficient content length'});
        }
      } catch (error) {
        console.error(`[Bright Data] Direct API key method failed: ${error.message || 'Unknown error'}`);
        attempts.push({method: 'Direct API', error: error.message || 'Unknown error'});
      }
    }

    // Method 2: Username/password proxy method
    if (brightDataUsername && brightDataPassword) {
      console.log(`[Bright Data] Using proxy method for ${url}`);
      
      try {
        const html = await fetchWithProxy(url, brightDataUsername, brightDataPassword);
        if (html && html.length > 500) {
          console.log(`[Bright Data] Proxy method successful, got ${html.length} characters`);
          return html;
        } else {
          console.warn(`[Bright Data] Proxy method returned insufficient data: ${html?.length || 0} characters`);
          attempts.push({method: 'Proxy', error: 'Insufficient content length'});
        }
      } catch (error) {
        console.error(`[Bright Data] Proxy method failed: ${error.message || 'Unknown error'}`);
        attempts.push({method: 'Proxy', error: error.message || 'Unknown error'});
      }
    }

    // Method 3: Simple fetch without proxy (may work for simple sites)
    console.log(`[Bright Data] Using simple fetch method for ${url}`);
    
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        redirect: 'follow'
      });
      
      attempts.push({method: 'Simple fetch', status: response.status});
      
      if (response.ok) {
        const html = await response.text();
        if (html && html.length > 500) {
          console.log(`[Bright Data] Simple fetch method successful, got ${html.length} characters`);
          return html;
        } else {
          console.warn(`[Bright Data] Simple fetch method returned insufficient data: ${html?.length || 0} characters`);
        }
      } else {
        console.warn(`[Bright Data] Simple fetch failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error(`[Bright Data] Simple fetch method failed: ${error.message || 'Unknown error'}`);
      attempts.push({method: 'Simple fetch', error: error.message || 'Unknown error'});
    }
    
    // All methods failed, return a fallback HTML
    console.error('[Bright Data] All methods failed, returning fallback HTML');
    return createFallbackHtml({message: 'All fetch methods failed'});
    
  } catch (error) {
    console.error(`[Bright Data] Error in fetchPage: ${error.message || 'Unknown error'}`);
    return createFallbackHtml(error);
  }
}

/**
 * Fetch a page using Bright Data's direct API
 */
async function fetchWithDirectApi(url: string, apiKey: string): Promise<string> {
  try {
    console.log(`[Bright Data API] Fetching URL: ${url} with API key starting with ${apiKey.substring(0, 5)}...`);
    
    // Build the request payload
    const payload = {
      url: url,
      render_js: true,
      browser: true
    };
    
    console.log(`[Bright Data API] Request payload: ${JSON.stringify(payload)}`);
    
    // Make the API call to Bright Data
    console.log(`[Bright Data API] Sending request to https://api.brightdata.com/dca/dataset`);
    const response = await fetch('https://api.brightdata.com/dca/dataset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });
    
    console.log(`[Bright Data API] Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      throw new Error(`[Bright Data API] Error: ${response.statusText}`);
    }
    
    // Clone the response before reading the body to avoid the "Body already consumed" error
    const clonedResponse = response.clone();
    
    try {
      // Try parsing as JSON first
      const jsonData = await clonedResponse.json();
      
      // If we have JSON data, extract the HTML content
      if (jsonData.body) {
        console.log(`[Bright Data API] Successfully received JSON response with body field`);
        return jsonData.body;
      } else if (jsonData.html) {
        console.log(`[Bright Data API] Successfully received JSON response with html field`);
        return jsonData.html;
      } else if (jsonData.content) {
        console.log(`[Bright Data API] Successfully received JSON response with content field`);
        return jsonData.content;
      } else {
        console.error(`[Bright Data API] JSON response doesn't contain expected HTML content`);
        throw new Error("JSON response doesn't contain HTML content");
      }
    } catch (jsonParseError) {
      // If not a valid JSON, try getting as text
      console.log(`[Bright Data API] Response is not JSON, trying to get as text`);
      const text = await response.text();
      if (text && text.length > 0) {
        return text;
      } else {
        throw new Error("Empty response");
      }
    }
  } catch (error) {
    console.error(`[Bright Data API] Error: ${error.message || 'Unknown error'}`);
    throw error;
  }
}

/**
 * Fetch a page using Bright Data as a proxy
 */
async function fetchWithProxy(url: string, username: string, password: string): Promise<string> {
  try {
    console.log(`[Bright Data Proxy] Fetching URL: ${url} with username: ${username.substring(0, 5)}...`);
    
    const proxyAuth = btoa(`${username}:${password}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Proxy-Authorization': `Basic ${proxyAuth}`
      },
      redirect: 'follow'
    });
    
    console.log(`[Bright Data Proxy] Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      throw new Error(`Proxy request failed with status: ${response.status}`);
    }
    
    const html = await response.text();
    console.log(`[Bright Data Proxy] Successfully received HTML, size: ${html.length} characters`);
    
    return html;
  } catch (error) {
    console.error(`[Bright Data Proxy] Error: ${error.message || 'Unknown error'}`);
    throw error;
  }
}
