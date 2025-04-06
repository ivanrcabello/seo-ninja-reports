
// Utility functions for SEO crawler
import { SupabaseInstance } from "./types.ts";

/**
 * Register a crawler error in the database
 */
export async function registerCrawlerError(
  supabase: SupabaseInstance,
  crawlId: string,
  url: string,
  errorMessage: string
): Promise<void> {
  try {
    // Insert error into seo_crawler_errors
    const { error } = await supabase
      .from('seo_crawler_errors')
      .insert({
        crawl_id: crawlId,
        url: url,
        error_message: errorMessage,
      });

    if (error) {
      console.error(`Error registering crawler error: ${error.message}`);
    }
  } catch (error) {
    console.error(`Failed to register crawler error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check if a URL is internal to the domain being crawled
 */
export function isInternalUrl(url: string, baseUrl: string): boolean {
  try {
    const urlObj = new URL(url);
    const baseUrlObj = new URL(baseUrl);
    return urlObj.hostname === baseUrlObj.hostname;
  } catch (error) {
    return false;
  }
}
