
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
    
    // Llamar a nuestra función edge para hacer scraping del perfil
    const { data, error } = await supabase.functions.invoke('scrape-business', {
      body: { url: businessUrl }
    });
    
    if (error) {
      console.error('Error al invocar función de scraping:', error);
      toast.error('Error en extracción de datos', {
        description: error.message || 'No se pudo extraer información del perfil',
      });
      return null;
    }
    
    if (!data || !data.success) {
      console.error('La función de scraping no devolvió datos válidos:', data);
      toast.error('Error en extracción de datos', {
        description: 'No se pudo extraer información del perfil',
      });
      return null;
    }
    
    console.log('Datos extraídos del perfil:', data.data);
    
    toast.success('Información extraída correctamente', {
      description: 'Se ha obtenido información del perfil de negocio',
    });
    
    return data.data as Partial<BusinessProfile>;
    
  } catch (error: any) {
    console.error('Error al extraer información de negocio:', error);
    toast.error('Error al extraer información', {
      description: error.message || 'No se pudo procesar la URL proporcionada',
    });
    return null;
  }
};
