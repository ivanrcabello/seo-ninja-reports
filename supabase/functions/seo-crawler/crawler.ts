
// Crawler module for SEO analysis
import { SupabaseInstance } from "./types.ts";
import { fetchPage } from "./brightdata-client.ts";
import { processHtml } from "./modules/html-processor.ts";
import { registerCrawlerError } from "./utils.ts";

/**
 * Crawl a single page and process the HTML content
 */
export async function crawlPage(
  supabase: SupabaseInstance, 
  url: string, 
  crawlId: string,
  brightDataUsername?: string,
  brightDataPassword?: string,
  brightDataApiKey?: string
): Promise<boolean> {
  console.log(`Crawling page: ${url} for crawl ID: ${crawlId}`);
  
  try {
    // Fetch the page content using the Bright Data client
    console.log(`Fetching content for URL: ${url}`);
    console.log(`Using Bright Data credentials - Username: ${brightDataUsername ? 'provided' : 'not provided'}, Password: ${brightDataPassword ? 'provided' : 'not provided'}, API Key: ${brightDataApiKey ? 'provided' : 'not provided'}`);
    
    const html = await fetchPage(url, brightDataUsername, brightDataPassword, brightDataApiKey);
    
    if (!html) {
      console.error("Failed to fetch page content");
      await registerCrawlerError(supabase, crawlId, url, "Failed to fetch page content");
      return false;
    }
    
    console.log(`Successfully fetched content for ${url}, HTML size: ${html.length} characters`);
    
    // Process the HTML content
    console.log("Processing HTML content");
    const pageResult = await processHtml(supabase, url, crawlId, html);
    
    if (!pageResult) {
      console.error("HTML processing failed");
      return false;
    }
    
    console.log(`Successfully processed page: ${url}`);
    return true;
  } catch (error) {
    console.error(`Error crawling page ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error(`Stack trace: ${error instanceof Error ? error.stack : 'No stack trace'}`);
    
    // Register the error in the database
    try {
      await registerCrawlerError(supabase, crawlId, url, error instanceof Error ? error.message : String(error));
    } catch (regError) {
      console.error(`Failed to register crawler error: ${regError instanceof Error ? regError.message : 'Unknown error'}`);
    }
    
    return false;
  }
}
