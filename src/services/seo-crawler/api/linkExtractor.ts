
/**
 * Utility functions for extracting and processing links from HTML content
 */

/**
 * Extract all links from HTML content
 */
export function extractLinks(html: string, baseUrl: string): any[] {
  try {
    console.log(`[LinkExtractor] Extracting links from HTML for ${baseUrl}, HTML length: ${html?.length || 0}`);
    
    const links = [];
    // Improved regex to match more HTML link patterns
    const regex = /<a\s+(?:[^>]*?\s+)?href=["']([^"']+)["']([^>]*)>([\s\S]*?)<\/a>/gi;
    
    let match;
    while ((match = regex.exec(html)) !== null) {
      const url = match[1].trim();
      const linkAttributes = match[2] || '';
      let text = '';
      
      // Extract text content, handling potential HTML inside
      try {
        const linkContent = match[3];
        // Simple HTML tag removal for text extraction
        text = linkContent.replace(/<[^>]+>/g, '').trim();
      } catch (e) {
        text = ''; // Default to empty if extraction fails
      }
      
      // Skip empty or javascript links
      if (!url || url.startsWith('javascript:') || url === '#') {
        continue;
      }
      
      // Check if link has nofollow attribute anywhere in the link tag
      const nofollow = 
        linkAttributes.includes('rel="nofollow"') || 
        linkAttributes.includes("rel='nofollow'") ||
        linkAttributes.includes('rel=nofollow');
      
      // Extract all rel attributes
      const relMatch = linkAttributes.match(/rel=["']([^"']*)["']/i) || 
                      linkAttributes.match(/rel=([^\s>]*)/i);
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
    
    console.log(`[LinkExtractor] Found ${links.length} raw links on page`);
    return links;
  } catch (error) {
    console.error('[LinkExtractor] Error extracting links:', error);
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
    let baseDomain = '';
    try {
      const baseUrlObj = new URL(baseUrl);
      baseDomain = baseUrlObj.hostname;
    } catch (e) {
      console.error(`[LinkExtractor] Invalid base URL: ${baseUrl}`, e);
      // Fallback to string matching if URL parsing fails
      const domainMatch = baseUrl.match(/https?:\/\/([^\/]+)/i);
      baseDomain = domainMatch ? domainMatch[1] : '';
    }
    
    console.log(`[LinkExtractor] Base domain for categorizing: ${baseDomain}`);
    
    if (!baseDomain) {
      console.warn(`[LinkExtractor] Could not extract base domain from ${baseUrl}`);
      return { internalLinks: [], externalLinks: links };
    }
    
    // For each link, determine if it's internal or external
    for (const link of links) {
      try {
        // Handle relative URLs
        let fullUrl = link.url;
        let isInternal = false;
        
        if (fullUrl.startsWith('/') || !fullUrl.includes('://')) {
          // It's a relative URL, so it's internal
          isInternal = true;
        } else {
          // It's an absolute URL, check if it contains the same domain
          try {
            const linkUrlObj = new URL(fullUrl);
            isInternal = linkUrlObj.hostname === baseDomain || 
                        linkUrlObj.hostname.endsWith(`.${baseDomain}`);
          } catch {
            // If URL parsing fails, do a simple string check
            isInternal = fullUrl.includes(baseDomain);
          }
        }
        
        // Create the link object with is_internal flag and ensure all required properties
        const linkObj = {
          ...link,
          is_internal: isInternal,
        };
        
        if (isInternal) {
          internalLinks.push(linkObj);
        } else {
          externalLinks.push(linkObj);
        }
      } catch (e) {
        console.error(`[LinkExtractor] Error processing link ${link.url}:`, e);
        // If there's an error, default to external
        externalLinks.push({
          ...link,
          is_internal: false,
        });
      }
    }
    
    console.log(`[LinkExtractor] Categorized ${links.length} links: ${internalLinks.length} internal, ${externalLinks.length} external`);
    return { internalLinks, externalLinks };
  } catch (error) {
    console.error('[LinkExtractor] Error categorizing links:', error);
    return { internalLinks: [], externalLinks: [] };
  }
}
