
import * as cheerio from 'https://esm.sh/cheerio@1.0.0-rc.12'
import { BusinessHours } from './types.ts';

/**
 * Follows redirects for shortened URLs like g.co
 */
export async function getRedirectedUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    return response.url;
  } catch (error) {
    console.error('Error following redirect:', error);
    return url; // Return original if redirect fails
  }
}

/**
 * Generate simulated business data for testing purposes
 */
export function simulateBusinessProfileData(url: string) {
  return {
    businessUrl: url,
    businessName: 'Negocio de ejemplo',
    businessAddress: 'Calle Ejemplo 123, Ciudad',
    businessPhone: '+34 123 456 789',
    businessCategory: 'Servicios Profesionales',
    businessRating: 4.7,
    businessReviewsCount: 42,
    businessWebsite: 'https://www.ejemplo.com',
    businessHours: {
      'Monday': '9:00 - 18:00',
      'Tuesday': '9:00 - 18:00',
      'Wednesday': '9:00 - 18:00',
      'Thursday': '9:00 - 18:00',
      'Friday': '9:00 - 17:00',
      'Saturday': 'Cerrado',
      'Sunday': 'Cerrado'
    }
  };
}

/**
 * Extract business name from multiple possible HTML patterns
 */
export function extractBusinessName($: cheerio.CheerioAPI): string | undefined {
  // Try multiple selectors for business name
  const selectors = [
    'h1.DUwDvf', // Common Google Maps business name
    'h1[data-attrid="title"]',
    'div[data-attrid="title"]',
    'div.fontHeadlineLarge',
    'h1',
    'div.x3AX1-LfntMc-header-title-title',
    'div[role="main"] div[role="heading"]',
    // Additional selectors below
    'div.lMbq3e h1',
    'span[jsslot] h1',
    'div.SPZz6b h1'
  ];
  
  for (const selector of selectors) {
    const name = $(selector).first().text().trim();
    if (name) return name;
  }
  
  // Fallback - look for markup containing role="heading" and the largest text
  const headings = $('[role="heading"]').toArray();
  const largestHeading = headings.sort((a, b) => 
    $(b).text().trim().length - $(a).text().trim().length
  )[0];
  
  if (largestHeading) {
    return $(largestHeading).text().trim();
  }
  
  // Further fallback - look for meta title
  const metaTitle = $('meta[property="og:title"]').attr('content');
  if (metaTitle) {
    // Clean up meta title by removing " - Google Maps" suffix if present
    return metaTitle.replace(/ - Google Maps$/, '').trim();
  }
  
  return undefined;
}

/**
 * Extract business address from HTML
 */
export function extractBusinessAddress($: cheerio.CheerioAPI): string | undefined {
  // Try multiple selectors for address
  const selectors = [
    'div[data-attrid="kc:/location/location:address"]',
    'button[data-item-id="address"]',
    'button[aria-label*="dirección" i]',
    'button[aria-label*="address" i]',
    'button[aria-label*="directions" i]',
    'button[data-tooltip*="dirección" i]',
    'button[data-tooltip*="address" i]',
    'div.rogA2c',
    'div.fontBodyMedium div.Io6YTe',
    // Additional selectors
    'span[aria-label*="dirección:" i]',
    'div[jsaction*="address"]',
    '[jsan*="address"]'
  ];
  
  for (const selector of selectors) {
    const address = $(selector).first().text().trim();
    if (address) return address;
  }
  
  // Try finding structured data
  const structuredData = $('script[type="application/ld+json"]').toArray();
  for (const script of structuredData) {
    try {
      const data = JSON.parse($(script).html() || '{}');
      if (data.address) {
        return typeof data.address === 'string' 
          ? data.address 
          : `${data.address.streetAddress || ''}, ${data.address.addressLocality || ''}, ${data.address.addressRegion || ''}`.trim();
      }
    } catch (e) {
      // Ignore parsing errors
    }
  }
  
  // Look for anything that might be an address
  const addressRegexes = [
    /\d+\s+[A-Za-z\s]+,\s+[A-Za-z\s]+/,  // Street number and name, City
    /Calle\s+[A-Za-z0-9\s]+,\s+[A-Za-z\s]+/i, // Spanish street format
    /Av\.\s+[A-Za-z0-9\s]+,\s+[A-Za-z\s]+/i, // Avenue format
  ];
  
  const bodyText = $('body').text();
  for (const regex of addressRegexes) {
    const match = bodyText.match(regex);
    if (match) return match[0].trim();
  }
  
  return undefined;
}

/**
 * Extract business category from HTML
 */
export function extractBusinessCategory($: cheerio.CheerioAPI): string | undefined {
  // Try multiple selectors for business category
  const selectors = [
    'div[data-attrid="kc:/local:one line summary"]',
    'button[data-item-id="category"]',
    'span.YhemCb',
    'div.fontBodyMedium span.YhemCb',
    'span[jsslot] span.YhemCb',
    // Additional selectors
    'button[aria-label*="categoría" i]',
    'button[aria-label*="category" i]',
    'span.R8V97'
  ];
  
  for (const selector of selectors) {
    const category = $(selector).first().text().trim();
    if (category) return category;
  }
  
  // Try structured data
  const structuredData = $('script[type="application/ld+json"]').toArray();
  for (const script of structuredData) {
    try {
      const data = JSON.parse($(script).html() || '{}');
      if (data.category || data['@type']) {
        return data.category || data['@type'];
      }
    } catch (e) {
      // Ignore parsing errors
    }
  }
  
  return undefined;
}

/**
 * Extract business phone from HTML
 */
export function extractBusinessPhone($: cheerio.CheerioAPI): string | undefined {
  // Try multiple selectors for phone
  const selectors = [
    'div[data-attrid="kc:/collection/knowledge_panels/has_phone:phone"]',
    'button[data-item-id="phone"]',
    'button[aria-label*="teléfono" i]',
    'button[aria-label*="phone" i]',
    'button[aria-label*="call" i]',
    'div[data-tooltip*="phone" i]',
    '[href^="tel:"]',
    // Additional selectors
    'a[data-dtype="d3ph"]',
    'span[aria-label*="teléfono:" i]'
  ];
  
  for (const selector of selectors) {
    const phone = $(selector).first().text().trim();
    if (phone) return phone;
    
    // Check for href attribute in case of tel: links
    const hrefPhone = $(selector).first().attr('href');
    if (hrefPhone && hrefPhone.startsWith('tel:')) {
      return hrefPhone.replace('tel:', '');
    }
  }
  
  // Look for phone patterns in the text
  const phoneRegexes = [
    /\+\d{1,3}\s\d{2,3}\s\d{3}\s\d{3}/,  // International format with spaces
    /\+\d{1,3}\s\d{2,3}\s\d{6,7}/,       // International condensed
    /\d{3}[\s.-]\d{3}[\s.-]\d{4}/,       // US format
    /\d{9,10}/                          // Just digits
  ];
  
  const bodyText = $('body').text();
  for (const regex of phoneRegexes) {
    const match = bodyText.match(regex);
    if (match) return match[0].trim();
  }
  
  return undefined;
}

/**
 * Extract business website from HTML
 */
export function extractBusinessWebsite($: cheerio.CheerioAPI): string | undefined {
  // Try multiple selectors for website
  const selectors = [
    'div[data-attrid="kc:/local:website"] a',
    'a[data-item-id="authority"]',
    'a[aria-label*="sitio web" i]',
    'a[aria-label*="website" i]',
    'a[data-item-id*="website" i]',
    'div.QqG1Sd a',
    'a.CL9Uqc',
    'div[jsaction*="mouseup:website"]',
    // Additional selectors
    'a[jsaction*="website"]',
    'div[role="main"] a[target="_blank"]'
  ];
  
  for (const selector of selectors) {
    const $element = $(selector).first();
    const href = $element.attr('href');
    if (href && !href.includes('google.com')) {
      return href;
    }
    
    const text = $element.text().trim();
    if (text && text.match(/^https?:\/\//)) {
      return text;
    }
  }
  
  // Try structured data
  const structuredData = $('script[type="application/ld+json"]').toArray();
  for (const script of structuredData) {
    try {
      const data = JSON.parse($(script).html() || '{}');
      if (data.website || data.url) {
        return data.website || data.url;
      }
    } catch (e) {
      // Ignore parsing errors
    }
  }
  
  return undefined;
}

/**
 * Extract business rating and reviews count from HTML
 */
export function extractBusinessRating($: cheerio.CheerioAPI): { rating?: number, reviewsCount?: number } {
  let rating: number | undefined;
  let reviewsCount: number | undefined;
  
  // Try multiple selectors for rating
  const ratingSelectors = [
    'div[data-attrid="kc:/collection/knowledge_panels/local_reviewable:star_score"] span',
    'span.F7nice',
    'span[aria-hidden="true"][role="img"]',
    'span.yi40Hd',
    'div.fontDisplayLarge',
    // Additional selectors
    'div[aria-label*="estrellas" i]',
    'div[aria-label*="stars" i]',
    'div.review-score-container'
  ];
  
  for (const selector of ratingSelectors) {
    const ratingText = $(selector).first().text().trim();
    if (ratingText) {
      // Extract numeric part, accounting for comma as decimal separator
      const match = ratingText.match(/(\d+[.,]?\d*)/);
      if (match) {
        rating = parseFloat(match[0].replace(',', '.'));
        break;
      }
    }
  }
  
  // Try multiple selectors for reviews count
  const reviewsSelectors = [
    'div[data-attrid="kc:/collection/knowledge_panels/local_reviewable:star_score"] span.hqzQac',
    'span.z5jxId',
    'button[data-tooltip="Google reviews"]',
    'button[jsaction*="reviews"]',
    // Additional selectors
    'span[aria-label*="reseñas" i]',
    'span[aria-label*="reviews" i]',
    'div.F7nice span:nth-child(2)'
  ];
  
  for (const selector of reviewsSelectors) {
    const reviewsText = $(selector).first().text().trim();
    if (reviewsText) {
      // Extract numeric part
      const match = reviewsText.match(/(\d+[.,]?\d*)/);
      if (match) {
        // Handle thousands separators
        reviewsCount = parseInt(match[0].replace(/[.,]/g, ''));
        break;
      }
    }
  }
  
  // Try structured data
  const structuredData = $('script[type="application/ld+json"]').toArray();
  for (const script of structuredData) {
    try {
      const data = JSON.parse($(script).html() || '{}');
      if (data.aggregateRating) {
        rating = rating || data.aggregateRating.ratingValue;
        reviewsCount = reviewsCount || data.aggregateRating.reviewCount;
      }
    } catch (e) {
      // Ignore parsing errors
    }
  }
  
  return { rating, reviewsCount };
}

/**
 * Extract business hours from HTML
 */
export function extractBusinessHours($: cheerio.CheerioAPI): BusinessHours | undefined {
  const hours: BusinessHours = {};
  
  // Try multiple selectors for hours
  const hoursSelectors = [
    'div[data-attrid="kc:/location/location:hours"] div.MkV9e',
    'div[aria-label*="horas" i] div.OMl5r',
    'div[aria-label*="hours" i] table',
    'table.eK4R0e',
    'div.t39EBf table',
    // Additional selectors
    'div.OMl5r',
    'div[data-memento]',
    'div[jscontroller*="hours"]'
  ];
  
  let hoursFound = false;
  for (const selector of hoursSelectors) {
    const $hours = $(selector);
    if ($hours.length > 0) {
      // Try to find day-by-day hours
      $hours.find('tr, div.mWTrf').each((i, elem) => {
        const dayTimeText = $(elem).text().trim();
        // Look for patterns like "Monday: 9:00 AM - 5:00 PM"
        const match = dayTimeText.match(/(\w+)(?:day)?:?\s*(.*?)$/i);
        
        if (match) {
          const day = match[1];
          const times = match[2].trim();
          
          if (day && times) {
            const dayKey = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
            hours[dayKey] = times;
            hoursFound = true;
          }
        }
      });
      
      if (hoursFound) break;
    }
  }
  
  // Try structured data if no hours found
  if (!hoursFound) {
    const structuredData = $('script[type="application/ld+json"]').toArray();
    for (const script of structuredData) {
      try {
        const data = JSON.parse($(script).html() || '{}');
        if (data.openingHours || data.openingHoursSpecification) {
          const hoursData = data.openingHours || data.openingHoursSpecification;
          
          if (Array.isArray(hoursData)) {
            hoursData.forEach(hourSpec => {
              if (hourSpec.dayOfWeek && hourSpec.opens && hourSpec.closes) {
                const day = typeof hourSpec.dayOfWeek === 'string' ? 
                  hourSpec.dayOfWeek : 
                  hourSpec.dayOfWeek[0];
                
                // Clean up day name
                const dayKey = day.replace('http://schema.org/', '');
                hours[dayKey] = `${hourSpec.opens} - ${hourSpec.closes}`;
                hoursFound = true;
              }
            });
          }
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }
  }
  
  return hoursFound ? hours : undefined;
}
