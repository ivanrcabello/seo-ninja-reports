
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
    // Si es una URL de sitio web, intentamos buscar el perfil GMB asociado
    if (!isGmbUrl) {
      console.log('Extracting GMB data from website URL:', urlOrWebsite);
      toast.info('Buscando perfil de Google Business', {
        description: 'Intentando localizar datos para este negocio',
      });
      
      // Aquí en un futuro podríamos implementar una función que busque
      // perfiles GMB basados en el dominio del sitio web
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
        
        if (!responseData.success) {
          throw new Error(responseData.error || 'Error desconocido en la extracción de datos');
        }
        
        console.log('Business profile data extracted:', responseData.data);
        
        // Validate received data
        if (!responseData.data.businessName && !responseData.data.businessAddress) {
          throw new Error('No se pudo extraer información esencial del negocio');
        }
        
        toast.success('Información extraída correctamente', {
          description: 'Se ha obtenido información del perfil de negocio',
        });
        
        return responseData.data as Partial<BusinessProfile>;
        
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
    
    // Devolver datos simulados como último recurso
    return simulateBusinessProfileData(urlOrWebsite);
    
  } catch (error: any) {
    console.error('Error extracting business information:', error);
    toast.error('Error al extraer información', {
      description: error.message || 'No se pudo procesar la solicitud',
    });
    
    // En caso de error, devolver datos simulados
    return simulateBusinessProfileData(urlOrWebsite);
  }
};
