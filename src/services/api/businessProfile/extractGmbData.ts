
import { BusinessProfile } from '@/types/report.types';
import { toast } from 'sonner';
import { simulateBusinessProfileData } from './mocks';
import { isValidGoogleBusinessUrl } from './utils';

/**
 * Extrae información de una URL de Google My Business directamente o a partir de una URL de sitio web
 */
export const extractGmbData = async (
  urlOrWebsite: string,
  isGmbUrl: boolean = false
): Promise<Partial<BusinessProfile> | null> => {
  try {
    // Si es una URL de sitio web, intentamos primero con nuestros datos simulados
    // En producción, esto podría ser reemplazado por un servicio que busque
    // el perfil GMB asociado a un sitio web
    if (!isGmbUrl) {
      console.log('Extracting GMB data from website URL:', urlOrWebsite);
      toast.info('Buscando perfil de Google Business', {
        description: 'Intentando localizar datos para este negocio',
      });
      
      // En un entorno real, aquí consultaríamos una API que pueda encontrar
      // perfiles GMB basados en dominio o se utilizaría una API como Google Places
      const mockData = simulateBusinessProfileData(urlOrWebsite);
      
      toast.warning('Datos simulados generados', {
        description: 'Se han generado datos simulados para demostración',
      });
      
      return mockData;
    }
    
    // Si tenemos una URL GMB, procedemos con la extracción normal
    if (!isValidGoogleBusinessUrl(urlOrWebsite)) {
      toast.error('URL no válida', {
        description: 'Debes proporcionar una URL válida de Google Maps o Google Business',
      });
      return null;
    }
    
    toast.info('Analizando perfil de negocio', {
      description: 'Extrayendo información del perfil de Google Business',
    });
    
    console.log('Calling scrape-business edge function with URL:', urlOrWebsite);
    
    // Intentos máximos para obtener datos
    const maxRetries = 2;
    let attempts = 0;
    let data = null;
    let error = null;
    
    // Intentar hasta tener éxito o agotar intentos
    while (attempts < maxRetries && !data) {
      attempts++;
      console.log(`Intento ${attempts} de extraer información de GMB`);
      
      try {
        // Llamar a nuestra función edge para hacer scraping del perfil
        const result = await fetch('https://ctidzqynewvqxguhhknp.supabase.co/functions/v1/scrape-business', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: urlOrWebsite })
        });
        
        if (!result.ok) {
          const errorText = await result.text();
          throw new Error(`Error en la respuesta: ${result.status} - ${errorText}`);
        }
        
        const responseData = await result.json();
        data = responseData;
        
        if (!responseData.success) {
          error = new Error(responseData.error || 'Error desconocido en la extracción de datos');
        }
      } catch (requestError) {
        console.error(`Error en intento ${attempts}:`, requestError);
        error = requestError;
        
        if (attempts < maxRetries) {
          console.log('Esperando antes de reintentar...');
          await new Promise(resolve => setTimeout(resolve, 2000)); // Esperar 2 segundos antes de reintentar
        }
      }
    }
    
    if (error) {
      console.error('Error final al extraer datos de GMB:', error);
      toast.error('Error en extracción de datos', {
        description: error.message || 'No se pudo extraer información del perfil',
      });
      return simulateBusinessProfileData(urlOrWebsite);
    }
    
    if (!data || !data.success) {
      console.error('Invalid response from scrape-business function:', data);
      toast.error('Error en extracción de datos', {
        description: 'No se pudo extraer información del perfil',
      });
      return simulateBusinessProfileData(urlOrWebsite);
    }
    
    console.log('Business profile data extracted:', data.data);
    
    // Validate received data
    if (!data.data.businessName && !data.data.businessAddress) {
      console.log('No significant business data received, using simulated data');
      const mockData = simulateBusinessProfileData(urlOrWebsite);
      
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
      description: error.message || 'No se pudo procesar la solicitud',
    });
    
    // En caso de error, devolver datos simulados
    return simulateBusinessProfileData(urlOrWebsite);
  }
};
