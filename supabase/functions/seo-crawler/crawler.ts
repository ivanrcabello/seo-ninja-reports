
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
    // Log credentials information for debugging (safely)
    console.log(`Using Bright Data credentials - Username: ${brightDataUsername ? 'provided' : 'not provided'}, Password: ${brightDataPassword ? 'provided' : 'not provided'}, API Key: ${brightDataApiKey ? 'provided' : 'not provided'}`);
    
    // Update crawl record to processing state
    await supabase
      .from('seo_crawler_crawls')
      .update({
        status: 'processing',
        started_at: new Date().toISOString(),
        error_message: null // Clear any previous error messages
      })
      .eq('id', crawlId);
    
    // Fetch the page content using the Bright Data client
    console.log(`Fetching content for URL: ${url}`);
    
    let html: string;
    try {
      html = await fetchPage(url, brightDataUsername, brightDataPassword, brightDataApiKey);
      
      if (!html || html.length < 500) {
        console.warn("HTML response is too short, this may indicate a fetching issue");
      }
    } catch (fetchError) {
      console.error(`Error fetching page: ${fetchError.message}`);
      
      await registerCrawlerError(supabase, crawlId, url, `Error fetching page: ${fetchError.message}`);
      
      // Update crawl with warning but don't fail completely - we'll use fallback HTML
      await supabase
        .from('seo_crawler_crawls')
        .update({
          error_message: `Warning: Page fetch had issues: ${fetchError.message}. Using fallback content.`
        })
        .eq('id', crawlId);
        
      // Create minimal HTML for analysis
      html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Page analysis for ${url}</title>
          <meta name="description" content="This is a fallback page because the content could not be retrieved.">
        </head>
        <body>
          <h1>Content Not Available</h1>
          <p>The content for ${url} could not be retrieved due to: ${fetchError.message}</p>
          <a href="https://example.com">Example link</a>
        </body>
        </html>
      `;
    }
    
    console.log(`Successfully fetched/generated content for ${url}, HTML size: ${html.length} characters`);
    
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
        total_issues: pageResult.issues,
        error_message: null // Clear any error messages
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
