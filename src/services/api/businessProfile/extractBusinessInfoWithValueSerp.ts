
import { supabase } from '@/integrations/supabase/client';
import { BusinessProfile } from '@/types/report.types';
import { toast } from 'sonner';
import { simulateBusinessProfileData } from './mocks';

/**
 * Extrae información de negocio utilizando ValueSerp API a través de un edge function
 */
export const extractBusinessInfoWithValueSerp = async (
  query: string
): Promise<Partial<BusinessProfile> | null> => {
  if (!query) {
    toast.error('Debe proporcionar un término de búsqueda');
    return null;
  }
  
  try {
    console.log(`Calling ValueSerp edge function with query: ${query}`);
    toast.info('Extrayendo información de negocio', {
      description: 'Buscando datos con ValueSerp...'
    });
    
    // Obtener la API key desde localStorage o settings
    let valueSerpApiKey = localStorage.getItem('value_serp_api_key');
    
    // Si no hay API key en localStorage, intentar obtenerla de la base de datos
    if (!valueSerpApiKey) {
      console.log('No API key found in localStorage, trying to fetch from database');
      
      try {
        const { data: settingsData, error } = await supabase
          .from('settings')
          .select('value_serp_key')
          .eq('id', 1)
          .maybeSingle();
          
        if (error) {
          console.error('Error retrieving ValueSerp API key from database:', error);
        } else if (settingsData?.value_serp_key) {
          valueSerpApiKey = settingsData.value_serp_key;
          localStorage.setItem('value_serp_api_key', valueSerpApiKey);
          console.log('API key retrieved from database and stored in localStorage');
        }
      } catch (error) {
        console.error('Exception retrieving ValueSerp API key:', error);
      }
    } else {
      console.log('Using API key from localStorage (length):', valueSerpApiKey.length);
    }
    
    // Definir parámetros para la solicitud
    const requestParams = {
      query: query,
      apiKey: valueSerpApiKey || null
    };
    
    console.log('ValueSerp edge function request params:', {
      query: requestParams.query,
      hasApiKey: !!requestParams.apiKey
    });
    
    // Intentar hasta 2 veces en caso de error
    const maxAttempts = 2;
    let attempt = 0;
    let lastError = null;
    
    while (attempt < maxAttempts) {
      attempt++;
      console.log(`ValueSerp attempt ${attempt} of ${maxAttempts}`);
      
      try {
        const { data, error } = await supabase.functions.invoke('valueserp-business', {
          body: requestParams
        });
        
        if (error) {
          console.error('Error invoking ValueSerp edge function:', error);
          throw new Error(`Error en la función ValueSerp: ${error.message}`);
        }
        
        if (!data) {
          console.error('No data received from ValueSerp edge function');
          throw new Error('No se recibieron datos de la función ValueSerp');
        }
        
        console.log('Raw response from valueserp-business:', data);
        
        // Si hay datos pero no es exitoso, mostrar advertencia y devolver los datos fallback
        if (!data.success) {
          console.warn('ValueSerp function reported failure:', data.error);
          toast.warning(data.error || 'Error al extraer información de negocio', {
            description: 'Se utilizarán datos simulados para la demostración'
          });
          return data.data; // Return the fallback data provided by the edge function
        }
        
        // Verificar si los datos parecen reales
        const isRealData = data.data && 
                        data.data.businessName && 
                        data.data.businessName !== 'Negocio de ejemplo';
        
        if (isRealData) {
          console.log('Business profile data extracted successfully:', data.data);
          
          const sourceText = data.source === 'knowledge_graph' 
            ? 'Knowledge Graph' 
            : data.source === 'local_results' 
              ? 'Local Results' 
              : 'Organic Results';
              
          toast.success('Información de negocio extraída correctamente', {
            description: `Datos obtenidos desde ${sourceText}`
          });
          
          return data.data;
        } else {
          console.warn('Received fallback data from edge function');
          toast.warning('No se encontraron datos reales', {
            description: 'Se utilizarán datos simulados para la demostración'
          });
          
          // Return the fallback data
          return data.data;
        }
      } catch (error) {
        console.error(`Error in ValueSerp attempt ${attempt}:`, error);
        lastError = error;
        
        if (attempt < maxAttempts) {
          console.log('Waiting before retry...');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }
    
    // Si llegamos aquí, todos los intentos fallaron
    console.error('All ValueSerp attempts failed. Last error:', lastError);
    toast.error('Error al extraer información', {
      description: lastError?.message || 'No se pudo procesar la solicitud'
    });
    
    // Fallback to simulated data
    const mockData = simulateBusinessProfileData(query);
    
    toast.warning('Se están usando datos simulados', {
      description: 'Ha ocurrido un error durante la extracción'
    });
    
    return mockData;
  } catch (error: any) {
    console.error('Error extracting business info with ValueSerp:', error);
    toast.error('Error al extraer información', {
      description: error.message || 'No se pudo procesar la solicitud'
    });
    
    // Fallback to simulated data
    const mockData = simulateBusinessProfileData(query);
    
    toast.warning('Se están usando datos simulados', {
      description: 'Ha ocurrido un error durante la extracción'
    });
    
    return mockData;
  }
};
