
import { supabase } from '@/integrations/supabase/client';
import { BusinessProfile } from '@/types/report.types';
import { handleServiceError } from '../baseService';

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
    let businessHours: Record<string, string> = {};
    if (data.business_hours) {
      try {
        if (typeof data.business_hours === 'string') {
          businessHours = JSON.parse(data.business_hours);
        } else if (typeof data.business_hours === 'object') {
          businessHours = data.business_hours as Record<string, string>;
        }
      } catch (parseError) {
        console.error('Error parsing business hours:', parseError);
        // Continue with empty business hours
      }
    }
      
    return {
      id: data.id,
      reportId: data.report_id,
      businessUrl: data.business_url,
      businessName: data.business_name || '',
      businessAddress: data.business_address || '',
      businessPhone: data.business_phone || '',
      businessCategory: data.business_category || '',
      businessRating: data.business_rating !== undefined ? data.business_rating : null,
      businessReviewsCount: data.business_reviews_count || 0,
      businessWebsite: data.business_website || '',
      businessHours,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
    
  } catch (error: any) {
    console.error('Error al obtener perfil de negocio:', error);
    return handleServiceError(error, 'Error al obtener perfil de negocio');
  }
};
