
import { cheerio } from "https://esm.sh/cheerio@1.0.0-rc.12";

/**
 * Extract title from HTML content
 */
export function extractTitle(html: string): string | null {
  try {
    const $ = cheerio.load(html);
    const title = $('title').text().trim();
    console.log(`Extracted title: ${title || 'Not found'}`);
    return title || null;
  } catch (error) {
    console.error(`Error extracting title: ${error}`);
    return null;
  }
}

/**
 * Extract meta description from HTML content
 */
export function extractMetaDescription(html: string): string | null {
  try {
    const $ = cheerio.load(html);
    const metaDescription = $('meta[name="description"]').attr('content') || 
                           $('meta[property="og:description"]').attr('content');
    console.log(`Extracted meta description: ${metaDescription ? (metaDescription.substring(0, 50) + '...') : 'Not found'}`);
    return metaDescription || null;
  } catch (error) {
    console.error(`Error extracting meta description: ${error}`);
    return null;
  }
}

/**
 * Extract H1 tag from HTML content
 */
export function extractH1(html: string): string | null {
  try {
    const $ = cheerio.load(html);
    const h1 = $('h1').first().text().trim();
    console.log(`Extracted H1: ${h1 || 'Not found'}`);
    return h1 || null;
  } catch (error) {
    console.error(`Error extracting H1: ${error}`);
    return null;
  }
}

/**
 * Extract all links from HTML content
 */
export function extractLinks(html: string, baseUrl: string): string[] {
  try {
    const $ = cheerio.load(html);
    const links: string[] = [];
    
    $('a[href]').each((_, element) => {
      const href = $(element).attr('href')?.trim();
      if (href && href !== '#' && !href.startsWith('javascript:')) {
        links.push(href);
      }
    });
    
    console.log(`Extracted ${links.length} links`);
    return links;
  } catch (error) {
    console.error(`Error extracting links: ${error}`);
    return [];
  }
}

/**
 * Categorize links as internal or external
 */
export function categorizeLinks(links: string[], baseUrl: string): { internalLinks: string[], externalLinks: string[] } {
  const baseHost = new URL(baseUrl).hostname;
  const internalLinks: string[] = [];
  const externalLinks: string[] = [];
  
  for (const link of links) {
    try {
      // Handle relative URLs
      const absoluteUrl = link.startsWith('http') ? link : new URL(link, baseUrl).href;
      const linkHost = new URL(absoluteUrl).hostname;
      
      if (linkHost === baseHost) {
        internalLinks.push(absoluteUrl);
      } else {
        externalLinks.push(absoluteUrl);
      }
    } catch (error) {
      console.error(`Error categorizing link ${link}: ${error}`);
      // Assume it's internal if we can't parse it
      internalLinks.push(link);
    }
  }
  
  return { internalLinks, externalLinks };
}

/**
 * Extract all headings (h1-h6) from HTML content
 */
export function extractHeadings(html: string): { heading_type: string, content: string, position: number }[] {
  try {
    const $ = cheerio.load(html);
    const headings: { heading_type: string, content: string, position: number }[] = [];
    let position = 0;
    
    $('h1, h2, h3, h4, h5, h6').each((_, element) => {
      const headingType = element.name.toLowerCase();
      const content = $(element).text().trim();
      
      if (content) {
        headings.push({
          heading_type: headingType,
          content: content,
          position: position++
        });
      }
    });
    
    console.log(`Extracted ${headings.length} headings`);
    return headings;
  } catch (error) {
    console.error(`Error extracting headings: ${error}`);
    return [];
  }
}

/**
 * Extract all images from HTML content
 */
export function extractImages(html: string, baseUrl: string): { src: string, alt: string | null }[] {
  try {
    const $ = cheerio.load(html);
    const images: { src: string, alt: string | null }[] = [];
    
    $('img').each((_, element) => {
      const src = $(element).attr('src');
      if (src) {
        const absoluteSrc = src.startsWith('http') ? src : new URL(src, baseUrl).href;
        images.push({
          src: absoluteSrc,
          alt: $(element).attr('alt') || null
        });
      }
    });
    
    console.log(`Extracted ${images.length} images`);
    return images;
  } catch (error) {
    console.error(`Error extracting images: ${error}`);
    return [];
  }
}

/**
 * Extract word count from HTML content
 */
export function extractWordCount(html: string): number {
  try {
    const $ = cheerio.load(html);
    
    // Remove script and style tags
    $('script, style').remove();
    
    // Get text content
    const text = $('body').text();
    
    // Count words
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    console.log(`Extracted word count: ${words.length}`);
    
    return words.length;
  } catch (error) {
    console.error(`Error extracting word count: ${error}`);
    return 0;
  }
}
