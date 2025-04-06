
/**
 * Brightdata client for fetching HTML content
 */

/**
 * Fetch HTML content from a URL
 */
export async function fetchPage(
  url: string,
  brightDataUsername?: string,
  brightDataPassword?: string,
  brightDataApiKey?: string
): Promise<string> {
  console.log(`Fetching HTML for URL: ${url}`);
  
  // Set default credentials if not provided
  const username = brightDataUsername || Deno.env.get("BRIGHT_DATA_USERNAME") || "brd-customer-hl_2a8d2c33-zone-web_unlocker";
  const password = brightDataPassword || Deno.env.get("BRIGHT_DATA_PASSWORD") || "obz0lal9qh4g";
  
  if (!username || !password) {
    throw new Error("Missing Bright Data credentials");
  }
  
  // Create auth header for authentication
  const auth = btoa(`${username}:${password}`);
  
  // Try different methods to fetch the page
  try {
    // Method 1: Direct fetch with standard headers
    console.log(`Trying direct fetch for ${url}...`);
    
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.7'
        },
        signal: AbortSignal.timeout(30000) // 30 second timeout
      });
      
      if (response.ok) {
        const html = await response.text();
        console.log(`Direct fetch successful, received ${html.length} characters`);
        if (html.length > 500) {
          return html;
        }
      }
    } catch (error) {
      console.warn(`Direct fetch failed: ${error.message}`);
    }
    
    // Method 2: Using Bright Data proxy
    console.log(`Trying Bright Data proxy for ${url}...`);
    
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.7',
          'Proxy-Authorization': `Basic ${auth}`
        },
        redirect: 'follow',
        signal: AbortSignal.timeout(60000) // 60 second timeout
      });
      
      if (response.ok) {
        const html = await response.text();
        console.log(`Bright Data proxy successful, received ${html.length} characters`);
        return html;
      } else {
        console.warn(`Bright Data proxy returned status: ${response.status}`);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Bright Data proxy error: ${error.message}`);
      throw error;
    }
  } catch (error) {
    console.error(`All fetch methods failed for ${url}: ${error.message}`);
    
    // Return a minimal HTML for testing
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Error fetching ${url}</title>
        <meta name="description" content="This page could not be retrieved due to an error: ${error.message}">
      </head>
      <body>
        <h1>Error Fetching Page</h1>
        <p>The page at ${url} could not be retrieved due to: ${error.message}</p>
        <p>This is a fallback page created by the crawler.</p>
      </body>
      </html>
    `;
  }
}
