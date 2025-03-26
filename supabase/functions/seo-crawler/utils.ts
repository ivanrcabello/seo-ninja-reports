
// Utility functions for SEO crawler
import { SupabaseInstance } from './types.ts';
import { corsHeaders } from './constants.ts';

// Normalize URL to ensure consistency
export function normalizeUrl(url: string): string {
  try {
    // If URL doesn't have a protocol, add https://
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    // Parse and normalize the URL
    const parsedUrl = new URL(url);
    
    // Remove trailing slash for consistency
    let normalizedUrl = parsedUrl.origin + parsedUrl.pathname;
    if (normalizedUrl.endsWith('/') && normalizedUrl.length > 1) {
      normalizedUrl = normalizedUrl.slice(0, -1);
    }
    
    // Add search params if any
    if (parsedUrl.search) {
      normalizedUrl += parsedUrl.search;
    }
    
    return normalizedUrl;
  } catch (error) {
    console.error('Error normalizing URL:', error);
    return url; // Return original if something goes wrong
  }
}

// Check if a URL is internal to the domain
export function isInternalUrl(baseUrl: string, url: string): boolean {
  try {
    // Handle relative URLs
    if (url.startsWith('/')) {
      console.log(`URL ${url} is internal: true (relative path)`);
      return true;
    }
    
    // Handle absolute URLs
    const baseHostname = new URL(baseUrl).hostname;
    let urlHostname;
    
    try {
      urlHostname = new URL(url).hostname;
    } catch (urlError) {
      // If we can't parse the URL, try to add the base URL
      try {
        urlHostname = new URL(url, baseUrl).hostname;
      } catch (combinedError) {
        console.error(`Could not parse URL ${url} even with base URL`);
        return false;
      }
    }
    
    // Remove 'www.' prefix for comparison
    const normalizedBaseHostname = baseHostname.replace(/^www\./i, '');
    const normalizedUrlHostname = urlHostname.replace(/^www\./i, '');
    
    const isInternal = normalizedBaseHostname === normalizedUrlHostname;
    console.log(`URL ${url} is internal: ${isInternal} (${normalizedUrlHostname} vs ${normalizedBaseHostname})`);
    return isInternal;
  } catch (error) {
    console.error(`Error checking if URL is internal ${url}:`, error);
    return false;
  }
}

// Register crawler errors in the database
export async function registerCrawlerError(
  supabase: SupabaseInstance,
  crawlId: string,
  url: string,
  errorMessage: string
): Promise<void> {
  try {
    console.log(`Registering error for URL ${url}: ${errorMessage}`);
    
    // Update the crawl record with the error
    const { error } = await supabase
      .from('seo_crawler_crawls')
      .update({
        status: 'failed',
        error_message: errorMessage,
        completed_at: new Date().toISOString()
      })
      .eq('id', crawlId);
      
    if (error) {
      console.error('Error updating crawl status:', error);
    }
  } catch (error) {
    console.error('Error in registerCrawlerError:', error);
  }
}

// Queue links for crawling (simplified version for now)
export async function queueLinksForCrawling(
  supabase: SupabaseInstance,
  pageId: string,
  links: string[],
  crawlId: string,
  sourceUrl: string
): Promise<void> {
  try {
    if (!links || links.length === 0) {
      console.log('No links to process');
      return;
    }
    
    console.log(`Saving ${links.length} links for page ${pageId}`);
    
    // Insert links into the links table
    const linksToInsert = links.map(url => ({
      crawl_id: crawlId,
      page_id: pageId,
      url: url,
      is_internal: isInternalUrl(sourceUrl, url),
      is_broken: false,
      follow: true
    }));
    
    if (linksToInsert.length > 0) {
      const { error } = await supabase
        .from('seo_crawler_links')
        .insert(linksToInsert);
        
      if (error) {
        console.error('Error saving links:', error);
      } else {
        console.log(`${linksToInsert.length} links saved successfully`);
      }
    }
  } catch (error) {
    console.error(`Error processing links from ${sourceUrl}:`, error);
  }
}
