
import { BusinessProfile } from '@/types/report.types';
import { toast } from 'sonner';
import { simulateBusinessProfileData } from './mocks';
import { supabase } from '@/integrations/supabase/client';

/**
 * Extrae información de negocio usando la API de ValueSerp
 */
export const extractValueserpData = async (
  businessName: string,
  businessLocation?: string
): Promise<Partial<BusinessProfile> | null> => {
  try {
    if (!businessName) {
      toast.error('Debes proporcionar un nombre de negocio para buscar');
      return null;
    }
    
    // Mostrar toast de progreso
    toast.info('Consultando API de ValueSerp', {
      description: 'Extrayendo información detallada del negocio...',
    });
    
    let searchQuery = businessName;
    if (businessLocation) {
      searchQuery += ` ${businessLocation}`;
    }
    
    console.log('Calling ValueSerp edge function with query:', searchQuery);
    
    // Obtener la API key desde la configuración
    const { data: settingsData, error: settingsError } = await supabase
      .from('settings')
      .select('value_serp_key')
      .eq('id', 1)
      .maybeSingle();
    
    if (settingsError) {
      console.error('Error obteniendo la clave API de ValueSerp:', settingsError);
    }
    
    const hasValueSerpKey = settingsData?.value_serp_key && settingsData.value_serp_key.length > 5;
    
    if (!hasValueSerpKey) {
      console.warn('No se ha configurado una clave API válida de ValueSerp');
      toast.warning('API ValueSerp no configurada', {
        description: 'Configure la API en la sección de configuración para obtener mejores resultados',
      });
    }
    
    // Intentos máximos para obtener datos
    const maxRetries = 2;
    let attempts = 0;
    let error = null;
    
    // Intentar hasta tener éxito o agotar intentos
    while (attempts < maxRetries) {
      attempts++;
      console.log(`Intento ${attempts} de extraer información con ValueSerp`);
      
      try {
        // Llamar a nuestra función edge usando supabase.functions.invoke
        const { data, error: fnError } = await supabase.functions.invoke('valueserp-business', {
          body: { 
            query: searchQuery, 
            use_configured_key: true 
          }
        });
        
        if (fnError) {
          console.error(`Error invoking ValueSerp edge function: ${fnError.message}`);
          throw new Error(`Error en la función ValueSerp: ${fnError.message}`);
        }
        
        if (!data) {
          console.error('ValueSerp edge function returned no data');
          throw new Error('La función ValueSerp no devolvió datos');
        }
        
        if (!data.success) {
          console.error('ValueSerp edge function reported failure:', data.error);
          throw new Error(data.error || 'Error desconocido en la extracción de datos');
        }
        
        console.log('Business profile data extracted via ValueSerp:', data.data);
        
        // Validar los datos recibidos
        if (!data.data.businessName && !data.data.businessAddress) {
          throw new Error('No se pudo extraer información esencial del negocio');
        }
        
        // Asegurar que businessHours es un objeto adecuado
        if (!data.data.businessHours) {
          data.data.businessHours = {};
        } else if (typeof data.data.businessHours === 'string') {
          try {
            data.data.businessHours = JSON.parse(data.data.businessHours) as Record<string, string>;
          } catch (e) {
            console.error('Error parsing business hours:', e);
            data.data.businessHours = {};
          }
        }
        
        // Asegurar que businessRating es un número o null
        if (data.data.businessRating === undefined) {
          data.data.businessRating = null;
        }
        
        toast.success('Información extraída correctamente', {
          description: 'Datos obtenidos mediante ValueSerp',
        });
        
        return data.data as Partial<BusinessProfile>;
        
      } catch (requestError: any) {
        console.error(`Error en intento ${attempts}:`, requestError);
        error = requestError;
        
        if (attempts < maxRetries) {
          console.log('Esperando antes de reintentar...');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }
    
    // Si llegamos aquí, todos los intentos fallaron
    console.error('Error final al extraer datos con ValueSerp:', error);
    toast.error('Error en extracción de datos', {
      description: error?.message || 'No se pudo extraer información del perfil',
    });
    
    // Devolver datos simulados para que la interfaz tenga algo que mostrar
    const mockData = simulateBusinessProfileData(`${businessName} ${businessLocation || ''}`);
    
    toast.warning('Se están usando datos simulados', {
      description: 'No se pudieron extraer datos reales del perfil',
    });
    
    return mockData;
    
  } catch (error: any) {
    console.error('Error extracting business information with ValueSerp:', error);
    toast.error('Error al extraer información', {
      description: error.message || 'No se pudo procesar la solicitud',
    });
    
    // Devolver datos simulados para evitar una pantalla en blanco
    const mockData = simulateBusinessProfileData(`${businessName}`);
    
    toast.warning('Se están usando datos simulados', {
      description: 'Ha ocurrido un error durante la extracción',
    });
    
    return mockData;
  }
};
