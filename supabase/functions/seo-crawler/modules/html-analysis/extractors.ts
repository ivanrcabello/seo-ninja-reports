
/**
 * HTML extraction functions for SEO analysis
 */

/**
 * Extract the title from HTML
 */
export function extractTitle(html: string): string | null {
  try {
    console.log('Extracting title from HTML');
    
    // Main title extraction logic
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/is);
    if (titleMatch && titleMatch[1]) {
      const title = cleanText(titleMatch[1]);
      console.log(`Title extracted: "${title}"`);
      return title;
    }
    
    // Alternative approach - scan for OG title
    const ogTitleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]*)".*?>/i) || 
                         html.match(/<meta\s+content="([^"]*)"\s+property="og:title".*?>/i);
    
    if (ogTitleMatch && ogTitleMatch[1]) {
      const ogTitle = cleanText(ogTitleMatch[1]);
      console.log(`OG Title extracted as fallback: "${ogTitle}"`);
      return ogTitle;
    }
    
    console.log('No title found in HTML');
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
    console.log('Extracting meta description from HTML');
    
    // Standard meta description
    const metaMatch = html.match(/<meta\s+(?:name="description"|property="og:description")\s+content="([^"]*)".*?>/i) || 
                      html.match(/<meta\s+content="([^"]*)"\s+(?:name="description"|property="og:description").*?>/i);
    
    if (metaMatch && metaMatch[1]) {
      const description = cleanText(metaMatch[1]);
      console.log(`Meta description extracted: "${description.substring(0, 50)}${description.length > 50 ? '...' : ''}"`);
      return description;
    }
    
    // Alternative approach - try different meta tag patterns
    const altMetaMatch = html.match(/<meta\s+name="description"\s+content='([^']*)'.*?>/i) ||
                         html.match(/<meta\s+property="og:description"\s+content='([^']*)'.*?>/i);
    
    if (altMetaMatch && altMetaMatch[1]) {
      const altDescription = cleanText(altMetaMatch[1]);
      console.log(`Alt meta description extracted: "${altDescription.substring(0, 50)}${altDescription.length > 50 ? '...' : ''}"`);
      return altDescription;
    }
    
    console.log('No meta description found in HTML');
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
    console.log('Extracting H1 from HTML');
    
    const h1Matches = html.match(/<h1[^>]*>(.*?)<\/h1>/igs);
    
    if (h1Matches && h1Matches.length > 0) {
      // Extract content from the first H1
      const h1Content = h1Matches[0].replace(/<[^>]*>/g, '');
      const h1 = cleanText(h1Content);
      console.log(`H1 extracted: "${h1}"`);
      return h1;
    }
    
    // Alternative approach - try simpler regex
    const simpleH1Match = html.match(/<h1[^>]*>([^<]*)<\/h1>/i);
    if (simpleH1Match && simpleH1Match[1]) {
      const simpleH1 = cleanText(simpleH1Match[1]);
      console.log(`Simple H1 match extracted: "${simpleH1}"`);
      return simpleH1;
    }
    
    console.log('No H1 found in HTML');
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
    console.log(`Extracting links from HTML with base URL: ${baseUrl}`);
    
    const links: string[] = [];
    const regex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)".*?>/gi;
    let match;
    
    while ((match = regex.exec(html)) !== null) {
      let href = match[1];
      if (href) {
        try {
          // Skip empty links
          href = href.trim();
          if (!href) continue;
          
          // Handle relative URLs
          let absoluteUrl;
          try {
            absoluteUrl = new URL(href, baseUrl).href;
          } catch (e) {
            // If URL construction fails, try to clean the URL
            try {
              if (href.startsWith('./')) {
                href = href.substring(2);
              }
              if (href.startsWith('/')) {
                const baseUrlObj = new URL(baseUrl);
                absoluteUrl = `${baseUrlObj.protocol}//${baseUrlObj.host}${href}`;
              } else {
                // If it's not a relative path starting with /, assume it's a path from baseUrl
                const baseUrlObj = new URL(baseUrl);
                const basePath = baseUrlObj.pathname.endsWith('/') ? 
                  baseUrlObj.pathname : 
                  baseUrlObj.pathname.substring(0, baseUrlObj.pathname.lastIndexOf('/') + 1);
                absoluteUrl = `${baseUrlObj.protocol}//${baseUrlObj.host}${basePath}${href}`;
              }
            } catch (innerError) {
              console.warn(`Could not construct URL for href: ${href}, error: ${innerError.message}`);
              continue;
            }
          }
          
          // Skip anchors, javascript and mailto links
          if (!absoluteUrl.startsWith('#') && 
              !absoluteUrl.startsWith('javascript:') && 
              !absoluteUrl.startsWith('mailto:') &&
              !absoluteUrl.startsWith('tel:')) {
            links.push(absoluteUrl);
          }
        } catch (e) {
          // Skip invalid URLs
          console.warn(`Invalid URL found: ${href}, error: ${e.message}`);
        }
      }
    }
    
    // Alternative regex for links with single quotes
    const altRegex = /<a\s+(?:[^>]*?\s+)?href='([^']*)'.*?>/gi;
    while ((match = altRegex.exec(html)) !== null) {
      let href = match[1];
      if (href) {
        try {
          // Follow the same process as above
          href = href.trim();
          if (!href) continue;
          
          const absoluteUrl = new URL(href, baseUrl).href;
          
          if (!absoluteUrl.startsWith('#') && 
              !absoluteUrl.startsWith('javascript:') && 
              !absoluteUrl.startsWith('mailto:') &&
              !absoluteUrl.startsWith('tel:')) {
            links.push(absoluteUrl);
          }
        } catch (e) {
          console.warn(`Invalid URL found with single quotes: ${href}, error: ${e.message}`);
        }
      }
    }
    
    console.log(`Extracted ${links.length} links from HTML`);
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
    console.log(`Categorizing ${links.length} links relative to base URL: ${baseUrl}`);
    
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
    
    console.log(`Categorized links: ${internalLinks.length} internal, ${externalLinks.length} external`);
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
    console.log('Extracting headings from HTML');
    
    const headings: Array<{ tag: string; text: string; position: number }> = [];
    const regex = /<(h[1-6])[^>]*>(.*?)<\/\1>/gis;
    let match;
    let position = 0;
    
    while ((match = regex.exec(html)) !== null) {
      position++;
      const tag = match[1].toLowerCase();
      const text = cleanText(match[2]);
      
      headings.push({
        tag,
        text,
        position
      });
    }
    
    console.log(`Extracted ${headings.length} headings from HTML`);
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
    console.log(`Extracting images from HTML with base URL: ${baseUrl}`);
    
    const images: Array<{ src: string; alt: string | null }> = [];
    const regex = /<img\s+[^>]*?src=["']([^"']*)["'][^>]*?(?:alt=["']([^"']*)["'])?[^>]*?>/gi;
    let match;
    
    while ((match = regex.exec(html)) !== null) {
      try {
        let src = match[1].trim();
        const alt = match[2] ? cleanText(match[2]) : null;
        
        if (!src) continue;
        
        // Make image URL absolute
        try {
          src = new URL(src, baseUrl).href;
        } catch (e) {
          console.warn(`Invalid image URL: ${src}, error: ${e.message}`);
          continue;
        }
        
        images.push({ src, alt });
      } catch (e) {
        console.warn(`Error processing image, error: ${e.message}`);
      }
    }
    
    console.log(`Extracted ${images.length} images from HTML`);
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
    console.log('Extracting word count from HTML');
    
    // Remove HTML tags
    const textOnly = html.replace(/<[^>]*>/g, ' ');
    
    // Remove special characters and extra spaces
    const cleanedText = textOnly.replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
    
    // Count words
    const wordCount = cleanedText.split(' ').filter(Boolean).length;
    
    console.log(`Extracted word count: ${wordCount} words`);
    return wordCount;
  } catch (error) {
    console.error(`Error extracting word count: ${error.message}`);
    return 0;
  }
}

/**
 * Clean HTML text by removing tags and normalizing whitespace
 */
function cleanText(text: string): string {
  if (!text) return '';
  
  return text
    .replace(/<[^>]*>/g, ' ')  // Remove HTML tags
    .replace(/&nbsp;/g, ' ')   // Replace non-breaking spaces
    .replace(/&amp;/g, '&')    // Replace HTML entities
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')      // Normalize whitespace
    .trim();
}
