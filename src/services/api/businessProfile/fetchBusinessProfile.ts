
import { supabase } from '@/integrations/supabase/client';
import { BusinessProfile } from '@/types/report.types';
import { handleServiceError } from '../baseService';

/**
 * Fetches the business profile for a specific report
 */
export const fetchBusinessProfile = async (reportId: string): Promise<BusinessProfile | null> => {
  try {
    if (!reportId) {
      throw new Error('reportId is required');
    }

    console.log(`Fetching business profile for report: ${reportId}`);
    
    const { data, error } = await supabase
      .from('business_profiles')
      .select('*')
      .eq('report_id', reportId)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching business profile:', error);
      throw error;
    }
    
    if (!data) {
      console.log('No business profile found for report:', reportId);
      return null;
    }
    
    console.log('Business profile found:', data);
    
    // Parse business hours
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
        // Continue with empty hours if there's a problem
      }
    }
      
    // Transform to frontend format
    return {
      id: data.id,
      reportId: data.report_id,
      businessName: data.business_name,
      businessAddress: data.business_address,
      businessPhone: data.business_phone,
      businessCategory: data.business_category,
      businessRating: data.business_rating,
      businessReviewsCount: data.business_reviews_count,
      businessWebsite: data.business_website,
      businessUrl: data.business_url,
      businessHours,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error: any) {
    return handleServiceError(error, 'Error fetching business profile');
  }
};
