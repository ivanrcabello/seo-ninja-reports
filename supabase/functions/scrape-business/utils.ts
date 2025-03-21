
import { BusinessProfileData } from './types.ts';

// Function to follow redirects and get the final URL
export async function getRedirectedUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow'
    });
    return response.url;
  } catch (error) {
    console.error('Error following redirect:', error);
    return url; // Return original URL if redirect fails
  }
}

// Extract business name with multiple selectors
export function extractBusinessName($: cheerio.CheerioAPI): string | undefined {
  const selectors = [
    'h1.DUwDvf', // Main title in Google Maps
    'h1[data-attrid="title"]', // Another title format
    'div[data-attrid="title"]',
    'div.fontHeadlineLarge',
    'div.x3AX1-LfntMc-header-title-title',
    'div.kZLOHe',
    'div.SPZz6b > h2', // New mobile format
    'div[data-tooltip="Copy title"]'
  ];
  
  for (const selector of selectors) {
    const element = $(selector).first();
    if (element.length && element.text().trim()) {
      return element.text().trim();
    }
  }
  
  // Fallback: look for any element that might be a title
  const metaTitle = $('meta[property="og:title"]').attr('content');
  if (metaTitle && !metaTitle.includes('Google Maps') && !metaTitle.includes('Map')) {
    return metaTitle.split('-')[0].trim();
  }
  
  return undefined;
}

// Extract business address with multiple selectors
export function extractBusinessAddress($: cheerio.CheerioAPI): string | undefined {
  const selectors = [
    'button[data-item-id="address"]', // Most common address button
    'button[aria-label*="address"]',
    'button[aria-label*="dirección"]',
    'a[data-item-id="address"]',
    'div[data-tooltip="Copy address"]',
    'span.LrzXr', // Knowledge panel address
    'div.rogA2c', // Address in new layout
    'div.Z1hOCe', // Another address format
    'span[jsan*="address"]'
  ];
  
  for (const selector of selectors) {
    const element = $(selector).first();
    if (element.length && element.text().trim()) {
      return element.text().trim();
    }
  }
  
  // Fallback to meta data
  const metaDescription = $('meta[name="description"]').attr('content');
  if (metaDescription && metaDescription.includes(', ')) {
    const parts = metaDescription.split(', ');
    if (parts.length > 1) {
      return parts.slice(1).join(', ').split('·')[0].trim();
    }
  }
  
  return undefined;
}

// Extract business category with multiple selectors
export function extractBusinessCategory($: cheerio.CheerioAPI): string | undefined {
  const selectors = [
    'button[jsaction*="category"]',
    'span.YhemCb',
    'span[jsaction*="category"]',
    'div.kEyIgc',
    'span.hEKFXc',
    'span.HlvSq',
    'button.DkEaL'
  ];
  
  for (const selector of selectors) {
    const element = $(selector).first();
    if (element.length && element.text().trim()) {
      return element.text().trim();
    }
  }
  
  return undefined;
}

// Extract business phone with multiple selectors
export function extractBusinessPhone($: cheerio.CheerioAPI): string | undefined {
  const selectors = [
    'button[data-item-id*="phone"]',
    'button[aria-label*="phone"]',
    'button[aria-label*="teléfono"]',
    'a[data-item-id*="phone"]',
    'span[data-tooltip="Copy phone number"]',
    'button.xYj5ab',
    'span.LrzXr'
  ];
  
  for (const selector of selectors) {
    const element = $(selector).first();
    if (element.length && element.text().trim()) {
      let phone = element.text().trim();
      // Clean up phone number
      if (phone.includes('+')) {
        return phone;
      }
      return phone;
    }
  }
  
  return undefined;
}

// Extract business website with multiple selectors
export function extractBusinessWebsite($: cheerio.CheerioAPI): string | undefined {
  // First look for direct website links
  const selectors = [
    'a[data-item-id*="website"]',
    'a[aria-label*="website"]',
    'a[aria-label*="sitio web"]',
    'a.CsEnBe',
    'a[data-tooltip="Open website"]',
    'div.kTmzN > a',
    'a.iPF7ob',
    'a.Tbyirb'
  ];
  
  for (const selector of selectors) {
    const element = $(selector).first();
    if (element.length) {
      const href = element.attr('href');
      if (href && (href.startsWith('http') || href.startsWith('www'))) {
        // Remove tracking parameters from Google
        if (href.includes('?')) {
          const url = new URL(href);
          // Remove Google's tracking parameters
          url.searchParams.delete('utm_source');
          url.searchParams.delete('utm_medium');
          url.searchParams.delete('utm_campaign');
          return url.toString();
        }
        return href;
      }
    }
  }
  
  // Sometimes the website is in the text of a button
  const websiteButtons = $('button').filter(function() {
    const text = $(this).text().toLowerCase();
    return text.includes('website') || text.includes('sitio web');
  });
  
  if (websiteButtons.length) {
    const buttonText = websiteButtons.first().text().trim();
    if (buttonText.includes('http') || buttonText.includes('www')) {
      return buttonText;
    }
  }
  
  return undefined;
}

// Extract business rating and reviews count
export function extractBusinessRating($: cheerio.CheerioAPI): { rating: number | undefined, reviewsCount: number | undefined } {
  const result = { rating: undefined, reviewsCount: undefined };
  
  // Rating selectors
  const ratingSelectors = [
    'span.F7nice',
    'span[aria-hidden="true"][role="img"]',
    'span.fontDisplayLarge',
    'div.F7nice',
    'span.tWPTdb',
    'span.fzRBVc',
    'div.rNhVpd'
  ];
  
  for (const selector of ratingSelectors) {
    const element = $(selector).first();
    if (element.length && element.text().trim()) {
      const text = element.text().trim();
      const ratingMatch = text.match(/^(\d+(\.\d+)?)/);
      if (ratingMatch) {
        result.rating = parseFloat(ratingMatch[0]);
        break;
      }
    }
  }
  
  // Reviews count selectors
  const reviewsSelectors = [
    'span.F7nice + span',
    'span.fontBodyMedium a[href*="reviews"]',
    'span.RDApEe',
    'button.HHrUdb',
    'span.z5jxId',
    'span[aria-label*="reviews"]',
    'span[aria-label*="reseñas"]'
  ];
  
  for (const selector of reviewsSelectors) {
    const element = $(selector).first();
    if (element.length && element.text().trim()) {
      const text = element.text().trim();
      const reviewsMatch = text.match(/(\d+[\,\.]?\d*)/);
      if (reviewsMatch) {
        // Remove thousands separators and convert to number
        const numericText = reviewsMatch[0].replace(/[,\.]/g, '');
        result.reviewsCount = parseInt(numericText, 10);
        break;
      }
    }
  }
  
  return result;
}

// Extract business hours
export function extractBusinessHours($: cheerio.CheerioAPI): Record<string, string> | undefined {
  const hoursMap: Record<string, string> = {};
  
  // Look for hours container
  const hoursSelectors = [
    'div[aria-label*="Hours"] table tr',
    'div[aria-label*="horario"] table tr',
    'div.t39EKf table tr',
    'div.MK2YTd table tr',
    'div.t1Zz8b table tr',
    'table.y0skZc tr',
    'div.eK4R0e',
    'div.o0Svhc'
  ];
  
  let hoursFound = false;
  
  for (const selector of hoursSelectors) {
    const rows = $(selector);
    if (rows.length) {
      rows.each((i, row) => {
        const dayElement = $(row).find('th, td:first-child, div:first-child');
        const hoursElement = $(row).find('td:last-child, li, div:last-child');
        
        if (dayElement.length && hoursElement.length) {
          const day = dayElement.text().trim();
          const hours = hoursElement.text().trim();
          
          if (day && hours) {
            // Only add if day looks like a day of week (avoid section headers)
            const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 
                             'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
            
            const isDayOfWeek = dayNames.some(dayName => 
              day.toLowerCase().includes(dayName) || dayName.toLowerCase().includes(day.toLowerCase().substring(0, 3))
            );
            
            if (isDayOfWeek) {
              hoursMap[day] = hours;
              hoursFound = true;
            }
          }
        }
      });
      
      if (hoursFound) {
        break;
      }
    }
  }
  
  // If we found hours, return them, otherwise return undefined
  return hoursFound ? hoursMap : undefined;
}

// Simulate business profile data when real extraction fails
export function simulateBusinessProfileData(url: string): BusinessProfileData {
  console.log('Simulating business profile data for URL:', url);
  
  return {
    businessUrl: url,
    businessName: 'Negocio de ejemplo',
    businessAddress: 'Calle Principal 123, Ciudad',
    businessCategory: 'Categoría de ejemplo',
    businessRating: 4.5,
    businessReviewsCount: 123,
    businessPhone: '+34 91 123 45 67',
    businessWebsite: 'https://www.example.com',
    businessHours: {
      'Lunes': '9:00-18:00',
      'Martes': '9:00-18:00',
      'Miércoles': '9:00-18:00',
      'Jueves': '9:00-18:00',
      'Viernes': '9:00-18:00',
      'Sábado': '10:00-14:00',
      'Domingo': 'Cerrado'
    }
  };
}

// Check if URL is valid for Google Business or Maps
export function isValidGoogleBusinessUrl(url: string): boolean {
  if (!url) return false;
  
  // Check if the URL is a well-formed URL
  try {
    new URL(url);
  } catch {
    return false;
  }
  
  // Check if it's a Google Maps or Google Business URL
  return (
    url.includes('google.com/maps') || 
    url.includes('goo.gl/maps') || 
    url.includes('maps.app.goo.gl') || 
    url.includes('g.page') ||
    url.includes('business.google.com')
  );
}
