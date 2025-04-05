
// Utility functions for SEO crawler
import { SupabaseInstance } from './types.ts';

/**
 * Register a crawler error for tracking
 */
export async function registerCrawlerError(
  supabase: SupabaseInstance,
  crawlId: string,
  url: string,
  errorMessage: string
): Promise<void> {
  try {
    console.error(`Crawler error: ${errorMessage} (URL: ${url}, crawlId: ${crawlId})`);
    
    // Insert error record
    const { error } = await supabase
      .from('seo_crawler_errors')
      .insert({
        crawl_id: crawlId,
        url: url,
        error_message: errorMessage,
        created_at: new Date().toISOString()
      });
    
    if (error) {
      console.error(`Error registering crawler error: ${error.message}`, error);
    }
  } catch (e) {
    console.error(`Failed to register crawler error: ${e instanceof Error ? e.message : String(e)}`);
  }
}

/**
 * Check if a URL is internal relative to a base URL
 */
export function isInternalUrl(url: string, baseUrl: string): boolean {
  try {
    // Handle relative URLs
    if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
      return true;
    }
    
    // Handle fragment-only URLs
    if (url.startsWith('#')) {
      return true;
    }
    
    // Parse URLs for comparison
    const urlObj = new URL(url);
    let baseUrlObj: URL;
    
    try {
      baseUrlObj = new URL(baseUrl);
    } catch (e) {
      // If baseUrl is invalid, try to create a URL object from it
      baseUrlObj = new URL(`http://${baseUrl}`);
    }
    
    // Compare domains
    return urlObj.hostname === baseUrlObj.hostname;
  } catch (e) {
    // If URL parsing fails, assume it's internal (relative URL)
    return true;
  }
}
