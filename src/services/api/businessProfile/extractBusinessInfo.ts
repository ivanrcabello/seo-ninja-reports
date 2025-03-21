
import { supabase } from '@/integrations/supabase/client';
import { BusinessProfile } from '@/types/report.types';
import { toast } from 'sonner';
import { simulateBusinessProfileData } from './mocks';
import { extractGmbData } from './extractGmbData';

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
    
    console.log('Attempting to extract business info from URL:', businessUrl);
    
    // Mostrar toast de progreso
    toast.info('Analizando perfil de negocio', {
      description: 'Extrayendo información del perfil de Google Business',
    });
    
    // Intentar obtener datos reales a través de la función de extracción
    const profileData = await extractGmbData(businessUrl, true);
    
    // Verificar si se obtuvieron datos significativos y si son reales (no simulados)
    if (profileData && 
        (profileData.businessName || profileData.businessAddress) && 
        profileData.businessName !== 'Negocio de ejemplo') {
      
      console.log('Successfully extracted business profile data:', profileData);
      
      // Verificar si el perfil tiene datos completos o parciales
      const isPartialData = !profileData.businessRating || !profileData.businessPhone || !profileData.businessWebsite;
      
      if (isPartialData) {
        toast.warning('Datos incompletos', {
          description: 'Se obtuvieron algunos datos del perfil, pero no está completo'
        });
      } else {
        toast.success('Información extraída correctamente', {
          description: 'Se ha obtenido información completa del perfil de negocio',
        });
      }
      
      return profileData;
    }
    
    // Si llegamos aquí, no se obtuvieron datos significativos o son simulados
    console.warn('No significant business data extracted, using simulation');
    
    // En caso de fallo, devolver datos simulados pero con una nota clara
    const simulatedData = simulateBusinessProfileData(businessUrl);
    toast.warning('Se están usando datos simulados', {
      description: 'No se pudieron extraer datos reales del perfil, se muestran datos de ejemplo'
    });
    
    return simulatedData;
    
  } catch (error: any) {
    console.error('Error extracting business information:', error);
    toast.error('Error al extraer información', {
      description: error.message || 'No se pudo procesar la URL proporcionada',
    });
    
    // En caso de error, devolver null en lugar de datos simulados
    // para que los componentes puedan gestionarlo adecuadamente
    return null;
  }
};
