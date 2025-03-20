
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
    
    // Llamar a nuestra función edge para hacer scraping del perfil
    const { data, error } = await supabase.functions.invoke('scrape-business', {
      body: { url: businessUrl }
    });
    
    if (error) {
      console.error('Error invoking scrape-business function:', error);
      toast.error('Error en extracción de datos', {
        description: error.message || 'No se pudo extraer información del perfil',
      });
      return null;
    }
    
    if (!data || !data.success) {
      console.error('Invalid response from scrape-business function:', data);
      toast.error('Error en extracción de datos', {
        description: 'No se pudo extraer información del perfil',
      });
      return null;
    }
    
    console.log('Business profile data extracted:', data.data);
    
    // Validate received data
    if (!data.data.businessName && !data.data.businessAddress) {
      console.log('No significant business data received, using simulated data');
      const mockData = simulateBusinessProfileData(businessUrl);
      
      toast.success('Información simulada generada', {
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
    return null;
  }
};
