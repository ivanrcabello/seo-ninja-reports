
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
    
    const { data, error } = await supabase.functions.invoke('valueserp-business', {
      body: { query }
    });
    
    if (error) {
      console.error('Error invoking ValueSerp edge function:', error);
      throw new Error(`Error en la función ValueSerp: ${error.message}`);
    }
    
    if (!data) {
      throw new Error('No se recibieron datos de la función ValueSerp');
    }
    
    if (!data.success) {
      throw new Error(data.error || 'Error al extraer información de negocio');
    }
    
    // Store data in database for future reference
    if (data.data && data.data.businessName) {
      try {
        // Format business hours for storage
        const formattedHours = data.data.businessHours ? JSON.stringify(data.data.businessHours) : '{}';
        
        // Note: We're not storing the data directly in the business_profiles table
        // as it requires a report_id which might not be available at this point
        console.log('Business profile data extracted successfully:', data.data);
      } catch (dbError) {
        console.error('Error accessing database:', dbError);
      }
    }
    
    toast.success('Información de negocio extraída correctamente');
    return data.data;
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
