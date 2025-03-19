
import { supabase } from '@/integrations/supabase/client';
import { BusinessProfile } from '@/types/report.types';
import { toast } from 'sonner';
import { isValidGoogleBusinessUrl } from './utils';
import { simulateBusinessProfileData } from './mocks';

/**
 * Extrae información de una URL de Google Business
 */
export const extractBusinessInfo = async (
  businessUrl: string
): Promise<Partial<BusinessProfile> | null> => {
  try {
    const apiKey = localStorage.getItem('google_business_api_key');
    
    // Verificar si la URL es válida
    if (!businessUrl || !isValidGoogleBusinessUrl(businessUrl)) {
      toast.error('URL no válida', {
        description: 'La URL debe ser un enlace válido a Google Maps o Google Business',
      });
      return null;
    }
    
    // Si hay una API key configurada, intentaríamos usar la API oficial de Google Business
    // Sin embargo, ya que esto requiere configuración avanzada, usaremos el servicio de scraping
    if (apiKey && apiKey.length > 10) {
      console.log('API key configurada, pero usando servicio de scraping por ahora');
      toast.info('Usando API configurada', {
        description: 'Extrayendo información del perfil de negocio',
      });
    }
    
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
