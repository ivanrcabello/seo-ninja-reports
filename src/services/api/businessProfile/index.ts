
import { extractGmbData } from './extractGmbData';
import { getBusinessProfile } from './getBusinessProfile';
import { saveBusinessProfile } from './saveBusinessProfile';
import { extractBusinessInfoWithValueSerp } from './extractBusinessInfoWithValueSerp';

// Main function to get business information
export const extractBusinessInfo = async (url: string) => {
  // First try with ValueSerp for better results
  try {
    // Extract business name from URL for ValueSerp query
    const businessName = extractBusinessNameFromUrl(url);
    
    if (businessName) {
      const valueSerData = await extractBusinessInfoWithValueSerp(businessName);
      if (valueSerData && valueSerData.businessName) {
        return valueSerData;
      }
    }
  } catch (valueSerError) {
    console.error('Error using ValueSerp, falling back to scraper:', valueSerError);
  }

  // Fallback to original GMB data extraction
  return extractGmbData(url, true);
};

// Helper function to extract business name from a Google Maps URL
const extractBusinessNameFromUrl = (url: string): string | null => {
  try {
    // Extract business name from GMB URL
    const parsedUrl = new URL(url);
    
    // For Google Maps URLs
    if (url.includes('google.com/maps')) {
      // Try to extract from query parameter
      if (parsedUrl.searchParams.has('query')) {
        return parsedUrl.searchParams.get('query');
      }
      
      // Try to extract from the URL path components
      const pathParts = parsedUrl.pathname.split('/');
      if (pathParts.length > 2) {
        // Use the last meaningful part of the path
        for (let i = pathParts.length - 1; i >= 0; i--) {
          if (pathParts[i] && pathParts[i] !== 'place' && pathParts[i] !== 'maps') {
            return decodeURIComponent(pathParts[i].replace(/\+/g, ' '));
          }
        }
      }
    }
    
    // If we can't extract a name, return a fallback from the whole URL
    if (url.includes('maps/place/')) {
      const placeMatch = url.match(/maps\/place\/([^\/]+)/);
      if (placeMatch && placeMatch[1]) {
        return decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting business name from URL:', error);
    return null;
  }
};

export { extractGmbData, getBusinessProfile, saveBusinessProfile };
