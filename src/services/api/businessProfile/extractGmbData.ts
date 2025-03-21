
import { BusinessProfile } from '@/types/report.types';
import { toast } from 'sonner';
import { simulateBusinessProfileData } from './mocks';
import { isValidGoogleBusinessUrl } from './utils';
import { supabase } from '@/integrations/supabase/client';

/**
 * Extrae información de una URL de Google My Business directamente o a partir de una URL de sitio web
 */
export const extractGmbData = async (
  urlOrWebsite: string,
  isGmbUrl: boolean = false
): Promise<Partial<BusinessProfile> | null> => {
  try {
    // Si es una URL de sitio web, intentamos buscar el perfil GMB asociado
    if (!isGmbUrl) {
      console.log('Extracting GMB data from website URL:', urlOrWebsite);
      toast.info('Buscando perfil de Google Business', {
        description: 'Intentando localizar datos para este negocio',
      });
      
      // Check if we have a recent cached profile for this domain in the database
      const domain = urlOrWebsite.replace(/^https?:\/\//, '').split('/')[0];
      
      try {
        // Try to find a business profile that matches the domain
        const { data: cachedProfile, error: fetchError } = await supabase
          .from('business_profiles')
          .select('*')
          .ilike('business_website', `%${domain}%`)
          .order('updated_at', { ascending: false })
          .maybeSingle();
          
        if (fetchError) {
          console.error('Error checking cached profiles:', fetchError);
        }
        
        if (cachedProfile) {
          console.log('Found cached business profile matching domain:', domain);
          
          // Parse the business_hours JSON if it's a string
          let businessHours: Record<string, string> = {};
          if (cachedProfile.business_hours) {
            try {
              businessHours = typeof cachedProfile.business_hours === 'string'
                ? JSON.parse(cachedProfile.business_hours)
                : cachedProfile.business_hours as Record<string, string>;
            } catch (parseError) {
              console.error('Error parsing business hours:', parseError);
              // Continue with empty business hours
            }
          }
          
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
            businessHours
          };
        }
      } catch (dbError) {
        console.error('Error querying database for domain match:', dbError);
      }
      
      // If we reach here, we couldn't find a cached profile
      // Por ahora, usamos datos simulados
      const mockData = simulateBusinessProfileData(urlOrWebsite);
      
      toast.warning('No se pudo encontrar perfil de GMB', {
        description: 'Se han generado datos simulados para demostración',
      });
      
      return mockData;
    }
    
    // Validar URL de Google My Business
    if (!isValidGoogleBusinessUrl(urlOrWebsite)) {
      toast.error('URL no válida', {
        description: 'Debes proporcionar una URL válida de Google Maps o Google Business',
      });
      return null;
    }
    
    // First check if we have a recent extraction for this URL in the database
    try {
      const { data: cachedProfile, error: fetchError } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('business_url', urlOrWebsite)
        .maybeSingle();
        
      if (fetchError) {
        console.error('Error checking cached profile:', fetchError);
      }
      
      // If we have a recent extraction (less than 24 hours old), use it
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      
      if (cachedProfile && cachedProfile.updated_at) {
        const lastUpdated = new Date(cachedProfile.updated_at);
        
        if (lastUpdated > oneDayAgo) {
          console.log('Using cached business profile, last updated:', lastUpdated);
          
          toast.success('Información recuperada de la base de datos', {
            description: 'Usando datos recientes del perfil de GMB',
          });
          
          // Parse the business_hours JSON if it's a string
          let businessHours: Record<string, string> = {};
          if (cachedProfile.business_hours) {
            try {
              businessHours = typeof cachedProfile.business_hours === 'string'
                ? JSON.parse(cachedProfile.business_hours)
                : cachedProfile.business_hours as Record<string, string>;
            } catch (parseError) {
              console.error('Error parsing business hours:', parseError);
              // Continue with empty business hours
            }
          }
          
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
            businessHours
          };
        } else {
          console.log('Cached profile is older than 24 hours, refreshing data');
        }
      }
    } catch (dbError) {
      console.error('Error checking database for cached profile:', dbError);
    }
    
    toast.info('Analizando perfil de negocio', {
      description: 'Extrayendo información del perfil de Google Business',
    });
    
    console.log('Calling scrape-business edge function with URL:', urlOrWebsite);
    
    // Intentos máximos para obtener datos
    const maxRetries = 2;
    let attempts = 0;
    let error = null;
    
    // Intentar hasta tener éxito o agotar intentos
    while (attempts < maxRetries) {
      attempts++;
      console.log(`Intento ${attempts} de extraer información de GMB`);
      
      try {
        // Llamar a nuestra función edge usando supabase.functions.invoke
        const { data, error: fnError } = await supabase.functions.invoke('scrape-business', {
          body: { url: urlOrWebsite }
        });
        
        if (fnError) {
          console.error(`Error invoking edge function: ${fnError.message}`);
          throw new Error(`Error en la función edge: ${fnError.message}`);
        }
        
        if (!data) {
          console.error('Edge function returned no data');
          throw new Error('La función edge no devolvió datos');
        }
        
        if (!data.success) {
          console.error('Edge function reported failure:', data.error);
          throw new Error(data.error || 'Error desconocido en la extracción de datos');
        }
        
        console.log('Business profile data extracted:', data.data);
        
        // Validate received data to ensure it's not just a placeholder
        if (!data.data.businessName && !data.data.businessAddress) {
          throw new Error('No se pudo extraer información esencial del negocio');
        }
        
        // Check if the data looks like it's from Google Maps itself rather than a business
        if (data.data.businessName === 'Google Maps' || 
            data.data.businessName === 'Google' || 
            data.data.businessName?.includes('Google')) {
          throw new Error('Se detectó información genérica de Google Maps, no de un negocio');
        }
        
        toast.success('Información extraída correctamente', {
          description: 'Se ha obtenido información del perfil de negocio',
        });
        
        return data.data as Partial<BusinessProfile>;
        
      } catch (requestError: any) {
        console.error(`Error en intento ${attempts}:`, requestError);
        error = requestError;
        
        if (attempts < maxRetries) {
          console.log('Esperando antes de reintentar...');
          await new Promise(resolve => setTimeout(resolve, 2000)); // Esperar 2 segundos antes de reintentar
        }
      }
    }
    
    // Si llegamos aquí, todos los intentos fallaron
    console.error('Error final al extraer datos de GMB:', error);
    toast.error('Error en extracción de datos', {
      description: error?.message || 'No se pudo extraer información del perfil',
    });
    
    // Devolver datos simulados para que la interfaz tenga algo que mostrar
    const mockData = simulateBusinessProfileData(urlOrWebsite);
    
    toast.warning('Se están usando datos simulados', {
      description: 'No se pudieron extraer datos reales del perfil',
    });
    
    return mockData;
    
  } catch (error: any) {
    console.error('Error extracting business information:', error);
    toast.error('Error al extraer información', {
      description: error.message || 'No se pudo procesar la solicitud',
    });
    
    // Devolver datos simulados para evitar una pantalla en blanco
    const mockData = simulateBusinessProfileData(urlOrWebsite);
    
    toast.warning('Se están usando datos simulados', {
      description: 'Ha ocurrido un error durante la extracción',
    });
    
    return mockData;
  }
};
