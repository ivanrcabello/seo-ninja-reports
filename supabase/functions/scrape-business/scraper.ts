
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
    console.log(`Starting to scrape Google Business profile from URL: ${url}`);
    
    // If it's a shortened URL like g.co, follow redirects to get the full URL
    let finalUrl = url;
    if (url.includes('g.co') || url.includes('goo.gl') || url.includes('maps.app')) {
      console.log('Detected shortened link, following redirects...');
      try {
        finalUrl = await getRedirectedUrl(url);
        console.log(`URL redirects to: ${finalUrl}`);
      } catch (redirectError) {
        console.error('Error following redirect:', redirectError);
        // Continue with original URL if redirect fails
      }
    }
    
    // Get the HTML content of the page
    console.log(`Fetching HTML content from: ${finalUrl}`);
    const response = await fetch(finalUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      redirect: 'follow'
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
    }
    
    const html = await response.text();
    console.log(`Fetched HTML content length: ${html.length} characters`);
    
    // Check if the HTML content is valid
    if (!html || html.length < 500) {
      console.error('Invalid HTML content received, possibly blocked by Google');
      throw new Error('Invalid HTML content received, possibly blocked by Google');
    }
    
    // Use Cheerio to parse the HTML
    const $ = cheerio.load(html);
    
    // Create BusinessData object with the original URL
    const businessData: BusinessProfileData = {
      businessUrl: url
    };
    
    // Extract business name
    businessData.businessName = extractBusinessName($);
    console.log(`Extracted business name: ${businessData.businessName}`);
    
    // Extract address
    businessData.businessAddress = extractBusinessAddress($);
    console.log(`Extracted business address: ${businessData.businessAddress}`);
    
    // Extract category
    businessData.businessCategory = extractBusinessCategory($);
    console.log(`Extracted business category: ${businessData.businessCategory}`);
    
    // Extract phone
    businessData.businessPhone = extractBusinessPhone($);
    console.log(`Extracted business phone: ${businessData.businessPhone}`);
    
    // Extract website
    businessData.businessWebsite = extractBusinessWebsite($);
    console.log(`Extracted business website: ${businessData.businessWebsite}`);
    
    // Extract rating and reviews count
    const ratingData = extractBusinessRating($);
    businessData.businessRating = ratingData.rating;
    businessData.businessReviewsCount = ratingData.reviewsCount;
    console.log(`Extracted rating: ${businessData.businessRating}, reviews: ${businessData.businessReviewsCount}`);
    
    // Extract hours
    businessData.businessHours = extractBusinessHours($);
    console.log(`Extracted business hours:`, businessData.businessHours);
    
    // If no significant data was extracted, throw an error
    if (!businessData.businessName && !businessData.businessAddress) {
      console.error("Could not extract real information");
      throw new Error("Could not extract essential business information");
    }
    
    console.log("Profile data extraction complete:", businessData);
    return businessData;
    
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    throw error; // Let the calling function handle the error and decide if simulation is needed
  }
}
