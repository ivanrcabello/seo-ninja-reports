
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
    
    // Intentar obtener datos reales a través de la función de extracción
    const profileData = await extractGmbData(businessUrl, true);
    
    // Verificar si se obtuvieron datos significativos
    if (profileData && (profileData.businessName || profileData.businessAddress)) {
      console.log('Successfully extracted business profile data:', profileData);
      return profileData;
    }
    
    // Si llegamos aquí, no se obtuvieron datos significativos
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
    
    // En caso de error, devolver datos simulados
    toast.warning('Se muestran datos simulados', {
      description: 'Debido al error, se están mostrando datos de ejemplo'
    });
    return simulateBusinessProfileData(businessUrl);
  }
};
