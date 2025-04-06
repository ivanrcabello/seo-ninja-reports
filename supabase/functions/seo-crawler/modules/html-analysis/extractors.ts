
// Extractors for HTML content
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";
import { sanitizeHtml, toAbsoluteUrl } from "../../utils.ts";
import { Heading, Link, Image } from "../../types.ts";

/**
 * Extract title from HTML
 */
export function extractTitle(html: string): string | null {
  if (!html) return null;
  
  try {
    const $ = cheerio.load(html);
    return $('title').first().text().trim() || null;
  } catch (error) {
    console.error('Error extracting title:', error);
    return null;
  }
}

/**
 * Extract meta description from HTML
 */
export function extractMetaDescription(html: string): string | null {
  if (!html) return null;
  
  try {
    const $ = cheerio.load(html);
    return $('meta[name="description"]').attr('content')?.trim() || null;
  } catch (error) {
    console.error('Error extracting meta description:', error);
    return null;
  }
}

/**
 * Extract meta keywords from HTML
 */
export function extractMetaKeywords(html: string): string | null {
  if (!html) return null;
  
  try {
    const $ = cheerio.load(html);
    return $('meta[name="keywords"]').attr('content')?.trim() || null;
  } catch (error) {
    console.error('Error extracting meta keywords:', error);
    return null;
  }
}

/**
 * Extract H1 from HTML
 */
export function extractH1(html: string): string | null {
  if (!html) return null;
  
  try {
    const $ = cheerio.load(html);
    return $('h1').first().text().trim() || null;
  } catch (error) {
    console.error('Error extracting H1:', error);
    return null;
  }
}

/**
 * Extract all links from HTML
 */
export function extractLinks(html: string, baseUrl: string): string[] {
  if (!html) return [];
  
  try {
    const $ = cheerio.load(html);
    const links: string[] = [];
    
    $('a[href]').each((_, element) => {
      const href = $(element).attr('href')?.trim();
      if (href && !href.startsWith('javascript:') && href !== '#') {
        try {
          const absoluteUrl = toAbsoluteUrl(href, baseUrl);
          links.push(absoluteUrl);
        } catch (e) {
          console.error(`Error converting to absolute URL: ${e}`);
        }
      }
    });
    
    // Remove duplicates
    return [...new Set(links)];
  } catch (error) {
    console.error('Error extracting links:', error);
    return [];
  }
}

/**
 * Categorize links into internal and external
 */
export function categorizeLinks(links: string[], baseUrl: string): { internalLinks: string[], externalLinks: string[] } {
  const internalLinks: string[] = [];
  const externalLinks: string[] = [];
  
  const baseDomain = extractDomainFromUrl(baseUrl);
  
  for (const link of links) {
    try {
      const linkDomain = extractDomainFromUrl(link);
      
      if (linkDomain === baseDomain || !link.includes('://')) {
        internalLinks.push(link);
      } else {
        externalLinks.push(link);
      }
    } catch (e) {
      console.error(`Error categorizing link ${link}: ${e}`);
      // If we can't parse it, assume it's external
      externalLinks.push(link);
    }
  }
  
  return { internalLinks, externalLinks };
}

/**
 * Helper function to extract domain from URL
 */
function extractDomainFromUrl(url: string): string {
  try {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (e) {
    console.error(`Error extracting domain from ${url}: ${e}`);
    return url;
  }
}

/**
 * Extract all headings from HTML
 */
export function extractHeadings(html: string): Heading[] {
  if (!html) return [];
  
  try {
    const $ = cheerio.load(html);
    const headings: Heading[] = [];
    
    // Extract h1 through h6 tags
    for (let i = 1; i <= 6; i++) {
      $(`h${i}`).each((index, element) => {
        const content = $(element).text().trim();
        if (content) {
          headings.push({
            type: `h${i}`,
            content,
            position: headings.length + 1
          });
        }
      });
    }
    
    return headings;
  } catch (error) {
    console.error('Error extracting headings:', error);
    return [];
  }
}

/**
 * Extract all images from HTML
 */
export function extractImages(html: string, baseUrl: string): Image[] {
  if (!html) return [];
  
  try {
    const $ = cheerio.load(html);
    const images: Image[] = [];
    
    $('img').each((_, element) => {
      const src = $(element).attr('src');
      if (src) {
        try {
          const absoluteSrc = toAbsoluteUrl(src, baseUrl);
          const alt = $(element).attr('alt') || null;
          
          images.push({
            src: absoluteSrc,
            alt,
            has_alt: alt !== null && alt.trim() !== ''
          });
        } catch (e) {
          console.error(`Error processing image: ${e}`);
        }
      }
    });
    
    return images;
  } catch (error) {
    console.error('Error extracting images:', error);
    return [];
  }
}

/**
 * Extract word count from HTML
 */
export function extractWordCount(html: string): number {
  if (!html) return 0;
  
  try {
    const $ = cheerio.load(html);
    
    // Get the text from body
    const bodyText = $('body').text();
    if (!bodyText) return 0;
    
    // Clean the text
    const cleanText = sanitizeHtml(bodyText);
    
    // Count words
    const words = cleanText.split(/\s+/).filter(Boolean);
    return words.length;
  } catch (error) {
    console.error('Error extracting word count:', error);
    return 0;
  }
}

/**
 * Check for canonical URL
 */
export function extractCanonicalUrl(html: string, baseUrl: string): string | null {
  if (!html) return null;
  
  try {
    const $ = cheerio.load(html);
    const canonicalHref = $('link[rel="canonical"]').attr('href');
    
    if (canonicalHref) {
      return toAbsoluteUrl(canonicalHref, baseUrl);
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting canonical URL:', error);
    return null;
  }
}

/**
 * Extract robots meta tag directives
 */
export function extractRobotsDirectives(html: string): string | null {
  if (!html) return null;
  
  try {
    const $ = cheerio.load(html);
    return $('meta[name="robots"]').attr('content')?.trim() || null;
  } catch (error) {
    console.error('Error extracting robots directives:', error);
    return null;
  }
}

/**
 * Extract schema markup
 */
export function extractSchemaMarkup(html: string): any[] {
  if (!html) return [];
  
  try {
    const $ = cheerio.load(html);
    const schemas: any[] = [];
    
    // Look for JSON-LD
    $('script[type="application/ld+json"]').each((_, element) => {
      try {
        const text = $(element).html();
        if (text) {
          const parsed = JSON.parse(text);
          schemas.push(parsed);
        }
      } catch (e) {
        console.error('Error parsing JSON-LD:', e);
      }
    });
    
    return schemas;
  } catch (error) {
    console.error('Error extracting schema markup:', error);
    return [];
  }
}

/**
 * Extract Open Graph metadata
 */
export function extractOpenGraphData(html: string): Record<string, string> {
  if (!html) return {};
  
  try {
    const $ = cheerio.load(html);
    const ogData: Record<string, string> = {};
    
    $('meta[property^="og:"]').each((_, element) => {
      const property = $(element).attr('property');
      const content = $(element).attr('content');
      
      if (property && content) {
        ogData[property.replace('og:', '')] = content;
      }
    });
    
    return ogData;
  } catch (error) {
    console.error('Error extracting Open Graph data:', error);
    return {};
  }
}

/**
 * Extract Twitter Card metadata
 */
export function extractTwitterCardData(html: string): Record<string, string> {
  if (!html) return {};
  
  try {
    const $ = cheerio.load(html);
    const twitterData: Record<string, string> = {};
    
    $('meta[name^="twitter:"]').each((_, element) => {
      const name = $(element).attr('name');
      const content = $(element).attr('content');
      
      if (name && content) {
        twitterData[name.replace('twitter:', '')] = content;
      }
    });
    
    return twitterData;
  } catch (error) {
    console.error('Error extracting Twitter Card data:', error);
    return {};
  }
}

/**
 * Calculate the text to HTML ratio
 */
export function calculateTextToHtmlRatio(html: string): number {
  if (!html) return 0;
  
  try {
    const $ = cheerio.load(html);
    
    // Get the text content
    const text = $('body').text().trim();
    
    // Calculate ratio
    const htmlLength = html.length;
    const textLength = text.length;
    
    if (htmlLength === 0) return 0;
    
    return (textLength / htmlLength) * 100;
  } catch (error) {
    console.error('Error calculating text to HTML ratio:', error);
    return 0;
  }
}
