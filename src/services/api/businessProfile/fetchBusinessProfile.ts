
import { supabase } from '@/integrations/supabase/client';
import { BusinessProfile } from '@/types/report.types';
import { toast } from 'sonner';
import { handleServiceError } from '../baseService';

/**
 * Obtiene el perfil de negocio para un informe específico
 */
export const fetchBusinessProfile = async (reportId: string): Promise<BusinessProfile | null> => {
  try {
    console.log(`Fetching business profile for report: ${reportId}`);
    
    const { data: businessProfileData, error } = await supabase
      .from('business_profiles')
      .select('*')
      .eq('report_id', reportId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching business profile:', error);
      return null;
    }

    if (!businessProfileData) {
      console.log('No business profile found for this report');
      return null;
    }

    console.log('Loaded business profile data:', businessProfileData);

    // Transform database record to frontend BusinessProfile object
    let businessHours: Record<string, string> = {};
    if (businessProfileData.business_hours) {
      try {
        if (typeof businessProfileData.business_hours === 'string') {
          businessHours = JSON.parse(businessProfileData.business_hours);
        } else if (typeof businessProfileData.business_hours === 'object') {
          businessHours = businessProfileData.business_hours;
        }
      } catch (parseError) {
        console.error('Error parsing business hours:', parseError);
      }
    }

    return {
      id: businessProfileData.id,
      reportId: businessProfileData.report_id,
      businessUrl: businessProfileData.business_url,
      businessName: businessProfileData.business_name,
      businessAddress: businessProfileData.business_address,
      businessPhone: businessProfileData.business_phone,
      businessCategory: businessProfileData.business_category,
      businessRating: businessProfileData.business_rating,
      businessReviewsCount: businessProfileData.business_reviews_count,
      businessWebsite: businessProfileData.business_website,
      businessHours,
      createdAt: businessProfileData.created_at,
      updatedAt: businessProfileData.updated_at
    };
  } catch (error: any) {
    console.error('Error retrieving business profile:', error);
    return handleServiceError(error, 'Error al obtener perfil de negocio');
  }
};
