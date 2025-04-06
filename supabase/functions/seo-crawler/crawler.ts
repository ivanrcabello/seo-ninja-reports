
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
    
    // Log first few chars of API key for debugging
    if (brightDataApiKey) {
      console.log(`API Key first 10 chars: ${brightDataApiKey.substring(0, 10)}...`);
    }
    
    // Setting environment variables for the current request
    if (brightDataUsername) Deno.env.set("BRIGHT_DATA_USERNAME", brightDataUsername);
    if (brightDataPassword) Deno.env.set("BRIGHT_DATA_PASSWORD", brightDataPassword);
    if (brightDataApiKey) Deno.env.set("BRIGHT_DATA_API_KEY", brightDataApiKey);
    
    console.log("About to call fetchPage with Bright Data credentials");
    const html = await fetchPage(url, brightDataUsername, brightDataPassword, brightDataApiKey);
    console.log("Returned from fetchPage call");
    
    if (!html) {
      console.error("Failed to fetch page content - HTML is null or empty");
      await registerCrawlerError(supabase, crawlId, url, "Failed to fetch page content - HTML is null or empty");
      
      // Update crawl status to failed
      await supabase
        .from('seo_crawler_crawls')
        .update({
          status: 'failed',
          error_message: 'Failed to fetch page content - HTML is null or empty',
          completed_at: new Date().toISOString()
        })
        .eq('id', crawlId);
        
      return false;
    }
    
    console.log(`Successfully fetched content for ${url}, HTML size: ${html.length} characters`);
    console.log(`HTML preview (first 200 chars): ${html.substring(0, 200)}`);
    
    // Process the HTML content
    console.log("Processing HTML content");
    const pageResult = await processHtml(supabase, url, crawlId, html);
    
    if (!pageResult) {
      console.error("HTML processing failed");
      
      // Update crawl status to failed
      await supabase
        .from('seo_crawler_crawls')
        .update({
          status: 'failed',
          error_message: 'HTML processing failed',
          completed_at: new Date().toISOString()
        })
        .eq('id', crawlId);
      
      return false;
    }
    
    console.log(`Successfully processed page: ${url}`);
    console.log(`Found ${pageResult.issues} issues and ${pageResult.links.length} links`);
    
    // Update crawl with success status
    await supabase
      .from('seo_crawler_crawls')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        pages_crawled: 1,
        total_pages: 1,
        total_issues: pageResult.issues
      })
      .eq('id', crawlId);
      
    console.log(`Updated crawl record to completed status`);
    
    return true;
  } catch (error) {
    console.error(`Error crawling page ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error(`Stack trace: ${error instanceof Error ? error.stack : 'No stack trace'}`);
    
    // Register the error in the database
    try {
      await registerCrawlerError(supabase, crawlId, url, error instanceof Error ? error.message : String(error));
      
      // Update crawl status to failed
      await supabase
        .from('seo_crawler_crawls')
        .update({
          status: 'failed',
          error_message: error instanceof Error ? error.message : String(error),
          completed_at: new Date().toISOString()
        })
        .eq('id', crawlId);
        
      console.log(`Updated crawl record to failed status`);
    } catch (regError) {
      console.error(`Failed to register crawler error: ${regError instanceof Error ? regError.message : 'Unknown error'}`);
    }
    
    return false;
  }
}
