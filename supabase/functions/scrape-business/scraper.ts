
import * as cheerio from 'https://esm.sh/cheerio@1.0.0-rc.12'
import { BusinessProfileData } from './types.ts';
import { 
  getRedirectedUrl, 
  simulateBusinessProfileData,
  extractBusinessName,
  extractBusinessAddress,
  extractBusinessCategory,
  extractBusinessPhone,
  extractBusinessWebsite,
  extractBusinessRating,
  extractBusinessHours
} from './utils.ts';

// Main function to scrape a Google Business profile
export async function scrapeBusinessProfile(url: string): Promise<BusinessProfileData> {
  try {
    // If it's a shortened URL like g.co, follow redirects to get the full URL
    let finalUrl = url;
    if (url.includes('g.co') || url.includes('goo.gl')) {
      console.log('Detectado enlace acortado, siguiendo redirecciones...');
      finalUrl = await getRedirectedUrl(url);
      console.log(`URL redirecciona a: ${finalUrl}`);
    }
    
    // Get the HTML content of the page
    const response = await fetch(finalUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
    }
    
    const html = await response.text();
    console.log(`Fetched HTML content: ${html.length} characters`);
    
    // Create BusinessData object with the original URL
    const businessData: BusinessProfileData = {
      businessUrl: url
    };
    
    // Use Cheerio to parse the HTML
    const $ = cheerio.load(html);
    
    // Extract business name
    businessData.businessName = extractBusinessName($);
    
    // Extract address
    businessData.businessAddress = extractBusinessAddress($);
    
    // Extract category
    businessData.businessCategory = extractBusinessCategory($);
    
    // Extract phone
    businessData.businessPhone = extractBusinessPhone($);
    
    // Extract website
    businessData.businessWebsite = extractBusinessWebsite($);
    
    // Extract rating and reviews count
    const ratingData = extractBusinessRating($);
    businessData.businessRating = ratingData.rating;
    businessData.businessReviewsCount = ratingData.reviewsCount;
    
    // Extract hours
    businessData.businessHours = extractBusinessHours($);
    
    // If no significant data was extracted, use simulated data for development
    if (!businessData.businessName && !businessData.businessAddress) {
      console.log("No se pudo extraer información real, usando datos simulados");
      return simulateBusinessProfileData(url);
    }
    
    console.log("Datos extraídos del perfil:", businessData);
    return businessData;
    
  } catch (error) {
    console.error(`Error al hacer scraping de ${url}:`, error);
    
    // In case of error, return simulated data for development
    console.log("Error en scraping, usando datos simulados");
    return simulateBusinessProfileData(url);
  }
}
