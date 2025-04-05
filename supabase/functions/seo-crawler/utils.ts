
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

/**
 * Normalize a URL for consistent comparison
 */
export function normalizeUrl(url: string): string {
  try {
    // Ensure URL starts with http/https
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    // Create a URL object to normalize the URL
    const urlObj = new URL(url);
    
    // Remove trailing slash if present
    let normalizedUrl = urlObj.href;
    if (normalizedUrl.endsWith('/') && urlObj.pathname !== '/') {
      normalizedUrl = normalizedUrl.slice(0, -1);
    }
    
    return normalizedUrl;
  } catch (e) {
    console.warn(`Error normalizing URL ${url}: ${e instanceof Error ? e.message : String(e)}`);
    return url; // Return original URL if normalization fails
  }
}

/**
 * Queue links for crawling
 * This function is not currently used but may be needed for multi-page crawling
 */
export async function queueLinksForCrawling(
  supabase: SupabaseInstance,
  crawlId: string,
  links: string[],
  baseUrl: string
): Promise<void> {
  try {
    // Filter to only include internal links
    const internalLinks = links.filter(link => isInternalUrl(link, baseUrl));
    
    if (internalLinks.length === 0) {
      return; // No internal links to queue
    }
    
    console.log(`Queueing ${internalLinks.length} internal links for crawling`);
    
    // Insert links in batches to avoid potential database limitations
    const batchSize = 25;
    for (let i = 0; i < internalLinks.length; i += batchSize) {
      const batch = internalLinks.slice(i, i + batchSize);
      
      const linksToInsert = batch.map(url => ({
        crawl_id: crawlId,
        url: url,
        status: 'queued',
        created_at: new Date().toISOString()
      }));
      
      const { error } = await supabase
        .from('seo_crawler_queue')
        .insert(linksToInsert);
      
      if (error) {
        console.error(`Error queueing links: ${error.message}`, error);
      }
    }
  } catch (e) {
    console.error(`Failed to queue links: ${e instanceof Error ? e.message : String(e)}`);
  }
}
