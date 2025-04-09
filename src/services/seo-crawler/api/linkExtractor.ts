
/**
 * Utility functions for extracting and processing links from HTML content
 */

/**
 * Extract all links from HTML content with improved pattern matching
 */
export function extractLinks(html: string, baseUrl: string): any[] {
  try {
    console.log(`[LinkExtractor] Extracting links from HTML for ${baseUrl}, HTML length: ${html?.length || 0}`);
    
    if (!html || html.length === 0) {
      console.log('[LinkExtractor] Empty HTML content, no links to extract');
      return [];
    }
    
    const links = [];
    
    // More comprehensive regex to match link patterns, including those with attributes in different orders
    const regex = /<a\s+(?:[^>]*?\s+)?(?:href=["']([^"']+)["']|["']([^"']+)["']=href)(?:[^>]*?)>([\s\S]*?)<\/a>/gi;
    
    let match;
    while ((match = regex.exec(html)) !== null) {
      const url = (match[1] || match[2] || '').trim();
      const rawAttributes = match[0] || '';
      let text = '';
      
      // Skip empty or javascript: links
      if (!url || url.startsWith('javascript:')) {
        continue;
      }
      
      // Extract text content, handling potential HTML inside
      try {
        const linkContent = match[3];
        // Simple HTML tag removal for text extraction
        text = linkContent.replace(/<[^>]+>/g, '').trim();
      } catch (e) {
        console.log('[LinkExtractor] Error extracting link text:', e);
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
    
    console.log(`[LinkExtractor] Found ${links.length} raw links on page`);
    
    // If no links found with the regex, try an alternative approach with a simpler regex
    if (links.length === 0) {
      console.log('[LinkExtractor] Trying alternative extraction method');
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
      
      console.log(`[LinkExtractor] Alternative method found ${links.length} links`);
    }
    
    return links;
  } catch (error) {
    console.error('[LinkExtractor] Error extracting links:', error);
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
      console.error(`[LinkExtractor] Invalid base URL: ${baseUrl}`, e);
      // Fallback to string matching if URL parsing fails
      const domainMatch = baseUrl.match(/https?:\/\/([^\/]+)/i) || baseUrl.match(/^([^\/]+)/i);
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
