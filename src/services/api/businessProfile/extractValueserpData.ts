
import { supabase } from '@/integrations/supabase/client';
import { BusinessProfile } from '@/types/report.types';
import { toast } from 'sonner';
import { simulateBusinessProfileData } from './mocks';

/**
 * Extrae información de negocio utilizando ValueSerp API
 */
export const extractValueserpData = async (
  query: string, 
  location: string = ''
): Promise<Partial<BusinessProfile> | null> => {
  if (!query) {
    toast.error('Debe proporcionar un término de búsqueda');
    return null;
  }
  
  try {
    console.log(`Intento de extraer información con ValueSerp: ${query} ${location ? `(${location})` : ''}`);
    toast.info('Extrayendo información de negocio', {
      description: 'Buscando datos con ValueSerp...'
    });
    
    // Obtener la API key desde localStorage
    const valueSerpApiKey = localStorage.getItem('value_serp_api_key');
    
    if (!valueSerpApiKey) {
      console.log('No se encontró una API key de ValueSerp en localStorage');
      toast.error('API key de ValueSerp no configurada', {
        description: 'Configura la API key en Ajustes > Integraciones'
      });
      return simulateBusinessProfileData(query);
    }
    
    // Crear query con ubicación si está disponible
    const searchQuery = location && location.trim() !== '' 
      ? `${query} ${location}` 
      : query;
    
    // Llamar a la función de Edge de ValueSerp
    console.log(`Llamando a ValueSerp con búsqueda: "${searchQuery}"`);
    
    const { data, error } = await supabase.functions.invoke('valueserp-business', {
      body: {
        query: searchQuery,
        apiKey: valueSerpApiKey
      }
    });
    
    if (error) {
      console.error('Error al invocar la función de ValueSerp:', error);
      throw new Error(`Error en la función ValueSerp: ${error.message}`);
    }
    
    if (!data) {
      console.error('No se recibieron datos de la función ValueSerp');
      throw new Error('No se recibieron datos de la función ValueSerp');
    }
    
    console.log('Respuesta de valueserp-business:', data);
    
    // Store raw data in localStorage for debugging
    if (data.raw_data || data.raw_response) {
      try {
        localStorage.setItem('valueserp_last_raw_data', JSON.stringify(data.raw_data || data.raw_response));
        console.log('Raw ValueSerp data stored in localStorage for debugging');
      } catch (e) {
        console.warn('Could not store raw data in localStorage:', e);
      }
    }
    
    // Si hay datos pero no es exitoso, mostrar advertencia y devolver los datos fallback
    if (!data.success) {
      console.warn('La función ValueSerp reportó un fallo:', data.error);
      toast.warning(data.error || 'Error al extraer información de negocio', {
        description: 'Se utilizarán datos simulados para la demostración'
      });
      return data.data; // Devolver los datos fallback proporcionados por la edge function
    }
    
    // Verificar si los datos parecen reales
    const isRealData = data.data && 
                     data.data.businessName && 
                     data.data.businessName !== 'Negocio de ejemplo';
    
    if (isRealData) {
      console.log('Business profile data extracted via ValueSerp:', data.data);
      
      const sourceText = data.source === 'knowledge_graph' 
        ? 'Knowledge Graph' 
        : data.source === 'local_results' 
          ? 'Local Results' 
          : 'Organic Results';
          
      toast.success('Información de negocio extraída correctamente', {
        description: `Datos obtenidos desde ${sourceText}`
      });
      
      // Save this query and result in localStorage cache
      try {
        const cacheKey = `valueserp_cache_${query.toLowerCase().replace(/\s+/g, '_')}`;
        localStorage.setItem(cacheKey, JSON.stringify({
          data: data.data,
          timestamp: Date.now(),
          source: data.source
        }));
      } catch (e) {
        console.warn('Could not cache results:', e);
      }
      
      return data.data;
    } else {
      console.warn('Se recibieron datos de fallback de la edge function');
      toast.warning('No se encontraron datos reales', {
        description: 'Se utilizarán datos simulados para la demostración'
      });
      
      // Devolver los datos de fallback
      return data.data;
    }
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
