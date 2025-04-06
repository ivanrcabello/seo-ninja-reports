
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
  const username = brightDataUsername || Deno.env.get("BRIGHT_DATA_USERNAME") || "brd-customer-hl_cbc2d791-zone-web_unlocker1";
  const password = brightDataPassword || Deno.env.get("BRIGHT_DATA_PASSWORD") || "5d024usr515b";
  
  if (!username || !password) {
    throw new Error("Missing Bright Data credentials");
  }
  
  try {
    // Create auth header
    const auth = btoa(`${username}:${password}`);
    
    // Configure headers
    const headers = new Headers({
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'es,en-US;q=0.7,en;q=0.3',
      'Proxy-Authorization': `Basic ${auth}`
    });
    
    // Set timeout for request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
    
    // Fetch the URL
    const response = await fetch(url, {
      headers,
      signal: controller.signal,
    });
    
    // Clear timeout
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    // Get HTML content
    const html = await response.text();
    console.log(`Successfully fetched HTML: ${html.length} characters`);
    
    if (html.length < 100) {
      console.warn(`Warning: HTML content is suspiciously short (${html.length} characters)`);
    }
    
    return html;
  } catch (error) {
    console.error(`Error fetching HTML: ${error.message}`);
    
    // Fallback to a more direct approach if first attempt fails
    try {
      console.log('Trying fallback fetch method...');
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
        // 30 second timeout
        signal: AbortSignal.timeout(30000)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const html = await response.text();
      console.log(`Successfully fetched HTML with fallback method: ${html.length} characters`);
      
      return html;
    } catch (fallbackError) {
      console.error(`Fallback fetch also failed: ${fallbackError.message}`);
      throw error; // Throw the original error
    }
  }
}
