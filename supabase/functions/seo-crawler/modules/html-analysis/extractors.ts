
// HTML data extraction utilities
import { isInternalUrl } from '../../utils.ts';
import * as cheerio from 'https://esm.sh/cheerio@1.0.0-rc.12';

/**
 * Extract page title from HTML using both regex and DOM parsing for better reliability
 */
export function extractTitle(html: string): string | null {
  try {
    // First try with cheerio (DOM parsing)
    const $ = cheerio.load(html);
    const titleElement = $('title').first();
    if (titleElement && titleElement.text().trim()) {
      return titleElement.text().trim();
    }
    
    // Fallback to regex
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    return titleMatch ? titleMatch[1].trim() : null;
  } catch (error) {
    console.error('Error extracting title:', error);
    
    // Last-resort regex attempt
    try {
      const lastResortMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
      return lastResortMatch ? lastResortMatch[1].trim() : null;
    } catch (e) {
      return null;
    }
  }
}

/**
 * Extract meta description from HTML using both regex and DOM parsing
 */
export function extractMetaDescription(html: string): string | null {
  try {
    // First try with cheerio (DOM parsing)
    const $ = cheerio.load(html);
    const metaDesc = $('meta[name="description"]').attr('content');
    if (metaDesc) {
      return metaDesc.trim();
    }
    
    // Fallback to regex
    const metaMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["'](.*?)["'][^>]*>/i) || 
                      html.match(/<meta[^>]*content=["'](.*?)["'][^>]*name=["']description["'][^>]*>/i);
    return metaMatch ? metaMatch[1].trim() : null;
  } catch (error) {
    console.error('Error extracting meta description:', error);
    
    // Last-resort regex
    try {
      const lastResortMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["'](.*?)["'][^>]*>/i);
      return lastResortMatch ? lastResortMatch[1].trim() : null;
    } catch (e) {
      return null;
    }
  }
}

/**
 * Extract H1 from HTML using both regex and DOM parsing
 */
export function extractH1(html: string): string | null {
  try {
    // First try with cheerio (DOM parsing)
    const $ = cheerio.load(html);
    const h1Element = $('h1').first();
    if (h1Element && h1Element.text().trim()) {
      return h1Element.text().trim();
    }
    
    // Fallback to regex
    const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
    return h1Match ? 
      h1Match[1]
        .replace(/<[^>]+>/g, '') // Remove any nested HTML tags
        .trim() 
      : null;
  } catch (error) {
    console.error('Error extracting H1:', error);
    
    // Last-resort regex
    try {
      const lastResortMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
      return lastResortMatch ? 
        lastResortMatch[1].replace(/<[^>]+>/g, '').trim() : null;
    } catch (e) {
      return null;
    }
  }
}

/**
 * Extract all headings from HTML
 */
export function extractHeadings(html: string): Array<{type: string, content: string, position: number}> {
  try {
    const headings = [];
    const $ = cheerio.load(html);
    
    // Find all heading elements
    $('h1, h2, h3, h4, h5, h6').each((index, element) => {
      const type = element.name; // h1, h2, etc
      const content = $(element).text().trim();
      
      if (content) {
        headings.push({
          type,
          content,
          position: index + 1
        });
      }
    });
    
    return headings;
  } catch (error) {
    console.error('Error extracting headings:', error);
    return [];
  }
}

/**
 * Extract links from HTML using both regex and DOM parsing
 */
export function extractLinks(html: string, baseUrl: string): string[] {
  try {
    // First try with cheerio (DOM parsing)
    const $ = cheerio.load(html);
    const links: string[] = [];
    
    $('a[href]').each((_, element) => {
      let href = $(element).attr('href')?.trim() || '';
      
      // Skip empty or javascript: links
      if (!href || href.startsWith('javascript:') || href === '#') {
        return;
      }
      
      // Handle relative URLs
      if (href.startsWith('/') || !href.includes('://')) {
        try {
          const url = new URL(href, baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`);
          href = url.href;
        } catch (e) {
          console.warn(`Could not parse relative URL: ${href}, skipping`);
          return;
        }
      }
      
      links.push(href);
    });
    
    // If cheerio found links, return them
    if (links.length > 0) {
      return [...new Set(links)]; // Remove duplicates
    }
    
    // Fallback to regex
    const regexLinks: string[] = [];
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
        try {
          const url = new URL(href, baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`);
          href = url.href;
        } catch (e) {
          console.warn(`Could not parse relative URL: ${href}, skipping`);
          continue;
        }
      }
      
      regexLinks.push(href);
    }
    
    // Remove duplicates
    return [...new Set(regexLinks)];
  } catch (error) {
    console.error('Error extracting links:', error);
    
    // Last attempt with basic regex
    try {
      const basicLinks: string[] = [];
      const basicRegex = /href=["']([^"']*)["']/gi;
      let match;
      
      while ((match = basicRegex.exec(html)) !== null) {
        if (match[1] && !match[1].startsWith('javascript:') && match[1] !== '#') {
          basicLinks.push(match[1]);
        }
      }
      
      return [...new Set(basicLinks)];
    } catch (e) {
      return [];
    }
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

/**
 * Extract all images from HTML
 */
export function extractImages(html: string, baseUrl: string): Array<{src: string, alt: string | null}> {
  try {
    const $ = cheerio.load(html);
    const images: Array<{src: string, alt: string | null}> = [];
    
    $('img').each((_, element) => {
      let src = $(element).attr('src')?.trim() || '';
      const alt = $(element).attr('alt')?.trim() || null;
      
      if (!src) return;
      
      // Handle relative URLs for src
      if (src.startsWith('/') || !src.includes('://')) {
        try {
          const url = new URL(src, baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`);
          src = url.href;
        } catch (e) {
          console.warn(`Could not parse relative image URL: ${src}, skipping`);
          return;
        }
      }
      
      images.push({ src, alt });
    });
    
    return images;
  } catch (error) {
    console.error('Error extracting images:', error);
    return [];
  }
}

/**
 * Extract word count from HTML content
 */
export function extractWordCount(html: string): number {
  try {
    const $ = cheerio.load(html);
    
    // Get text from body
    const bodyText = $('body').text();
    
    // Remove extra whitespace and split by spaces
    const words = bodyText.replace(/\s+/g, ' ').trim().split(' ');
    
    // Return word count
    return words.length;
  } catch (error) {
    console.error('Error counting words:', error);
    return 0;
  }
}
