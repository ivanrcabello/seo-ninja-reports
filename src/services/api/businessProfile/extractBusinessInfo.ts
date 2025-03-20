
import { supabase } from '@/integrations/supabase/client';
import { BusinessProfile } from '@/types/report.types';
import { toast } from 'sonner';
import { simulateBusinessProfileData } from './mocks';

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
    
    toast.info('Analizando perfil de negocio', {
      description: 'Extrayendo información del perfil de Google Business',
    });
    
    console.log('Calling scrape-business edge function with URL:', businessUrl);
    
    // Intentos máximos para obtener datos
    const maxRetries = 2;
    let attempts = 0;
    let data = null;
    let error = null;
    
    // Intentar hasta tener éxito o agotar intentos
    while (attempts < maxRetries && !data) {
      attempts++;
      console.log(`Intento ${attempts} de extraer información de GMB`);
      
      // Llamar a nuestra función edge para hacer scraping del perfil
      const result = await supabase.functions.invoke('scrape-business', {
        body: { url: businessUrl }
      });
      
      data = result.data;
      error = result.error;
      
      if (error) {
        console.error(`Error en intento ${attempts}:`, error);
        
        if (attempts < maxRetries) {
          console.log('Esperando antes de reintentar...');
          await new Promise(resolve => setTimeout(resolve, 2000)); // Esperar 2 segundos antes de reintentar
        }
      }
    }
    
    if (error) {
      console.error('Error final invocando scrape-business function:', error);
      toast.error('Error en extracción de datos', {
        description: error.message || 'No se pudo extraer información del perfil',
      });
      return simulateBusinessProfileData(businessUrl);
    }
    
    if (!data || !data.success) {
      console.error('Invalid response from scrape-business function:', data);
      toast.error('Error en extracción de datos', {
        description: 'No se pudo extraer información del perfil',
      });
      return simulateBusinessProfileData(businessUrl);
    }
    
    console.log('Business profile data extracted:', data.data);
    
    // Validate received data
    if (!data.data.businessName && !data.data.businessAddress) {
      console.log('No significant business data received, using simulated data');
      const mockData = simulateBusinessProfileData(businessUrl);
      
      toast.warning('Información simulada generada', {
        description: 'Se ha simulado información del perfil para demostración',
      });
      
      return {
        businessUrl: mockData.businessUrl,
        businessName: mockData.businessName,
        businessAddress: mockData.businessAddress,
        businessPhone: mockData.businessPhone,
        businessCategory: mockData.businessCategory,
        businessRating: mockData.businessRating,
        businessReviewsCount: mockData.businessReviewsCount,
        businessWebsite: mockData.businessWebsite,
        businessHours: mockData.businessHours
      };
    }
    
    toast.success('Información extraída correctamente', {
      description: 'Se ha obtenido información del perfil de negocio',
    });
    
    return data.data as Partial<BusinessProfile>;
    
  } catch (error: any) {
    console.error('Error extracting business information:', error);
    toast.error('Error al extraer información', {
      description: error.message || 'No se pudo procesar la URL proporcionada',
    });
    
    // En caso de error, devolver datos simulados
    return simulateBusinessProfileData(businessUrl);
  }
};
