
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
  // Estrategia 1: Buscar el elemento h1 que suele contener el nombre
  const nameElement = $('h1').first();
  if (nameElement.length) {
    return nameElement.text().trim();
  }
  
  // Estrategia 2: Buscar por atributos de datos específicos que Google usa
  const dataElement = $('[data-attrid="title"]');
  if (dataElement.length) {
    return dataElement.text().trim();
  }
  
  // Estrategia 3: Extraer del título de la página
  const titleText = $('title').text();
  if (titleText) {
    // El título suele tener el formato "Nombre del Negocio - Google Maps"
    const namePart = titleText.split('-')[0];
    if (namePart) {
      return namePart.trim();
    }
  }
  
  // Estrategia 4: Buscar elementos que contengan información del negocio
  const businessInfoElement = $('.section-hero-header-title');
  if (businessInfoElement.length) {
    return businessInfoElement.first().text().trim();
  }
  
  return undefined;
}

// Extract business address
export function extractBusinessAddress($: cheerio.CheerioAPI): string | undefined {
  // Estrategia 1: Buscar botones con dirección
  let address: string | undefined;
  
  // Buscar por atributo data-item-id
  $('button[data-item-id="address"]').each(function() {
    const addressText = $(this).text();
    if (addressText) {
      address = addressText.trim();
      return false; // Romper el bucle
    }
  });
  
  if (address) return address;
  
  // Estrategia 2: Buscar cualquier elemento que contenga dirección
  $('[data-tooltip="Copiar dirección"]').each(function() {
    const parent = $(this).parent();
    if (parent.length) {
      address = parent.text().trim();
      return false;
    }
  });
  
  if (address) return address;
  
  // Estrategia 3: Buscar por clase específica o contenido
  $('a[href^="https://maps.google.com/maps/dir/"]').each(function() {
    const addressElement = $(this).find('.widget-pane-link');
    if (addressElement.length) {
      address = addressElement.text().trim();
      return false;
    }
  });
  
  if (address) return address;
  
  // Estrategia 4: Buscar en los metadatos
  $('meta[property="og:description"]').each(function() {
    const content = $(this).attr('content');
    if (content) {
      // La descripción a veces contiene la dirección
      address = content.trim();
      return false;
    }
  });
  
  return address;
}

// Extract business category
export function extractBusinessCategory($: cheerio.CheerioAPI): string | undefined {
  let category: string | undefined;
  
  // Estrategia 1: Buscar por data-item-id
  $('button[data-item-id^="category"]').each(function() {
    const categoryText = $(this).text();
    if (categoryText) {
      category = categoryText.trim();
      return false;
    }
  });
  
  if (category) return category;
  
  // Estrategia 2: Buscar por clases de categoría
  $('.section-facts-carousel-item-label, .cswXje').each(function() {
    const text = $(this).text().trim();
    if (text && !category) {
      category = text;
      return false;
    }
  });
  
  if (category) return category;
  
  // Estrategia 3: Buscar en los elementos de información
  $('[jsaction="pane.rating.category"]').each(function() {
    category = $(this).text().trim();
    return false;
  });
  
  return category;
}

// Extract business phone
export function extractBusinessPhone($: cheerio.CheerioAPI): string | undefined {
  let phone: string | undefined;
  
  // Estrategia 1: Buscar por data-item-id
  $('button[data-item-id="phone:tel"]').each(function() {
    const phoneText = $(this).text();
    if (phoneText) {
      phone = phoneText.trim();
      return false;
    }
  });
  
  if (phone) return phone;
  
  // Estrategia 2: Buscar enlaces de teléfono
  $('a[href^="tel:"]').each(function() {
    phone = $(this).text().trim() || $(this).attr('href')?.replace('tel:', '');
    return false;
  });
  
  if (phone) return phone;
  
  // Estrategia 3: Buscar por contenido
  $('[data-tooltip="Copiar número de teléfono"]').each(function() {
    const parent = $(this).parent();
    if (parent.length) {
      phone = parent.text().trim();
      return false;
    }
  });
  
  return phone;
}

// Extract business website
export function extractBusinessWebsite($: cheerio.CheerioAPI): string | undefined {
  let website: string | undefined;
  
  // Estrategia 1: Buscar por data-item-id
  $('a[data-item-id^="authority"]').each(function() {
    const href = $(this).attr('href');
    if (href) {
      website = href;
      return false;
    }
  });
  
  if (website) return website;
  
  // Estrategia 2: Buscar enlaces de sitio web
  $('a[data-tooltip="Abrir sitio web"]').each(function() {
    website = $(this).attr('href');
    return false;
  });
  
  if (website) return website;
  
  // Estrategia 3: Buscar cualquier enlace que parezca un sitio web
  $('a').each(function() {
    const href = $(this).attr('href');
    if (href && (href.startsWith('http') || href.startsWith('www')) && 
        !href.includes('google.com') && 
        !href.includes('maps.app') && 
        !href.includes('goo.gl')) {
      website = href;
      return false;
    }
  });
  
  return website;
}

// Extract business rating and reviews count
export function extractBusinessRating($: cheerio.CheerioAPI): { rating?: number, reviewsCount?: number } {
  const result: { rating?: number, reviewsCount?: number } = {};
  
  // Estrategia 1: Buscar elementos de calificación
  $('span[aria-hidden="true"]').filter(function() {
    return /^\d+(\.\d+)?$/.test($(this).text().trim());
  }).first().each(function() {
    const ratingText = $(this).text().trim();
    if (ratingText) {
      result.rating = parseFloat(ratingText);
    }
  });
  
  if (!result.rating) {
    // Estrategia 2: Buscar por clases de calificación
    $('.section-star-display, .F7nice').each(function() {
      const text = $(this).text().trim();
      if (/^\d+(\.\d+)?$/.test(text)) {
        result.rating = parseFloat(text);
        return false;
      }
    });
  }
  
  // Buscar el recuento de reseñas
  if (result.rating) {
    // Buscar cerca de la calificación
    const reviewsText = $('span').filter(function() {
      const text = $(this).text().trim();
      return /\d+\s+(reviews|reseñas|opiniones)/i.test(text);
    }).first().text();
    
    if (reviewsText) {
      const reviewsMatch = reviewsText.match(/(\d+)/);
      if (reviewsMatch && reviewsMatch[1]) {
        result.reviewsCount = parseInt(reviewsMatch[1], 10);
      }
    }
  }
  
  if (!result.reviewsCount) {
    // Estrategia alternativa para recuento de reseñas
    $('button').each(function() {
      const text = $(this).text().trim();
      const match = text.match(/(\d+)\s+(reviews|reseñas|opiniones)/i);
      if (match && match[1]) {
        result.reviewsCount = parseInt(match[1], 10);
        return false;
      }
    });
  }
  
  return result;
}

// Extract business hours
export function extractBusinessHours($: cheerio.CheerioAPI): Record<string, string> | undefined {
  const hoursData: Record<string, string> = {};
  
  // Estrategia 1: Buscar tabla de horarios
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
  
  if (Object.keys(hoursData).length > 0) {
    return hoursData;
  }
  
  // Estrategia 2: Buscar elementos de horario por clases
  $('.section-open-hours-container, .t39EKf').each(function() {
    $(this).find('.section-open-hours-row, .kc0J9').each(function() {
      const dayElement = $(this).find('.section-open-hours-day, .G8aQO');
      const hoursElement = $(this).find('.section-open-hours-hour, .DkEaL');
      
      if (dayElement.length && hoursElement.length) {
        const day = dayElement.text().trim();
        const hours = hoursElement.text().trim();
        
        if (day && hours) {
          hoursData[day] = hours;
        }
      }
    });
  });
  
  return Object.keys(hoursData).length > 0 ? hoursData : undefined;
}
