
// HTML element extractors module
import { normalizeUrl, isInternalUrl } from '../../utils.ts';

/**
 * Extract title tag from HTML content
 */
export function extractTitle(html: string): string | null {
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : null;
  return title;
}

/**
 * Extract meta description from HTML content
 */
export function extractMetaDescription(html: string): string | null {
  const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i) || 
                        html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i);
  const metaDescription = metaDescMatch ? metaDescMatch[1].trim() : null;
  return metaDescription;
}

/**
 * Extract h1 heading from HTML content
 */
export function extractH1(html: string): string | null {
  const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
  const h1 = h1Match ? h1Match[1].trim() : null;
  return h1;
}

/**
 * Extract links from HTML content
 */
export function extractLinks(html: string, baseUrl: string): string[] {
  try {
    const links: string[] = [];
    const linkRegex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>/gi;
    let match;
    
    while ((match = linkRegex.exec(html)) !== null) {
      let href = match[1].trim();
      
      // Skip empty, javascript:, mailto:, tel: and anchor links
      if (!href || 
          href.startsWith('javascript:') || 
          href.startsWith('mailto:') || 
          href.startsWith('tel:') || 
          href.startsWith('#')) {
        continue;
      }
      
      // Normalize URL if it's relative
      if (href.startsWith('/')) {
        const urlObj = new URL(baseUrl);
        href = urlObj.origin + href;
      } else if (!href.startsWith('http')) {
        const urlObj = new URL(baseUrl);
        // Handle relative URLs without leading slash
        if (urlObj.pathname.endsWith('/')) {
          href = urlObj.origin + urlObj.pathname + href;
        } else {
          const pathParts = urlObj.pathname.split('/');
          pathParts.pop(); // Remove the last part
          href = urlObj.origin + pathParts.join('/') + '/' + href;
        }
      }
      
      links.push(href);
    }
    
    console.log(`Extracted ${links.length} links from HTML`);
    return links;
  } catch (error) {
    console.error('Error extracting links:', error);
    return [];
  }
}

/**
 * Categorize links as internal or external
 */
export function categorizeLinks(links: string[], baseUrl: string): { internalLinks: string[], externalLinks: string[] } {
  const internalLinks = links.filter(link => isInternalUrl(baseUrl, link));
  const externalLinks = links.filter(link => !isInternalUrl(baseUrl, link));
  
  console.log(`Internal links: ${internalLinks.length}, External links: ${externalLinks.length}`);
  
  return { internalLinks, externalLinks };
}
