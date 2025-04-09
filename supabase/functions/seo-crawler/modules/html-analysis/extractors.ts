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
 * Extract all links from HTML content with improved detection
 */
export function extractLinks(html: string, baseUrl: string): any[] {
  try {
    // Early return for empty HTML
    if (!html || html.length === 0) {
      console.log(`[Extractors] Empty HTML content for ${baseUrl}, no links to extract`);
      return [];
    }
    
    const links = [];
    
    // Improved regex to match more HTML link patterns
    const regex = /<a\s+(?:[^>]*?\s+)?(?:href=["']([^"']+)["']|["']([^"']+)["']=href)(?:[^>]*?)>([\s\S]*?)<\/a>/gi;
    
    let match;
    while ((match = regex.exec(html)) !== null) {
      const url = (match[1] || match[2] || '').trim();
      const rawAttributes = match[0] || '';
      let text = '';
      
      // Skip empty links
      if (!url) {
        continue;
      }
      
      // Skip javascript: links
      if (url.startsWith('javascript:')) {
        continue;
      }
      
      // Extract text content, handling potential HTML inside
      try {
        const linkContent = match[3];
        // Simple HTML tag removal for text extraction
        text = linkContent.replace(/<[^>]+>/g, '').trim();
      } catch (e) {
        console.log('[Extractors] Error extracting link text:', e);
        text = ''; // Default to empty if extraction fails
      }
      
      // Check if link has nofollow attribute
      const nofollow = 
        rawAttributes.includes('rel="nofollow"') || 
        rawAttributes.includes("rel='nofollow'") ||
        rawAttributes.includes('rel=nofollow');
      
      // Extract all rel attributes
      const relMatch = rawAttributes.match(/rel=["']([^"']*)["']/i) || 
                     rawAttributes.match(/rel=([^\s>]*)/i);
      const relAttributes = relMatch 
        ? relMatch[1].split(/\s+/).filter(attr => attr.length > 0)
        : [];
      
      links.push({
        url: url,
        text: text || '',
        anchor_text: text || '',
        link_text: text || '',
        is_followed: !nofollow,
        follow: !nofollow,
        rel_attributes: relAttributes,
        nofollow: nofollow,
        is_broken: false, // Will be determined later
        status_code: 200, // Default value
        created_at: new Date().toISOString(),
        link_location: 'body', // Default location
        link_type: url.startsWith('#') ? 'anchor' : 'regular' // Basic type classification
      });
    }
    
    console.log(`[Extractors] Found ${links.length} raw links on page`);
    
    // If no links found with the regex, try an alternative approach with a simpler regex
    if (links.length === 0) {
      console.log('[Extractors] Trying alternative extraction method');
      const simpleRegex = /href=["']([^"']+)["']/gi;
      let simpleMatch;
      
      while ((simpleMatch = simpleRegex.exec(html)) !== null) {
        const url = simpleMatch[1].trim();
        
        // Skip empty or javascript: links
        if (!url || url.startsWith('javascript:')) {
          continue;
        }
        
        links.push({
          url: url,
          text: '',
          anchor_text: '',
          link_text: '',
          is_followed: true,
          follow: true,
          rel_attributes: [],
          nofollow: false,
          is_broken: false,
          status_code: 200,
          created_at: new Date().toISOString(),
          link_location: 'body',
          link_type: url.startsWith('#') ? 'anchor' : 'regular'
        });
      }
      
      console.log(`[Extractors] Alternative method found ${links.length} links`);
    }
    
    return links;
  } catch (error) {
    console.error('[Extractors] Error extracting links:', error);
    return [];
  }
}

/**
 * Categorize links as internal or external with improved URL handling
 */
export function categorizeLinks(links: any[], baseUrl: string): { internalLinks: any[], externalLinks: any[] } {
  try {
    const internalLinks = [];
    const externalLinks = [];
    
    // Extract domain from base URL to compare
    let baseDomain = '';
    try {
      // Handle base URL without protocol
      const normalizedBaseUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;
      const baseUrlObj = new URL(normalizedBaseUrl);
      baseDomain = baseUrlObj.hostname;
    } catch (e) {
      console.error(`[Extractors] Invalid base URL: ${baseUrl}`, e);
      // Fallback to string matching if URL parsing fails
      const domainMatch = baseUrl.match(/https?:\/\/([^\/]+)/i) || baseUrl.match(/^([^\/]+)/i);
      baseDomain = domainMatch ? domainMatch[1] : '';
    }
    
    if (!baseDomain) {
      console.warn(`[Extractors] Could not extract base domain from ${baseUrl}`);
      return { internalLinks: [], externalLinks: links };
    }
    
    // For each link, determine if it's internal or external
    for (const link of links) {
      try {
        let isInternal = false;
        let fullUrl = link.url;
        
        // Handle relative URLs
        if (fullUrl.startsWith('/')) {
          isInternal = true;
          // Convert to absolute URL for consistency
          fullUrl = `https://${baseDomain}${fullUrl}`;
        } else if (!fullUrl.includes('://')) {
          if (fullUrl.startsWith('www.')) {
            // www.domain.com style URLs
            isInternal = fullUrl.includes(baseDomain) || 
                        baseDomain.includes(fullUrl.substring(4)); // account for www. prefix
          } else {
            // It's likely a relative URL without leading slash
            isInternal = true;
            fullUrl = `https://${baseDomain}/${fullUrl}`;
          }
        } else {
          // It's an absolute URL, check if it contains the same domain
          try {
            const linkUrlObj = new URL(fullUrl);
            const linkDomain = linkUrlObj.hostname;
            isInternal = linkDomain === baseDomain || 
                        linkDomain.endsWith(`.${baseDomain}`) || 
                        baseDomain.endsWith(`.${linkDomain}`);
          } catch {
            // If URL parsing fails, do a simple string check
            isInternal = fullUrl.includes(baseDomain);
          }
        }
        
        // Create the link object with is_internal flag and ensure all required properties
        const linkObj = {
          ...link,
          url: fullUrl,
          is_internal: isInternal,
        };
        
        if (isInternal) {
          internalLinks.push(linkObj);
        } else {
          externalLinks.push(linkObj);
        }
      } catch (e) {
        console.error(`[Extractors] Error processing link ${link.url}:`, e);
        // If there's an error, default to external
        externalLinks.push({
          ...link,
          is_internal: false,
        });
      }
    }
    
    return { internalLinks, externalLinks };
  } catch (error) {
    console.error('[Extractors] Error categorizing links:', error);
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
