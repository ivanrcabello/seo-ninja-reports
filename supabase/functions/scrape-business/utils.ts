
import * as cheerio from 'https://esm.sh/cheerio@1.0.0-rc.12'
import { BusinessProfileData } from './types.ts';

// Follows redirects to get the final URL
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
    return url; // Return original URL if unable to follow redirects
  }
}

// Simulates business profile data for development and fallback
export function simulateBusinessProfileData(url: string): BusinessProfileData {
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

// Extract business name with multiple selector strategies
export function extractBusinessName($: cheerio.CheerioAPI): string | undefined {
  // Strategy 1: Look for heading elements
  const headingSelectors = [
    'h1',
    'h1.fontHeadlineLarge',
    'div[role="main"] h1', 
    'div.bJzME.tTVLSc h1',
    'div.fontHeadlineLarge',
    'div[data-attrid="title"]',
    'span.fontHeadlineLarge',
    'div.kp-header div.SPZz6b',
    'div.Mot0gd',
    'div.fontHeadlineLarge.xzVNx',
    'div[data-attrid="title"] span',
    'div.kp-header div.SPZz6b',
    'div.DUwDvf',
    'div.tAd8D',
    'div.Io6YTe.fontHeadlineLarge'
  ];
  
  for (const selector of headingSelectors) {
    const element = $(selector).first();
    if (element.length && element.text().trim()) {
      return element.text().trim();
    }
  }
  
  // Strategy 2: Look for structured data in script tags
  const scripts = $('script[type="application/ld+json"]');
  for (let i = 0; i < scripts.length; i++) {
    try {
      const script = scripts.eq(i);
      const json = JSON.parse(script.html() || '{}');
      if (json.name) {
        return json.name;
      }
    } catch (e) {
      // Continue to next script tag if parsing fails
    }
  }
  
  // Strategy 3: Look for elements with high probability of containing business name
  const nameSelectors = [
    'div.lfPIob',
    'div.SPZz6b',
    'div.qBF1Pd',
    'div.fxKbKc h2',
    'div.YjL1W'
  ];
  
  for (const selector of nameSelectors) {
    const element = $(selector).first();
    if (element.length && element.text().trim()) {
      return element.text().trim();
    }
  }
  
  // Strategy 4: Look in meta tags
  const metaTitle = $('meta[property="og:title"]').attr('content') ||
                    $('meta[name="twitter:title"]').attr('content') ||
                    $('title').text();
                    
  if (metaTitle) {
    // Clean up the title - often contains " - Google Maps" or similar
    return metaTitle.replace(/ - Google Maps$/, '').trim();
  }
  
  return undefined;
}

// Extract business address with multiple selector strategies
export function extractBusinessAddress($: cheerio.CheerioAPI): string | undefined {
  // Strategy 1: Common address containers
  const addressSelectors = [
    'button[data-item-id="address"] div.LTs0Rc span',
    'button[data-item-id="address"] div.Io6YTe',
    'div[data-tooltip="Copiar dirección"] > div > span.LRkQ3e',
    'div.rogA2c div.Io6YTe',
    'div[jsaction="pane.attributes.expand"] button span.LrzXr',
    'button[data-item-id="address"]',
    'div[data-attrid="kc:/location/location:address"] span',
    'div.Z1hOCe span.LrzXr',
    'div.LCiwEc span.LrzXr',
    'div.T6pBCe',
    'div.iZV6Fc',
    'span.LrzXr.zdqRlf',
    'span[jsan*="7.LrzXr"]'
  ];
  
  for (const selector of addressSelectors) {
    const element = $(selector).first();
    if (element.length && element.text().trim()) {
      return element.text().trim();
    }
  }
  
  // Strategy 2: Look for structured data in script tags
  const scripts = $('script[type="application/ld+json"]');
  for (let i = 0; i < scripts.length; i++) {
    try {
      const script = scripts.eq(i);
      const json = JSON.parse(script.html() || '{}');
      
      if (json.address) {
        if (typeof json.address === 'string') {
          return json.address;
        } else if (json.address.streetAddress) {
          const parts = [
            json.address.streetAddress,
            json.address.addressLocality,
            json.address.addressRegion,
            json.address.postalCode,
            json.address.addressCountry
          ].filter(Boolean);
          return parts.join(', ');
        }
      }
    } catch (e) {
      // Continue to next script tag if parsing fails
    }
  }
  
  // Strategy 3: Look for "address" attribute or similar text
  const textsToFind = ['Dirección:', 'Address:', 'Location:'];
  for (const text of textsToFind) {
    const element = $(`div:contains("${text}")`)
      .filter(function() {
        return $(this).text().trim() === text;
      })
      .parent();
      
    if (element.length) {
      const addressElement = element.find('span').last();
      if (addressElement.length && addressElement.text().trim()) {
        return addressElement.text().trim();
      }
    }
  }
  
  // Strategy 4: Look in meta description which sometimes contains the address
  const metaDescription = $('meta[name="description"]').attr('content');
  if (metaDescription && metaDescription.includes(',') && !metaDescription.includes('Google Maps')) {
    return metaDescription.trim();
  }
  
  return undefined;
}

// Extract business category with multiple selector strategies
export function extractBusinessCategory($: cheerio.CheerioAPI): string | undefined {
  // Strategy 1: Common category containers
  const categorySelectors = [
    'button[data-item-id="category"] div.LTs0Rc span',
    'button[data-item-id="category"] div.Io6YTe',
    'div.LCiwEc span.YhemCb',
    'span.YhemCb',
    'div[jsaction="pane.rating.category"]',
    'div.qBF1Pd',
    'div.LlbBCb.zHkOIc',
    'div.bGRnRa',
    'span[jsan*="7.YhemCb"]'
  ];
  
  for (const selector of categorySelectors) {
    const element = $(selector).first();
    if (element.length && element.text().trim()) {
      return element.text().trim();
    }
  }
  
  // Strategy 2: Look for structured data in script tags
  const scripts = $('script[type="application/ld+json"]');
  for (let i = 0; i < scripts.length; i++) {
    try {
      const script = scripts.eq(i);
      const json = JSON.parse(script.html() || '{}');
      
      if (json.category || json['@type']) {
        return json.category || json['@type'];
      }
    } catch (e) {
      // Continue to next script tag if parsing fails
    }
  }
  
  // Strategy 3: Attempt to find category near the business name
  const businessNameEl = $('h1').first();
  if (businessNameEl.length) {
    const parent = businessNameEl.parent();
    const categoryElement = parent.find('span').eq(1);
    if (categoryElement.length && categoryElement.text().trim()) {
      return categoryElement.text().trim();
    }
  }
  
  return undefined;
}

// Extract business phone number with multiple selector strategies
export function extractBusinessPhone($: cheerio.CheerioAPI): string | undefined {
  // Strategy 1: Common phone containers
  const phoneSelectors = [
    'button[data-item-id="phone"] div.LTs0Rc span',
    'button[data-item-id="phone"] div.Io6YTe',
    'span[data-dtype="d3ph"]',
    'div[data-attrid="kc:/collection/knowledge_panels/has_phone:phone"] span',
    'a[data-dtype="d3ph"]',
    'div.Io6YTe[jsan*="phone"]',
    'span[jsan*="7.xlb"]',
    'div.Z1hOCe',
    'a[data-tooltip="Copiar número de teléfono"]',
    'button[aria-label*="phone"]',
    'button[aria-label*="teléfono"]'
  ];
  
  for (const selector of phoneSelectors) {
    const element = $(selector).first();
    if (element.length && element.text().trim()) {
      // Clean up phone number - remove "Phone:" prefix if present
      return element.text().replace(/^(Phone|Teléfono):\s*/i, '').trim();
    }
  }
  
  // Strategy 2: Look for structured data in script tags
  const scripts = $('script[type="application/ld+json"]');
  for (let i = 0; i < scripts.length; i++) {
    try {
      const script = scripts.eq(i);
      const json = JSON.parse(script.html() || '{}');
      
      if (json.telephone) {
        return json.telephone;
      }
    } catch (e) {
      // Continue to next script tag if parsing fails
    }
  }
  
  // Strategy 3: Look for elements with phone-like patterns
  const phonePattern = /(\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/;
  const allElements = $('span, div, a, button').filter(function() {
    const text = $(this).text().trim();
    return phonePattern.test(text) && text.length < 30; // Avoid matching long texts with numbers
  });
  
  if (allElements.length > 0) {
    return allElements.first().text().trim();
  }
  
  return undefined;
}

// Extract business website with multiple selector strategies
export function extractBusinessWebsite($: cheerio.CheerioAPI): string | undefined {
  // Strategy 1: Common website containers
  const websiteSelectors = [
    'a[data-item-id="authority"]',
    'a[data-dtype="authority"]',
    'a[data-item-id="website"]',
    'div[data-attrid="kc:/local:authority"] a',
    'a[ping="/url?"]',
    'a[jsaction*="website"]',
    'div.zYuQLb a',
    'a[href*="://"]:not([href*="google"])[data-jsarwt="1"]',
    'a[jsaction="r.Njz0Ic"][data-ved]',
    'div.weaSyd a[data-jsarwt]',
    'div.QZHBPe a'
  ];
  
  for (const selector of websiteSelectors) {
    const element = $(selector).first();
    if (element.length && element.attr('href')) {
      const href = element.attr('href') || '';
      
      // If the URL starts with /url?, extract the actual URL from the 'q' parameter
      if (href.startsWith('/url?')) {
        const urlParams = new URLSearchParams(href.substring(5));
        const actualUrl = urlParams.get('q') || urlParams.get('url');
        if (actualUrl) {
          return actualUrl;
        }
      }
      
      // Only return if it's a valid URL and not a Google URL
      if (href.match(/^https?:\/\//) && !href.includes('google.com')) {
        return href;
      }
    }
  }
  
  // Strategy 2: Look for structured data in script tags
  const scripts = $('script[type="application/ld+json"]');
  for (let i = 0; i < scripts.length; i++) {
    try {
      const script = scripts.eq(i);
      const json = JSON.parse(script.html() || '{}');
      
      if (json.url || json.website) {
        return json.url || json.website;
      }
    } catch (e) {
      // Continue to next script tag if parsing fails
    }
  }
  
  // Strategy 3: Look for plain text URLs in website-related elements
  const urlRegex = /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  const websiteElements = $('div:contains("Website"), div:contains("Sitio web")').parent();
  
  if (websiteElements.length) {
    const text = websiteElements.text();
    const matches = text.match(urlRegex);
    if (matches && matches[0]) {
      return matches[0];
    }
  }
  
  return undefined;
}

// Extract business rating and reviews count with multiple selector strategies
export function extractBusinessRating($: cheerio.CheerioAPI): { rating?: number, reviewsCount?: number } {
  const result: { rating?: number, reviewsCount?: number } = {};
  
  // Strategy 1: Common rating containers
  const ratingSelectors = [
    'div.fontDisplayLarge',
    'span.ODSEW-ShBeI-H1e3jb',
    'span[aria-hidden="true"]',
    'div.fonttitlemedium.eHISWd',
    'div.fontHeadlineSmall',
    'div.rv7ydz',
    'span[data-dtype="d3rating"]',
    'span.rDTa4b',
    'span.yi40Hd.YrbPuc',
    'span.Aq14fc',
    'div.Aq14fc',
    'span.tP9Zud',
    'div.pJm8Ib span',
    'span.T4LgNb.Vd3TTe'
  ];
  
  // Try to find the rating
  for (const selector of ratingSelectors) {
    const element = $(selector).first();
    if (element.length) {
      const text = element.text().trim();
      // Extract numeric value from text (e.g. "4.5" from "4.5 stars")
      const ratingMatch = text.match(/^(\d+(\.\d+)?)/);
      if (ratingMatch && ratingMatch[1]) {
        const rating = parseFloat(ratingMatch[1]);
        if (!isNaN(rating) && rating <= 5.0) {
          result.rating = rating;
          break;
        }
      }
    }
  }
  
  // Strategy 2: Common reviews count containers
  const reviewsSelectors = [
    'div.fontBodyMedium a',
    'span.ODSEW-ShBeI-RRjMXb',
    'div[jsaction*="pane.reviewChart.moreReviews"]',
    'span.HHrUdb',
    'div[jsaction*="pane.rating.moreReviews"]',
    'span.z5jxId',
    'div.pJm8Ib',
    'a.yi40Hd',
    'span.aULzUe',
    'span.T4LgNb.ZkP5wc'
  ];
  
  // Try to find the reviews count
  for (const selector of reviewsSelectors) {
    const element = $(selector).first();
    if (element.length) {
      const text = element.text().trim();
      // Extract numeric value from text (e.g. "123" from "123 reviews")
      const reviewsMatch = text.match(/(\d[\d,.]*)/);
      if (reviewsMatch && reviewsMatch[1]) {
        // Handle thousands separators in different formats
        const count = parseInt(reviewsMatch[1].replace(/[,.\s]/g, ''));
        if (!isNaN(count)) {
          result.reviewsCount = count;
          break;
        }
      }
    }
  }
  
  // Strategy 3: Look for structured data in script tags
  if (!result.rating || !result.reviewsCount) {
    const scripts = $('script[type="application/ld+json"]');
    for (let i = 0; i < scripts.length; i++) {
      try {
        const script = scripts.eq(i);
        const json = JSON.parse(script.html() || '{}');
        
        if (json.aggregateRating) {
          if (!result.rating && json.aggregateRating.ratingValue) {
            const rating = parseFloat(json.aggregateRating.ratingValue);
            if (!isNaN(rating) && rating <= 5.0) {
              result.rating = rating;
            }
          }
          
          if (!result.reviewsCount && json.aggregateRating.reviewCount) {
            const count = parseInt(json.aggregateRating.reviewCount);
            if (!isNaN(count)) {
              result.reviewsCount = count;
            }
          }
        }
        
        if (result.rating && result.reviewsCount) {
          break;
        }
      } catch (e) {
        // Continue to next script tag if parsing fails
      }
    }
  }
  
  return result;
}

// Extract business hours with multiple selector strategies
export function extractBusinessHours($: cheerio.CheerioAPI): Record<string, string> | undefined {
  const result: Record<string, string> = {};
  
  // Strategy 1: Common hours containers
  const hoursElements = $('div[data-dtype="d3iw"]');
  if (hoursElements.length) {
    // Hours are typically in a table or list format
    hoursElements.find('tr').each((i, tr) => {
      const day = $(tr).find('td').eq(0).text().trim();
      const hours = $(tr).find('td').eq(1).text().trim();
      if (day && hours) {
        result[day] = hours;
      }
    });
    
    // If no table found, try list items
    if (Object.keys(result).length === 0) {
      hoursElements.find('li').each((i, li) => {
        const text = $(li).text().trim();
        const parts = text.split(':');
        if (parts.length >= 2) {
          const day = parts[0].trim();
          const hours = parts.slice(1).join(':').trim();
          if (day && hours) {
            result[day] = hours;
          }
        }
      });
    }
  }
  
  // Strategy 2: Look for hours in table format elsewhere
  if (Object.keys(result).length === 0) {
    const hourTables = $('table').filter(function() {
      return $(this).find('td:contains("Monday"), td:contains("Lunes")').length > 0;
    });
    
    if (hourTables.length) {
      hourTables.find('tr').each((i, tr) => {
        const day = $(tr).find('td').eq(0).text().trim();
        const hours = $(tr).find('td').eq(1).text().trim();
        if (day && hours) {
          result[day] = hours;
        }
      });
    }
  }
  
  // Strategy 3: Look for structured data in script tags
  if (Object.keys(result).length === 0) {
    const scripts = $('script[type="application/ld+json"]');
    for (let i = 0; i < scripts.length; i++) {
      try {
        const script = scripts.eq(i);
        const json = JSON.parse(script.html() || '{}');
        
        if (json.openingHours || json.openingHoursSpecification) {
          const hoursData = json.openingHours || json.openingHoursSpecification;
          
          if (Array.isArray(hoursData)) {
            hoursData.forEach(item => {
              if (item.dayOfWeek && item.opens && item.closes) {
                const day = Array.isArray(item.dayOfWeek) ? item.dayOfWeek[0] : item.dayOfWeek;
                result[day] = `${item.opens} - ${item.closes}`;
              }
            });
          } else if (typeof hoursData === 'string') {
            // Sometimes hours are provided as a single string
            const parts = hoursData.split(',');
            parts.forEach(part => {
              const hoursParts = part.trim().split(' ');
              if (hoursParts.length >= 2) {
                const day = hoursParts[0];
                const hours = hoursParts.slice(1).join(' ');
                if (day && hours) {
                  result[day] = hours;
                }
              }
            });
          }
          
          if (Object.keys(result).length > 0) {
            break;
          }
        }
      } catch (e) {
        // Continue to next script tag if parsing fails
      }
    }
  }
  
  return Object.keys(result).length > 0 ? result : undefined;
}
