
// Import cheerio for HTML parsing if not already imported
// import * as cheerio from 'cheerio';

/**
 * Extract HTML page title
 */
export function extractTitle(html: string): string | null {
  try {
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    return titleMatch ? titleMatch[1].trim() : null;
  } catch (error) {
    console.error('Error extracting title:', error);
    return null;
  }
}

/**
 * Extract meta description
 */
export function extractMetaDescription(html: string): string | null {
  try {
    const metaDescriptionMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i) || 
                                html.match(/<meta\s+content=["'](.*?)["']\s+name=["']description["']/i);
    return metaDescriptionMatch ? metaDescriptionMatch[1].trim() : null;
  } catch (error) {
    console.error('Error extracting meta description:', error);
    return null;
  }
}

/**
 * Extract H1 heading text
 */
export function extractH1(html: string): string | null {
  try {
    const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
    return h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : null;
  } catch (error) {
    console.error('Error extracting H1:', error);
    return null;
  }
}

/**
 * Extract canonical URL
 */
export function extractCanonicalUrl(html: string): string | null {
  try {
    const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["'](.*?)["']/i) ||
                           html.match(/<link\s+href=["'](.*?)["']\s+rel=["']canonical["']/i);
    return canonicalMatch ? canonicalMatch[1].trim() : null;
  } catch (error) {
    console.error('Error extracting canonical URL:', error);
    return null;
  }
}

/**
 * Extract robots meta directives
 */
export function extractRobotsMeta(html: string): string | null {
  try {
    // First try standard robots meta tag
    const robotsMatch = html.match(/<meta\s+name=["']robots["']\s+content=["'](.*?)["']/i) ||
                       html.match(/<meta\s+content=["'](.*?)["']\s+name=["']robots["']/i);
    
    // If not found, try googlebot-specific tag
    if (!robotsMatch) {
      const googlebotMatch = html.match(/<meta\s+name=["']googlebot["']\s+content=["'](.*?)["']/i) ||
                           html.match(/<meta\s+content=["'](.*?)["']\s+name=["']googlebot["']/i);
      return googlebotMatch ? googlebotMatch[1].trim() : null;
    }
    
    return robotsMatch ? robotsMatch[1].trim() : null;
  } catch (error) {
    console.error('Error extracting robots meta:', error);
    return null;
  }
}

/**
 * Extract schema markup data
 */
export function extractSchemaMarkup(html: string): any[] {
  try {
    // Look for JSON-LD schema
    const jsonLdMatches = html.match(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
    
    // Look for microdata schemas
    const hasItemScope = html.includes('itemscope') && html.includes('itemtype');
    
    // Look for RDFa schemas
    const hasRdfa = html.includes('typeof=') && html.includes('property=');
    
    const schemas = [];
    
    // Process JSON-LD if found
    if (jsonLdMatches && jsonLdMatches.length > 0) {
      jsonLdMatches.forEach(match => {
        try {
          const jsonContent = match.replace(/<script\s+type=["']application\/ld\+json["'][^>]*>/, '')
                                  .replace(/<\/script>/, '').trim();
          const parsedJson = JSON.parse(jsonContent);
          schemas.push(parsedJson);
        } catch (e) {
          console.error('Error parsing JSON-LD schema:', e);
        }
      });
    }
    
    // Just note the presence of microdata or RDFa
    if (hasItemScope) {
      schemas.push({ type: 'microdata', detected: true });
    }
    
    if (hasRdfa) {
      schemas.push({ type: 'rdfa', detected: true });
    }
    
    return schemas;
  } catch (error) {
    console.error('Error extracting schema markup:', error);
    return [];
  }
}

/**
 * Detect if the page is mobile-friendly
 */
export function detectMobileFriendly(html: string): boolean {
  try {
    // Check for viewport meta tag (strongest indicator)
    const hasViewport = html.includes('name="viewport"') && html.includes('width=device-width');
    
    // Check for responsive design indicators
    const hasMediaQueries = html.includes('@media') && (html.includes('max-width') || html.includes('min-width'));
    
    // Check for mobile-specific frameworks or libraries
    const usesMobileFramework = 
      html.includes('bootstrap') || 
      html.includes('foundation') || 
      html.includes('tailwind') ||
      html.includes('mobile-nav') || 
      html.includes('hamburger-menu');
    
    // Consider responsive images
    const hasResponsiveImages = html.includes('srcset') || html.includes('sizes=');
    
    // A page is considered mobile-friendly if it has viewport tag and at least one other indicator
    return hasViewport && (hasMediaQueries || usesMobileFramework || hasResponsiveImages);
  } catch (error) {
    console.error('Error detecting mobile friendliness:', error);
    return false;
  }
}

/**
 * Extract all links from the page
 */
export function extractLinks(html: string, baseUrl: string): any[] {
  try {
    const links = [];
    const regex = /<a\s[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
    
    let match;
    while ((match = regex.exec(html)) !== null) {
      const url = match[1];
      const text = match[0].replace(/<[^>]+>/g, '').trim();
      
      // Skip empty or javascript links
      if (!url || url.startsWith('javascript:') || url === '#') {
        continue;
      }
      
      // Check if link is followed (doesn't have rel="nofollow")
      const nofollow = match[0].includes('rel="nofollow"') || match[0].includes("rel='nofollow'");
      const isFollowed = !nofollow;
      
      // Extract the rel attributes if any
      const relMatch = match[0].match(/rel=["']([^"']*)["']/i);
      const relAttributes = relMatch ? relMatch[1].split(' ') : [];
      
      links.push({
        url: url,
        text: text,
        anchor_text: text,
        is_followed: isFollowed,
        follow: isFollowed,
        rel_attributes: relAttributes,
        nofollow: nofollow,
        link_text: text,
        created_at: new Date().toISOString() // Add created_at field explicitly
      });
    }
    
    return links;
  } catch (error) {
    console.error('Error extracting links:', error);
    return [];
  }
}

/**
 * Categorize links as internal or external
 */
export function categorizeLinks(links: any[], baseUrl: string): { internalLinks: any[], externalLinks: any[] } {
  try {
    const internalLinks = [];
    const externalLinks = [];
    
    // Extract domain from base URL to compare
    const baseUrlObj = new URL(baseUrl);
    const baseDomain = baseUrlObj.hostname;
    
    // For each link, determine if it's internal or external
    for (const link of links) {
      try {
        // Handle relative URLs
        let fullUrl = link.url;
        if (fullUrl.startsWith('/')) {
          fullUrl = `${baseUrlObj.protocol}//${baseDomain}${fullUrl}`;
        } else if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
          // Handle URLs without protocol
          if (fullUrl.includes(baseDomain)) {
            fullUrl = `${baseUrlObj.protocol}//${fullUrl}`;
          } else {
            // It might be relative to current path
            const path = baseUrlObj.pathname.endsWith('/') 
              ? baseUrlObj.pathname 
              : baseUrlObj.pathname.substring(0, baseUrlObj.pathname.lastIndexOf('/') + 1);
            fullUrl = `${baseUrlObj.protocol}//${baseDomain}${path}${fullUrl}`;
          }
        }
        
        // Check if URL contains the same domain
        const isInternal = fullUrl.includes(baseDomain);
        
        // Create the link object with is_internal flag and ensure all required properties
        const linkObj = {
          ...link,
          url: fullUrl,
          is_internal: isInternal,
          is_broken: false, // Default to false until verified
          status_code: 200, // Default value
          created_at: link.created_at || new Date().toISOString()
        };
        
        if (isInternal) {
          internalLinks.push(linkObj);
        } else {
          externalLinks.push(linkObj);
        }
      } catch (e) {
        console.error(`Error processing link ${link.url}:`, e);
        // If there's an error, default to external
        externalLinks.push({
          ...link,
          is_internal: false,
          created_at: link.created_at || new Date().toISOString()
        });
      }
    }
    
    return { internalLinks, externalLinks };
  } catch (error) {
    console.error('Error categorizing links:', error);
    return { internalLinks: [], externalLinks: [] };
  }
}

/**
 * Extract heading elements
 */
export function extractHeadings(html: string): any[] {
  try {
    const headings = [];
    const headingTypes = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    
    let position = 1;
    for (const type of headingTypes) {
      const regex = new RegExp(`<${type}[^>]*>(.*?)<\/${type}>`, 'gi');
      let match;
      
      while ((match = regex.exec(html)) !== null) {
        const content = match[1].replace(/<[^>]+>/g, '').trim();
        
        if (content) {
          headings.push({
            type: type,
            heading_type: type,
            content: content,
            position: position++
          });
        }
      }
    }
    
    // Sort by position in document
    headings.sort((a, b) => a.position - b.position);
    
    return headings;
  } catch (error) {
    console.error('Error extracting headings:', error);
    return [];
  }
}

/**
 * Extract images from HTML
 */
export function extractImages(html: string, baseUrl: string): any[] {
  try {
    const images = [];
    const regex = /<img\s[^>]*src=["']([^"']+)["'][^>]*>/gi;
    
    let match;
    while ((match = regex.exec(html)) !== null) {
      const src = match[1];
      
      // Skip data URLs, base64 images, etc.
      if (!src || src.startsWith('data:')) {
        continue;
      }
      
      // Check if image has alt text
      const imgTag = match[0];
      const altMatch = imgTag.match(/alt=["']([^"']*)["']/i);
      const hasAlt = altMatch !== null && altMatch[1].trim() !== '';
      
      // Extract width and height if available
      const widthMatch = imgTag.match(/width=["'](\d+)["']/i);
      const heightMatch = imgTag.match(/height=["'](\d+)["']/i);
      const width = widthMatch ? parseInt(widthMatch[1]) : null;
      const height = heightMatch ? parseInt(heightMatch[1]) : null;
      
      images.push({
        src: src,
        has_alt: hasAlt,
        alt: altMatch ? altMatch[1] : '',
        width: width,
        height: height
      });
    }
    
    return images;
  } catch (error) {
    console.error('Error extracting images:', error);
    return [];
  }
}

/**
 * Extract approximate word count
 */
export function extractWordCount(html: string): number {
  try {
    // First remove HTML tags
    const text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                     .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                     .replace(/<[^>]+>/g, ' ')
                     .replace(/\s+/g, ' ')
                     .trim();
    
    // Count words (non-empty strings separated by whitespace)
    const words = text.split(/\s+/).filter(word => word.length > 0);
    return words.length;
  } catch (error) {
    console.error('Error calculating word count:', error);
    return 0;
  }
}
