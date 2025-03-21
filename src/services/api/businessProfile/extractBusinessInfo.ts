
import { supabase } from '@/integrations/supabase/client';
import { BusinessProfile } from '@/types/report.types';
import { toast } from 'sonner';
import { simulateBusinessProfileData } from './mocks';
import { extractGmbData } from './extractGmbData';
import { extractValueserpData } from './extractValueserpData';

/**
 * Extrae información de una URL de Google Business
 */
export const extractBusinessInfo = async (
  businessUrl: string
): Promise<Partial<BusinessProfile> | null> => {
  try {
    if (!businessUrl) {
      toast.error('URL no válida', {
        description: 'Debes proporcionar una URL válida',
      });
      return null;
    }
    
    console.log('Attempting to extract business info from URL:', businessUrl);
    
    // Mostrar toast de progreso
    toast.info('Analizando perfil de negocio', {
      description: 'Extrayendo información del perfil de Google Business',
    });
    
    // Check if we have a recent extraction for this URL in the database
    try {
      const { data: cachedProfile, error: fetchError } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('business_url', businessUrl)
        .maybeSingle();
        
      if (fetchError) {
        console.error('Error checking cached profile:', fetchError);
      }
      
      // If we have a recent extraction (less than 1 hour old), use it
      if (cachedProfile && cachedProfile.updated_at) {
        const lastUpdated = new Date(cachedProfile.updated_at);
        const oneHourAgo = new Date();
        oneHourAgo.setHours(oneHourAgo.getHours() - 1);
        
        if (lastUpdated > oneHourAgo && 
            (cachedProfile.business_name || cachedProfile.business_address) &&
            cachedProfile.business_name !== 'Negocio de ejemplo') {
          console.log('Using cached business profile, last updated:', lastUpdated);
          
          toast.success('Información recuperada de la base de datos', {
            description: 'Usando datos recientes del perfil de GMB',
          });
          
          // Parse the business_hours JSON if it's a string
          let businessHours: Record<string, string> = {};
          if (cachedProfile.business_hours) {
            try {
              if (typeof cachedProfile.business_hours === 'string') {
                businessHours = JSON.parse(cachedProfile.business_hours);
              } else if (typeof cachedProfile.business_hours === 'object') {
                // If it's already an object, ensure it's the correct type
                businessHours = cachedProfile.business_hours as Record<string, string>;
              }
            } catch (parseError) {
              console.error('Error parsing business hours:', parseError);
              // Continue with empty business hours rather than failing
            }
          }
          
          // Transform database record to frontend format
          return {
            businessUrl: cachedProfile.business_url,
            businessName: cachedProfile.business_name || '',
            businessAddress: cachedProfile.business_address || '',
            businessCategory: cachedProfile.business_category || '',
            businessRating: cachedProfile.business_rating !== undefined ? cachedProfile.business_rating : null,
            businessReviewsCount: cachedProfile.business_reviews_count || 0,
            businessPhone: cachedProfile.business_phone || '',
            businessWebsite: cachedProfile.business_website || '',
            businessHours
          };
        } else {
          console.log('Cached profile is too old or not substantial, refreshing data');
        }
      }
    } catch (dbError) {
      console.error('Error checking database for cached profile:', dbError);
    }
    
    // Try to get real data via different methods
    let profileData = null;
    
    // First try scraping directly from GMB
    try {
      profileData = await extractGmbData(businessUrl, true);
      
      // Verify if we got real data (not simulated)
      if (profileData && 
          (profileData.businessName || profileData.businessAddress) && 
          profileData.businessName !== 'Negocio de ejemplo') {
        
        console.log('Successfully extracted business profile data via GMB scraping');
        
        // Ensure everything is properly structured
        ensureValidProfileData(profileData);
        
        const isPartialData = !profileData.businessRating || !profileData.businessPhone || !profileData.businessWebsite;
        
        if (isPartialData) {
          toast.warning('Datos incompletos', {
            description: 'Se obtuvieron algunos datos del perfil, pero no está completo'
          });
        } else {
          toast.success('Información extraída correctamente', {
            description: 'Se ha obtenido información completa del perfil de negocio',
          });
        }
        
        return profileData;
      }
    } catch (extractError) {
      console.error('Error during GMB data extraction:', extractError);
    }
    
    // If GMB scraping failed, try ValueSerp API if we have a business name
    if (!profileData || profileData.businessName === 'Negocio de ejemplo') {
      // Extract business name from URL if possible
      const businessName = extractBusinessNameFromUrl(businessUrl);
      
      if (businessName) {
        try {
          console.log('Trying ValueSerp API with business name:', businessName);
          toast.info('Consultando API alternativa', {
            description: 'Intentando obtener datos mediante ValueSerp...'
          });
          
          profileData = await extractValueserpData(businessName);
          
          // Verify if we got real data
          if (profileData && 
              (profileData.businessName || profileData.businessAddress) && 
              profileData.businessName !== 'Negocio de ejemplo') {
            
            console.log('Successfully extracted business profile data via ValueSerp');
            
            // Ensure everything is properly structured
            ensureValidProfileData(profileData);
            
            toast.success('Información extraída correctamente', {
              description: 'Datos obtenidos mediante ValueSerp',
            });
            
            return profileData;
          }
        } catch (valueserpError) {
          console.error('Error during ValueSerp data extraction:', valueserpError);
        }
      }
    }
    
    // If we reach here, no significant data was obtained or it's simulated
    console.warn('No significant business data extracted, using simulation');
    
    // Return simulated data with a clear note
    const simulatedData = simulateBusinessProfileData(businessUrl);
    toast.warning('Se están usando datos simulados', {
      description: 'No se pudieron extraer datos reales del perfil, se muestran datos de ejemplo'
    });
    
    return simulatedData;
    
  } catch (error: any) {
    console.error('Error extracting business information:', error);
    toast.error('Error al extraer información', {
      description: error.message || 'No se pudo procesar la URL proporcionada',
    });
    
    // In case of error, return simulated data to avoid blank screen
    return simulateBusinessProfileData(businessUrl);
  }
};

// Helper function to ensure all profile data is valid
function ensureValidProfileData(profileData: Partial<BusinessProfile>) {
  // Ensure businessHours is an object
  if (!profileData.businessHours) {
    profileData.businessHours = {};
  } else if (typeof profileData.businessHours === 'string') {
    try {
      profileData.businessHours = JSON.parse(profileData.businessHours) as Record<string, string>;
    } catch (e) {
      console.error('Error parsing business hours string:', e);
      profileData.businessHours = {};
    }
  }
  
  // Ensure businessRating is a number or explicitly null
  if (profileData.businessRating === undefined) {
    profileData.businessRating = null;
  }
  
  // Ensure businessReviewsCount is a number
  if (profileData.businessReviewsCount === undefined) {
    profileData.businessReviewsCount = 0;
  }
  
  // Provide default empty strings for text fields if they're missing
  profileData.businessName = profileData.businessName || '';
  profileData.businessAddress = profileData.businessAddress || '';
  profileData.businessCategory = profileData.businessCategory || '';
  profileData.businessPhone = profileData.businessPhone || '';
  profileData.businessWebsite = profileData.businessWebsite || '';
}

// Extract business name from Google Maps URL
function extractBusinessNameFromUrl(url: string): string | null {
  try {
    // Try to extract from place path segment
    if (url.includes('/place/')) {
      const placeMatch = url.match(/\/place\/([^\/]+)/);
      if (placeMatch && placeMatch[1]) {
        // Decode URI component and replace plus signs with spaces
        const decoded = decodeURIComponent(placeMatch[1]).replace(/\+/g, ' ');
        // Remove any trailing parameters or coordinates
        return decoded.split(',')[0].split('@')[0];
      }
    }
    
    // Try to extract from query parameter
    const urlObj = new URL(url);
    const query = urlObj.searchParams.get('q');
    if (query) {
      return query.split(',')[0];
    }
    
    return null;
  } catch (e) {
    console.error('Error extracting business name from URL:', e);
    return null;
  }
}
