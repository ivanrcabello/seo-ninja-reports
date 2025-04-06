
// Utility functions for SEO crawler
import { SupabaseInstance } from "./types.ts";

/**
 * Check if a URL is internal to a domain
 */
export function isInternalUrl(url: string, baseUrl: string): boolean {
  try {
    // Clean up the base URL to get the domain
    let domain = baseUrl;
    if (domain.startsWith("http://")) domain = domain.substring(7);
    if (domain.startsWith("https://")) domain = domain.substring(8);
    if (domain.startsWith("www.")) domain = domain.substring(4);
    domain = domain.split('/')[0]; // Remove any paths
    
    // Now check if the URL is internal
    if (url.includes(domain)) return true;
    
    // Check for relative URLs
    if (!url.includes('://')) return true;
    
    return false;
  } catch (e) {
    console.error(`Error in isInternalUrl: ${e}`);
    return false;
  }
}

/**
 * Register an error in the database
 */
export async function registerCrawlerError(
  supabase: SupabaseInstance,
  crawlId: string,
  url: string,
  error: string
): Promise<void> {
  try {
    await supabase
      .from('seo_crawler_errors')
      .insert({
        crawl_id: crawlId,
        url: url,
        error_message: error,
        error_time: new Date().toISOString()
      });
  } catch (err) {
    console.error(`Failed to register crawler error in database: ${err}`);
  }
}

/**
 * Sanitize HTML string
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  
  // Remove script and style tags and their contents
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  // Remove HTML comments
  sanitized = sanitized.replace(/<!--[\s\S]*?-->/g, '');
  
  // Remove excessive whitespace
  sanitized = sanitized.replace(/\s+/g, ' ').trim();
  
  return sanitized;
}

/**
 * Extract domain from URL
 */
export function extractDomain(url: string): string {
  try {
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }
    
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (e) {
    console.error(`Error extracting domain from ${url}: ${e}`);
    
    // Fallback method using regex
    try {
      const matches = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im);
      return matches ? matches[1] : url;
    } catch (regexError) {
      return url;
    }
  }
}

/**
 * Get content type from HTML
 */
export function getContentType(html: string): string {
  if (!html) return 'unknown';
  
  if (html.includes('<!DOCTYPE html') || html.includes('<html')) {
    return 'text/html';
  }
  
  // Check if JSON
  if ((html.trim().startsWith('{') && html.trim().endsWith('}')) || 
      (html.trim().startsWith('[') && html.trim().endsWith(']'))) {
    try {
      JSON.parse(html);
      return 'application/json';
    } catch (e) {
      // Not valid JSON
    }
  }
  
  // Check if XML
  if (html.includes('<?xml') || html.includes('<rss') || html.includes('<feed')) {
    return 'text/xml';
  }
  
  // Default to text
  return 'text/plain';
}

/**
 * Convert URLs to absolute URLs
 */
export function toAbsoluteUrl(relativeUrl: string, baseUrl: string): string {
  try {
    // If it's already absolute, return it
    if (relativeUrl.match(/^https?:\/\//i)) {
      return relativeUrl;
    }
    
    // Make sure base URL has protocol
    if (!baseUrl.startsWith('http')) {
      baseUrl = 'https://' + baseUrl;
    }
    
    // Use URL constructor for proper resolution
    return new URL(relativeUrl, baseUrl).href;
  } catch (e) {
    console.error(`Error converting to absolute URL: ${e}`);
    return relativeUrl;
  }
}
