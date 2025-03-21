
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
    
    // Obtener la API key desde localStorage (si está disponible)
    const localApiKey = localStorage.getItem('value_serp_api_key');
    
    // Mostrar información sobre la clave API
    if (localApiKey) {
      console.log('API key available from localStorage (length): ' + localApiKey.length);
    } else {
      console.log('No API key found in localStorage');
      
      // Intentar obtener la API key desde la base de datos
      const { data: settingsData } = await supabase
        .from('settings')
        .select('value_serp_key')
        .eq('id', 1)
        .single();
        
      if (settingsData?.value_serp_key) {
        console.log('API key retrieved from database');
        localStorage.setItem('value_serp_api_key', settingsData.value_serp_key);
      }
    }
    
    // Obtener nuevamente la API key (podría haberse actualizado)
    const apiKeyToUse = localStorage.getItem('value_serp_api_key');
    
    // Llamar a la función edge con la query y la API key
    const { data, error } = await supabase.functions.invoke('valueserp-business', {
      body: { 
        query,
        apiKey: apiKeyToUse || null
      }
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
    
    if (!data.success) {
      console.error('ValueSerp function reported failure:', data.error);
      toast.warning(data.error || 'Error al extraer información de negocio', {
        description: 'Se utilizarán datos simulados para la demostración'
      });
      return data.data; // Return the fallback data provided by the edge function
    }
    
    // Check if we received valid data (not from fallback)
    const isRealData = data.data && 
                      data.data.businessName && 
                      data.data.businessName !== 'Negocio de ejemplo';
    
    if (isRealData) {
      console.log('Business profile data extracted successfully:', data.data);
      toast.success('Información de negocio extraída correctamente');
      return data.data;
    } else {
      console.warn('Using fallback data for business profile');
      toast.warning('No se encontraron datos reales', {
        description: 'Se utilizarán datos simulados para la demostración'
      });
      
      // Return the fallback data that was already created by the edge function
      return data.data;
    }
  } catch (error) {
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
