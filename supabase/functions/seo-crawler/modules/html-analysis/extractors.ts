
/**
 * HTML extraction utilities for SEO analysis
 */

/**
 * Extract title from HTML
 */
export function extractTitle(html: string): string | null {
  console.log('[Extractors] Extracting title');
  if (!html) return null;
  
  // Match title tag
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/is);
  if (!titleMatch || !titleMatch[1]) {
    console.log('[Extractors] No title found');
    return null;
  }
  
  const title = titleMatch[1].trim();
  console.log(`[Extractors] Found title: ${title.substring(0, 50)}${title.length > 50 ? '...' : ''}`);
  return title;
}

/**
 * Extract meta description from HTML
 */
export function extractMetaDescription(html: string): string | null {
  console.log('[Extractors] Extracting meta description');
  if (!html) return null;
  
  // Match meta description tag
  const metaMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["'](.*?)["'][^>]*>/is);
  if (!metaMatch || !metaMatch[1]) {
    // Try alternative format
    const altMetaMatch = html.match(/<meta[^>]*content=["'](.*?)["'][^>]*name=["']description["'][^>]*>/is);
    if (!altMetaMatch || !altMetaMatch[1]) {
      console.log('[Extractors] No meta description found');
      return null;
    }
    
    const description = altMetaMatch[1].trim();
    console.log(`[Extractors] Found meta description: ${description.substring(0, 50)}${description.length > 50 ? '...' : ''}`);
    return description;
  }
  
  const description = metaMatch[1].trim();
  console.log(`[Extractors] Found meta description: ${description.substring(0, 50)}${description.length > 50 ? '...' : ''}`);
  return description;
}

/**
 * Extract H1 heading from HTML
 */
export function extractH1(html: string): string | null {
  console.log('[Extractors] Extracting H1');
  if (!html) return null;
  
  // Match h1 tag
  const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/is);
  if (!h1Match || !h1Match[1]) {
    console.log('[Extractors] No H1 found');
    return null;
  }
  
  // Clean the h1 content (remove HTML tags and trim)
  const h1 = h1Match[1].replace(/<\/?[^>]+(>|$)/g, " ").replace(/\s+/g, " ").trim();
  console.log(`[Extractors] Found H1: ${h1}`);
  return h1;
}

/**
 * Extract all headings from HTML
 */
export function extractHeadings(html: string): Array<{type: string; content: string}> {
  console.log('[Extractors] Extracting headings (H1-H6)');
  if (!html) return [];
  
  const headings = [];
  
  // Match all headings (h1-h6)
  const headingRegex = /<(h[1-6])[^>]*>(.*?)<\/\1>/gis;
  let match;
  
  try {
    while ((match = headingRegex.exec(html)) !== null) {
      const type = match[1].toLowerCase(); // h1, h2, etc.
      const content = match[2].replace(/<\/?[^>]+(>|$)/g, " ").replace(/\s+/g, " ").trim();
      
      if (content) {
        headings.push({ type, content });
      }
    }
    
    console.log(`[Extractors] Found ${headings.length} headings`, 
      headings.length > 0 ? `First heading: ${headings[0].type} - ${headings[0].content.substring(0, 30)}...` : '');
    
    return headings;
  } catch (error) {
    console.error(`[Extractors] Error extracting headings:`, error);
    return [];
  }
}

/**
 * Extract word count from HTML
 */
export function extractWordCount(html: string): number {
  if (!html) return 0;
  
  try {
    // Extract text from body
    const bodyMatch = html.match(/<body[^>]*>(.*?)<\/body>/is);
    if (!bodyMatch || !bodyMatch[1]) {
      return 0;
    }
    
    // Remove all HTML tags and scripts
    const textContent = bodyMatch[1]
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove scripts
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // Remove styles
      .replace(/<[^>]+>/g, ' ') // Remove HTML tags
      .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
      .trim();
    
    // Count words
    const words = textContent.split(/\s+/).filter(word => word.length > 0);
    return words.length;
  } catch (error) {
    console.error(`[Extractors] Error extracting word count:`, error);
    return 0;
  }
}

/**
 * Extract links from HTML
 */
export function extractLinks(html: string, baseUrl: string): Array<{url: string; text: string; isExternal: boolean}> {
  if (!html) return [];
  
  try {
    const links = [];
    const linkRegex = /<a[^>]*href=["'](.*?)["'][^>]*>(.*?)<\/a>/gis;
    let match;
    
    while ((match = linkRegex.exec(html)) !== null) {
      let url = match[1].trim();
      const text = match[2].replace(/<\/?[^>]+(>|$)/g, " ").replace(/\s+/g, " ").trim();
      
      // Skip empty URLs, javascript:, mailto:, tel:, etc.
      if (!url || 
          url.startsWith('javascript:') || 
          url.startsWith('mailto:') || 
          url.startsWith('tel:') || 
          url === '#') {
        continue;
      }
      
      // Convert relative URLs to absolute
      if (url.startsWith('/')) {
        const baseUrlObj = new URL(baseUrl);
        url = `${baseUrlObj.protocol}//${baseUrlObj.host}${url}`;
      } else if (!url.startsWith('http')) {
        // Handle other relative URLs like "page.html"
        try {
          url = new URL(url, baseUrl).href;
        } catch (error) {
          console.error(`[Extractors] Error processing URL ${url}:`, error);
          continue;
        }
      }
      
      // Determine if the link is external
      const isExternal = !url.includes(new URL(baseUrl).hostname);
      
      links.push({
        url,
        text,
        isExternal
      });
    }
    
    console.log(`[Extractors] Found ${links.length} links`);
    return links;
  } catch (error) {
    console.error(`[Extractors] Error extracting links:`, error);
    return [];
  }
}

/**
 * Categorize links as internal or external
 */
export function categorizeLinks(
  links: Array<{url: string; text: string; isExternal: boolean}>,
  baseUrl: string
): {
  internalLinks: Array<{url: string; text: string; isExternal: boolean}>;
  externalLinks: Array<{url: string; text: string; isExternal: boolean}>;
} {
  const internalLinks = links.filter(link => !link.isExternal);
  const externalLinks = links.filter(link => link.isExternal);
  
  return { internalLinks, externalLinks };
}

/**
 * Extract images from HTML
 */
export function extractImages(html: string, baseUrl: string): Array<{src: string; alt: string | null}> {
  if (!html) return [];
  
  try {
    const images = [];
    const imgRegex = /<img[^>]*src=["'](.*?)["'][^>]*>/gis;
    let match;
    
    while ((match = imgRegex.exec(html)) !== null) {
      let src = match[1].trim();
      
      // Skip data URLs or empty sources
      if (!src || src.startsWith('data:')) {
        continue;
      }
      
      // Convert relative URLs to absolute
      if (src.startsWith('/')) {
        const baseUrlObj = new URL(baseUrl);
        src = `${baseUrlObj.protocol}//${baseUrlObj.host}${src}`;
      } else if (!src.startsWith('http')) {
        try {
          src = new URL(src, baseUrl).href;
        } catch (error) {
          console.error(`[Extractors] Error processing image URL ${src}:`, error);
          continue;
        }
      }
      
      // Extract alt text (if any)
      const altMatch = match[0].match(/alt=["'](.*?)["']/i);
      const alt = altMatch ? altMatch[1] : null;
      
      images.push({
        src,
        alt
      });
    }
    
    console.log(`[Extractors] Found ${images.length} images`);
    return images;
  } catch (error) {
    console.error(`[Extractors] Error extracting images:`, error);
    return [];
  }
}
