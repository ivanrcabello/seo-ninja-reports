
import { supabase } from '@/integrations/supabase/client';
import { BusinessProfile } from '@/types/report.types';
import { toast } from 'sonner';
import { simulateBusinessProfileData } from './mocks';
import { extractGmbData } from './extractGmbData';

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
          
          // Transform database record to frontend format
          return {
            businessUrl: cachedProfile.business_url,
            businessName: cachedProfile.business_name,
            businessAddress: cachedProfile.business_address,
            businessCategory: cachedProfile.business_category,
            businessRating: cachedProfile.business_rating,
            businessReviewsCount: cachedProfile.business_reviews_count,
            businessPhone: cachedProfile.business_phone,
            businessWebsite: cachedProfile.business_website,
            businessHours: cachedProfile.business_hours
          };
        } else {
          console.log('Cached profile is too old or not substantial, refreshing data');
        }
      }
    } catch (dbError) {
      console.error('Error checking database for cached profile:', dbError);
    }
    
    // Intentar obtener datos reales a través de la función de extracción
    const profileData = await extractGmbData(businessUrl, true);
    
    // Verificar si se obtuvieron datos significativos y si son reales (no simulados)
    if (profileData && 
        (profileData.businessName || profileData.businessAddress) && 
        profileData.businessName !== 'Negocio de ejemplo') {
      
      console.log('Successfully extracted business profile data:', profileData);
      
      // Verificar si el perfil tiene datos completos o parciales
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
    
    // Si llegamos aquí, no se obtuvieron datos significativos o son simulados
    console.warn('No significant business data extracted, using simulation');
    
    // En caso de fallo, devolver datos simulados pero con una nota clara
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
    
    // En caso de error, devolver null en lugar de datos simulados
    // para que los componentes puedan gestionarlo adecuadamente
    return null;
  }
};
