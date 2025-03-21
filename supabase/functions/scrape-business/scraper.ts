
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
    
    // For Google Maps URLs, we may need to ensure the place details are in the URL
    if (!finalUrl.includes('/place/') && (finalUrl.includes('google.com/maps') || finalUrl.includes('maps.google'))) {
      console.log('URL does not contain place details path, attempting to extract from parameters');
      // Try to extract place ID or details from URL parameters if available
      const urlObj = new URL(finalUrl);
      const placeParam = urlObj.searchParams.get('q') || '';
      if (placeParam) {
        console.log(`Found place parameter: ${placeParam}`);
        // If we have a place parameter, try to format a better URL
        finalUrl = `https://www.google.com/maps/place/${encodeURIComponent(placeParam)}`;
        console.log(`Reformatted URL: ${finalUrl}`);
      }
    }
    
    // Get the HTML content of the page with multiple user agents to avoid blocking
    console.log(`Fetching HTML content from: ${finalUrl}`);
    
    // Define multiple user agents to try
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
    ];
    
    // Try each user agent until we get a successful response
    let html = '';
    let success = false;
    
    for (const userAgent of userAgents) {
      try {
        const response = await fetch(finalUrl, {
          headers: {
            'User-Agent': userAgent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          redirect: 'follow'
        });
        
        if (!response.ok) {
          console.error(`Failed to fetch URL with user agent ${userAgent}: ${response.status} ${response.statusText}`);
          continue;
        }
        
        html = await response.text();
        console.log(`Fetched HTML content with user agent ${userAgent}, length: ${html.length} characters`);
        
        // Check if the HTML content is valid and contains business data
        if (html.length > 500 && (html.includes('reviewsMeta') || html.includes('address') || html.includes('BusinessName'))) {
          success = true;
          break;
        } else {
          console.log(`HTML content from user agent ${userAgent} doesn't contain expected business data, trying next user agent`);
        }
      } catch (error) {
        console.error(`Error fetching with user agent ${userAgent}:`, error);
      }
    }
    
    if (!success || !html || html.length < 500) {
      console.error('Failed to fetch valid HTML content from any user agent');
      throw new Error('Failed to fetch valid HTML content from Google Maps');
    }
    
    // For debugging: save a sample of the HTML
    console.log(`HTML preview: ${html.substring(0, 500)}...`);
    
    // Use Cheerio to parse the HTML
    const $ = cheerio.load(html);
    
    // Create BusinessData object with the original URL
    const businessData: BusinessProfileData = {
      businessUrl: url
    };
    
    // Enhanced extraction attempts for business name
    businessData.businessName = extractBusinessName($);
    console.log(`Extracted business name: ${businessData.businessName}`);
    
    // Extract address with enhanced method
    businessData.businessAddress = extractBusinessAddress($);
    console.log(`Extracted business address: ${businessData.businessAddress}`);
    
    // Extract category with enhanced method
    businessData.businessCategory = extractBusinessCategory($);
    console.log(`Extracted business category: ${businessData.businessCategory}`);
    
    // Extract phone with enhanced method
    businessData.businessPhone = extractBusinessPhone($);
    console.log(`Extracted business phone: ${businessData.businessPhone}`);
    
    // Extract website with enhanced method
    businessData.businessWebsite = extractBusinessWebsite($);
    console.log(`Extracted business website: ${businessData.businessWebsite}`);
    
    // Extract rating and reviews count with enhanced method
    const ratingData = extractBusinessRating($);
    businessData.businessRating = ratingData.rating;
    businessData.businessReviewsCount = ratingData.reviewsCount;
    console.log(`Extracted rating: ${businessData.businessRating}, reviews: ${businessData.businessReviewsCount}`);
    
    // Extract hours with enhanced method
    businessData.businessHours = extractBusinessHours($);
    console.log(`Extracted business hours:`, businessData.businessHours);
    
    // If no significant data was extracted, throw an error
    if (!businessData.businessName && !businessData.businessAddress) {
      console.error("Could not extract real information");
      throw new Error("Could not extract essential business information");
    }
    
    // Process the address to separate it from the name if necessary
    // This is important when Google Maps returns a combined name and address
    if (businessData.businessName && businessData.businessName.includes('·')) {
      const parts = businessData.businessName.split('·');
      if (parts.length >= 2) {
        businessData.businessName = parts[0].trim();
        // Only set address if it's not already set from other methods
        if (!businessData.businessAddress) {
          businessData.businessAddress = parts[1].trim();
        }
      }
    }
    
    console.log("Profile data extraction complete:", businessData);
    return businessData;
    
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    throw error; // Let the calling function handle the error and decide if simulation is needed
  }
}
