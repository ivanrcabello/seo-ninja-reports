
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
      .maybeSingle();  // Using maybeSingle instead of single to prevent errors
      
    if (checkError) {
      console.error('Error checking existing profile:', checkError);
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
    
    console.log('Formatted data for database:', dbData);
    
    try {
      // Si existe, actualizar
      if (existingProfile) {
        console.log(`Updating existing business profile with ID: ${existingProfile.id}`);
        const { data: updatedProfile, error: updateError } = await supabase
          .from('business_profiles')
          .update(dbData)
          .eq('id', existingProfile.id)
          .select('*')
          .single();
          
        if (updateError) {
          console.error('Error updating business profile:', updateError);
          throw updateError;
        }
        
        result = updatedProfile;
        console.log('Business profile updated:', result);
      } else {
        // Si no existe, insertar
        console.log('Creating new business profile');
        const { data: newProfile, error: insertError } = await supabase
          .from('business_profiles')
          .insert(dbData)
          .select('*')
          .single();
          
        if (insertError) {
          console.error('Error inserting business profile:', insertError);
          throw insertError;
        }
        
        result = newProfile;
        
        // Actualizar el flag en reports
        const { error: reportUpdateError } = await supabase
          .from('reports')
          .update({ has_business_profile: true })
          .eq('id', reportId);
          
        if (reportUpdateError) {
          console.error('Error updating report has_business_profile flag:', reportUpdateError);
          // Continue anyway since the profile was created successfully
        }
        
        console.log('New business profile created:', result);
      }
    } catch (dbError) {
      console.error('Database error while saving business profile:', dbError);
      toast.error('Error al guardar el perfil de negocio', {
        description: 'Ha ocurrido un error en la base de datos'
      });
      throw dbError;
    }
    
    // Transformar el resultado a formato de frontend
    if (!result) {
      throw new Error('No result returned from database operation');
    }
    
    let businessHours = {};
    if (result.business_hours) {
      try {
        businessHours = typeof result.business_hours === 'string' 
          ? JSON.parse(result.business_hours) 
          : result.business_hours;
      } catch (parseError) {
        console.error('Error parsing business hours:', parseError);
        // Continue with empty business hours
      }
    }
      
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
    console.error('Error saving business profile:', error);
    return handleServiceError(error, 'Error al guardar perfil de negocio');
  }
};
