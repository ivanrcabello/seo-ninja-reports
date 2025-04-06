
/**
 * HTML extraction functions for SEO analysis
 */

/**
 * Extract the title from HTML
 */
export function extractTitle(html: string): string | null {
  try {
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/is);
    if (titleMatch && titleMatch[1]) {
      return cleanText(titleMatch[1]);
    }
    return null;
  } catch (error) {
    console.error(`Error extracting title: ${error.message}`);
    return null;
  }
}

/**
 * Extract meta description from HTML
 */
export function extractMetaDescription(html: string): string | null {
  try {
    const metaMatch = html.match(/<meta\s+(?:name="description"|property="og:description")\s+content="([^"]*)".*?>/i) || 
                      html.match(/<meta\s+content="([^"]*)"\s+(?:name="description"|property="og:description").*?>/i);
    
    if (metaMatch && metaMatch[1]) {
      return cleanText(metaMatch[1]);
    }
    return null;
  } catch (error) {
    console.error(`Error extracting meta description: ${error.message}`);
    return null;
  }
}

/**
 * Extract H1 heading from HTML
 */
export function extractH1(html: string): string | null {
  try {
    const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/is);
    if (h1Match && h1Match[1]) {
      return cleanText(h1Match[1]);
    }
    return null;
  } catch (error) {
    console.error(`Error extracting H1: ${error.message}`);
    return null;
  }
}

/**
 * Extract links from HTML
 */
export function extractLinks(html: string, baseUrl: string): string[] {
  try {
    const links: string[] = [];
    const regex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)".*?>/gi;
    let match;
    
    while ((match = regex.exec(html)) !== null) {
      let href = match[1];
      if (href) {
        try {
          // Make URL absolute
          href = new URL(href, baseUrl).href;
          
          // Skip anchors, javascript and mailto links
          if (!href.startsWith('#') && 
              !href.startsWith('javascript:') && 
              !href.startsWith('mailto:') &&
              !href.startsWith('tel:')) {
            links.push(href);
          }
        } catch (e) {
          // Skip invalid URLs
          console.warn(`Invalid URL found: ${href}`);
        }
      }
    }
    
    return links;
  } catch (error) {
    console.error(`Error extracting links: ${error.message}`);
    return [];
  }
}

/**
 * Categorize links as internal or external
 */
export function categorizeLinks(links: string[], baseUrl: string): { internalLinks: string[], externalLinks: string[] } {
  try {
    const baseDomain = new URL(baseUrl).hostname;
    const internalLinks: string[] = [];
    const externalLinks: string[] = [];
    
    for (const link of links) {
      try {
        const url = new URL(link);
        if (url.hostname === baseDomain) {
          internalLinks.push(link);
        } else {
          externalLinks.push(link);
        }
      } catch (e) {
        console.warn(`Error categorizing link: ${link}, error: ${e.message}`);
      }
    }
    
    return { internalLinks, externalLinks };
  } catch (error) {
    console.error(`Error categorizing links: ${error.message}`);
    return { internalLinks: [], externalLinks: [] };
  }
}

/**
 * Extract all headings from HTML
 */
export function extractHeadings(html: string): Array<{ tag: string; text: string; position: number }> {
  try {
    const headings: Array<{ tag: string; text: string; position: number }> = [];
    const regex = /<(h[1-6])[^>]*>(.*?)<\/\1>/gis;
    let match;
    let position = 0;
    
    while ((match = regex.exec(html)) !== null) {
      position++;
      headings.push({
        tag: match[1].toLowerCase(),
        text: cleanText(match[2]),
        position
      });
    }
    
    return headings;
  } catch (error) {
    console.error(`Error extracting headings: ${error.message}`);
    return [];
  }
}

/**
 * Extract images from HTML
 */
export function extractImages(html: string, baseUrl: string): Array<{ src: string; alt: string | null }> {
  try {
    const images: Array<{ src: string; alt: string | null }> = [];
    const regex = /<img\s+[^>]*?src="([^"]*)"[^>]*?(?:alt="([^"]*)")?[^>]*?>/gi;
    let match;
    
    while ((match = regex.exec(html)) !== null) {
      try {
        let src = match[1];
        const alt = match[2] ? cleanText(match[2]) : null;
        
        // Make image URL absolute
        src = new URL(src, baseUrl).href;
        
        images.push({ src, alt });
      } catch (e) {
        console.warn(`Invalid image URL: ${match[1]}`);
      }
    }
    
    return images;
  } catch (error) {
    console.error(`Error extracting images: ${error.message}`);
    return [];
  }
}

/**
 * Extract word count from HTML
 */
export function extractWordCount(html: string): number {
  try {
    // Remove HTML tags
    const textOnly = html.replace(/<[^>]*>/g, ' ');
    
    // Remove special characters and extra spaces
    const cleanedText = textOnly.replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
    
    // Count words
    return cleanedText.split(' ').filter(Boolean).length;
  } catch (error) {
    console.error(`Error extracting word count: ${error.message}`);
    return 0;
  }
}

/**
 * Clean HTML text by removing tags and normalizing whitespace
 */
function cleanText(text: string): string {
  return text
    .replace(/<[^>]*>/g, ' ')  // Remove HTML tags
    .replace(/&nbsp;/g, ' ')   // Replace non-breaking spaces
    .replace(/\s+/g, ' ')      // Normalize whitespace
    .trim();
}
