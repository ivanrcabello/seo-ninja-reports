
import * as cheerio from 'https://esm.sh/cheerio@1.0.0-rc.12'
import { BusinessProfileData } from './types.ts';

// Function to follow redirections and get final URL
export async function getRedirectedUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url, { redirect: 'follow', method: 'HEAD' });
    return response.url;
  } catch (error) {
    console.error('Error siguiendo redirección:', error);
    return url; // En caso de error, devolver la URL original
  }
}

// Function to simulate business profile data (fallback)
export function simulateBusinessProfileData(businessUrl: string): BusinessProfileData {
  return {
    businessUrl,
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

// Extract business name from HTML
export function extractBusinessName($: cheerio.CheerioAPI): string | undefined {
  const nameElement = $('h1').first();
  if (nameElement.length) {
    return nameElement.text().trim();
  } else {
    // Try to extract from page title
    const titleText = $('title').text();
    if (titleText) {
      // Title usually has format "Business Name - Google Maps"
      const namePart = titleText.split('-')[0];
      if (namePart) {
        return namePart.trim();
      }
    }
  }
  return undefined;
}

// Extract business address
export function extractBusinessAddress($: cheerio.CheerioAPI): string | undefined {
  let address: string | undefined;
  $('button[data-item-id="address"]').each(function() {
    const addressText = $(this).text();
    if (addressText) {
      address = addressText.trim();
    }
  });
  return address;
}

// Extract business category
export function extractBusinessCategory($: cheerio.CheerioAPI): string | undefined {
  let category: string | undefined;
  $('button[data-item-id^="category"]').each(function() {
    const categoryText = $(this).text();
    if (categoryText) {
      category = categoryText.trim();
    }
  });
  return category;
}

// Extract business phone
export function extractBusinessPhone($: cheerio.CheerioAPI): string | undefined {
  let phone: string | undefined;
  $('button[data-item-id="phone:tel"]').each(function() {
    const phoneText = $(this).text();
    if (phoneText) {
      phone = phoneText.trim();
    }
  });
  return phone;
}

// Extract business website
export function extractBusinessWebsite($: cheerio.CheerioAPI): string | undefined {
  let website: string | undefined;
  $('a[data-item-id^="authority"]').each(function() {
    const href = $(this).attr('href');
    if (href) {
      website = href;
    }
  });
  return website;
}

// Extract business rating and reviews count
export function extractBusinessRating($: cheerio.CheerioAPI): { rating?: number, reviewsCount?: number } {
  const result: { rating?: number, reviewsCount?: number } = {};
  
  // Find rating
  const ratingText = $('span[aria-hidden="true"]').filter(function() {
    return /^\d+(\.\d+)?$/.test($(this).text().trim());
  }).first().text();
  
  if (ratingText) {
    result.rating = parseFloat(ratingText);
    
    // Find reviews count (usually near the rating)
    const reviewsText = $('span').filter(function() {
      const text = $(this).text().trim();
      return /\d+\s+(reviews|reseñas)/.test(text);
    }).first().text();
    
    if (reviewsText) {
      const reviewsMatch = reviewsText.match(/(\d+)/);
      if (reviewsMatch && reviewsMatch[1]) {
        result.reviewsCount = parseInt(reviewsMatch[1], 10);
      }
    }
  }
  
  return result;
}

// Extract business hours
export function extractBusinessHours($: cheerio.CheerioAPI): Record<string, string> | undefined {
  const hoursData: Record<string, string> = {};
  
  $('tr').each(function() {
    const dayElement = $(this).find('th');
    const hoursElement = $(this).find('td');
    
    if (dayElement.length && hoursElement.length) {
      const day = dayElement.text().trim();
      const hours = hoursElement.text().trim();
      
      if (day && hours) {
        hoursData[day] = hours;
      }
    }
  });
  
  return Object.keys(hoursData).length > 0 ? hoursData : undefined;
}
