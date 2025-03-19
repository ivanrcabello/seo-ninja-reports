
import { supabase } from '@/integrations/supabase/client';
import { BusinessProfile } from '@/types/report.types';
import { toast } from 'sonner';
import { handleServiceError } from './baseService';

/**
 * Guarda o actualiza el perfil de negocio para un informe
 */
export const saveBusinessProfile = async (
  reportId: string,
  businessProfile: Omit<BusinessProfile, 'id' | 'reportId' | 'createdAt' | 'updatedAt'>
): Promise<BusinessProfile | null> => {
  try {
    // Verificar si ya existe un perfil para este informe
    const { data: existingProfile, error: checkError } = await supabase
      .from('business_profiles')
      .select('id')
      .eq('report_id', reportId)
      .single();
      
    if (checkError && checkError.code !== 'PGRST116') {
      // Error distinto a "no se encontró registro"
      throw checkError;
    }
    
    let result;
    
    // Transformar el objeto a formato de base de datos
    const dbData = {
      report_id: reportId,
      business_url: businessProfile.businessUrl,
      business_name: businessProfile.businessName,
      business_address: businessProfile.businessAddress,
      business_phone: businessProfile.businessPhone,
      business_category: businessProfile.businessCategory,
      business_rating: businessProfile.businessRating,
      business_reviews_count: businessProfile.businessReviewsCount,
      business_website: businessProfile.businessWebsite,
      business_hours: businessProfile.businessHours,
      updated_at: new Date().toISOString()
    };
    
    // Si existe, actualizar
    if (existingProfile) {
      const { data: updatedProfile, error: updateError } = await supabase
        .from('business_profiles')
        .update(dbData)
        .eq('id', existingProfile.id)
        .select('*')
        .single();
        
      if (updateError) throw updateError;
      result = updatedProfile;
      
      console.log('Perfil de negocio actualizado:', result);
    } else {
      // Si no existe, insertar
      const { data: newProfile, error: insertError } = await supabase
        .from('business_profiles')
        .insert(dbData)
        .select('*')
        .single();
        
      if (insertError) throw insertError;
      result = newProfile;
      
      // Actualizar el flag en reports
      await supabase
        .from('reports')
        .update({ has_business_profile: true })
        .eq('id', reportId);
        
      console.log('Nuevo perfil de negocio creado:', result);
    }
    
    // Transformar el resultado a formato de frontend
    return {
      id: result.id,
      reportId: result.report_id,
      businessUrl: result.business_url,
      businessName: result.business_name,
      businessAddress: result.business_address,
      businessPhone: result.business_phone,
      businessCategory: result.business_category,
      businessRating: result.business_rating,
      businessReviewsCount: result.business_reviews_count,
      businessWebsite: result.business_website,
      businessHours: result.business_hours,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    };
    
  } catch (error: any) {
    console.error('Error al guardar perfil de negocio:', error);
    return handleServiceError(error, 'Error al guardar perfil de negocio');
  }
};

/**
 * Obtiene el perfil de negocio para un informe
 */
export const getBusinessProfile = async (reportId: string): Promise<BusinessProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('business_profiles')
      .select('*')
      .eq('report_id', reportId)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        // No se encontró perfil, lo cual es normal
        return null;
      }
      throw error;
    }
    
    if (!data) return null;
    
    // Transformar el resultado a formato de frontend
    return {
      id: data.id,
      reportId: data.report_id,
      businessUrl: data.business_url,
      businessName: data.business_name,
      businessAddress: data.business_address,
      businessPhone: data.business_phone,
      businessCategory: data.business_category,
      businessRating: data.business_rating,
      businessReviewsCount: data.business_reviews_count,
      businessWebsite: data.business_website,
      businessHours: data.business_hours,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
    
  } catch (error: any) {
    console.error('Error al obtener perfil de negocio:', error);
    return handleServiceError(error, 'Error al obtener perfil de negocio');
  }
};

/**
 * Extrae información de una URL de Google Business
 * Nota: Este es un ejemplo simplificado. Para una implementación completa,
 * se necesitaría una API externa o un scraper más sofisticado.
 */
export const extractBusinessInfo = async (
  businessUrl: string
): Promise<Partial<BusinessProfile> | null> => {
  try {
    // En una implementación real, aquí se usaría una API o scraping
    // Para este ejemplo, mostraremos un mensaje de que se necesitaría
    // integrar con una API externa
    
    toast.info('Extracción de datos', {
      description: 'Para extraer datos reales se necesitaría integrar con una API externa de Google o un servicio de scraping',
    });
    
    // Devolvemos un resultado simulado para demostración
    // En un caso real, estos datos vendrían de la API o el scraping
    return {
      businessUrl,
      businessName: 'Negocio de ejemplo',
      businessAddress: 'Calle Ejemplo 123, Ciudad',
      businessPhone: '+34 123 456 789',
      businessCategory: 'Servicios Profesionales',
      businessRating: 4.7,
      businessReviewsCount: 42,
      businessWebsite: 'https://www.ejemplo.com',
      businessHours: {
        'Monday': '9:00 - 18:00',
        'Tuesday': '9:00 - 18:00',
        'Wednesday': '9:00 - 18:00',
        'Thursday': '9:00 - 18:00',
        'Friday': '9:00 - 17:00',
        'Saturday': 'Cerrado',
        'Sunday': 'Cerrado'
      }
    };
    
  } catch (error: any) {
    console.error('Error al extraer información de negocio:', error);
    toast.error('Error al extraer información', {
      description: error.message || 'No se pudo procesar la URL proporcionada',
    });
    return null;
  }
};
