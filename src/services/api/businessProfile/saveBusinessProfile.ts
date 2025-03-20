
import { supabase } from '@/integrations/supabase/client';
import { BusinessProfile } from '@/types/report.types';
import { toast } from 'sonner';
import { handleServiceError } from '../baseService';

/**
 * Guarda o actualiza el perfil de negocio para un informe
 */
export const saveBusinessProfile = async (
  reportId: string,
  businessProfile: Omit<BusinessProfile, 'id' | 'reportId' | 'createdAt' | 'updatedAt'>
): Promise<BusinessProfile | null> => {
  try {
    if (!businessProfile) {
      console.log('No hay perfil de negocio para guardar');
      return null;
    }
    
    console.log('Guardando perfil de negocio:', businessProfile, 'para informe:', reportId);
    
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
      business_hours: businessProfile.businessHours ? JSON.stringify(businessProfile.businessHours) : null,
      updated_at: new Date().toISOString()
    };
    
    console.log('Datos formateados para BD:', dbData);
    
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
        
      if (insertError) {
        console.error('Error al insertar perfil de negocio:', insertError);
        throw insertError;
      }
      
      result = newProfile;
      
      // Actualizar el flag en reports
      await supabase
        .from('reports')
        .update({ has_business_profile: true })
        .eq('id', reportId);
        
      console.log('Nuevo perfil de negocio creado:', result);
    }
    
    // Transformar el resultado a formato de frontend
    const businessHours = result.business_hours ? 
      (typeof result.business_hours === 'string' ? 
        JSON.parse(result.business_hours) : 
        result.business_hours) : 
      {};
      
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
      businessHours: businessHours as Record<string, string>,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    };
    
  } catch (error: any) {
    console.error('Error al guardar perfil de negocio:', error);
    return handleServiceError(error, 'Error al guardar perfil de negocio');
  }
};
