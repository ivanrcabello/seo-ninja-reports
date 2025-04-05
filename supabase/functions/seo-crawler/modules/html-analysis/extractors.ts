
// HTML data extraction utilities
import { isInternalUrl } from '../../utils.ts';

/**
 * Extract page title from HTML
 */
export function extractTitle(html: string): string | null {
  try {
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    return titleMatch ? titleMatch[1].trim() : null;
  } catch (error) {
    console.error('Error extracting title:', error);
    return null;
  }
}

/**
 * Extract meta description from HTML
 */
export function extractMetaDescription(html: string): string | null {
  try {
    const metaMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["'](.*?)["'][^>]*>/i) || 
                      html.match(/<meta[^>]*content=["'](.*?)["'][^>]*name=["']description["'][^>]*>/i);
    return metaMatch ? metaMatch[1].trim() : null;
  } catch (error) {
    console.error('Error extracting meta description:', error);
    return null;
  }
}

/**
 * Extract H1 from HTML
 */
export function extractH1(html: string): string | null {
  try {
    const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
    return h1Match ? 
      h1Match[1]
        .replace(/<[^>]+>/g, '') // Remove any nested HTML tags
        .trim() 
      : null;
  } catch (error) {
    console.error('Error extracting H1:', error);
    return null;
  }
}

/**
 * Extract links from HTML
 */
export function extractLinks(html: string, baseUrl: string): string[] {
  try {
    const links: string[] = [];
    const linkRegex = /<a\s+(?:[^>]*?\s+)?href=["']([^"']*)["'][^>]*>/gi;
    
    let match;
    while ((match = linkRegex.exec(html)) !== null) {
      let href = match[1].trim();
      
      // Skip empty or javascript: links
      if (!href || href.startsWith('javascript:') || href === '#') {
        continue;
      }
      
      // Handle relative URLs
      if (href.startsWith('/') || !href.includes('://')) {
        // Create a proper URL
        try {
          const url = new URL(href, baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`);
          href = url.href;
        } catch (e) {
          console.warn(`Could not parse relative URL: ${href}, skipping`);
          continue;
        }
      }
      
      links.push(href);
    }
    
    // Remove duplicates and return
    return [...new Set(links)];
  } catch (error) {
    console.error('Error extracting links:', error);
    return [];
  }
}

/**
 * Categorize links as internal or external
 */
export function categorizeLinks(links: string[], baseUrl: string): { 
  internalLinks: string[], 
  externalLinks: string[] 
} {
  try {
    const internalLinks: string[] = [];
    const externalLinks: string[] = [];
    
    for (const link of links) {
      if (isInternalUrl(link, baseUrl)) {
        internalLinks.push(link);
      } else {
        externalLinks.push(link);
      }
    }
    
    return { internalLinks, externalLinks };
  } catch (error) {
    console.error('Error categorizing links:', error);
    return { internalLinks: [], externalLinks: [] };
  }
}
