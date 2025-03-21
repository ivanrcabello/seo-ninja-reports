
import { supabase } from '@/integrations/supabase/client';
import { BusinessProfile } from '@/types/report.types';

/**
 * Guarda el perfil de negocio en la base de datos
 */
export const saveBusinessProfile = async (
  reportId: string,
  profile: Partial<BusinessProfile>
): Promise<boolean> => {
  try {
    if (!reportId) {
      console.error('No report ID provided for saving business profile');
      return false;
    }

    // Format hours if necessary
    let formattedHours = profile.businessHours;
    if (typeof formattedHours !== 'string' && formattedHours !== null) {
      formattedHours = JSON.stringify(formattedHours);
    }

    // First check if the profile already exists for this report
    const { data: existingProfile, error: checkError } = await supabase
      .from('business_profiles')
      .select('*')
      .eq('report_id', reportId)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing profile:', checkError);
      return false;
    }

    // Either update or insert depending on whether the profile exists
    if (existingProfile) {
      const { error: updateError } = await supabase
        .from('business_profiles')
        .update({
          business_name: profile.businessName,
          business_address: profile.businessAddress,
          business_category: profile.businessCategory,
          business_rating: profile.businessRating,
          business_reviews_count: profile.businessReviewsCount,
          business_phone: profile.businessPhone,
          business_website: profile.businessWebsite,
          business_hours: formattedHours,
          business_url: profile.businessUrl,
          updated_at: new Date().toISOString()
        })
        .eq('report_id', reportId);

      if (updateError) {
        console.error('Error updating business profile:', updateError);
        return false;
      }
    } else {
      const { error: insertError } = await supabase
        .from('business_profiles')
        .insert({
          report_id: reportId,
          business_name: profile.businessName,
          business_address: profile.businessAddress,
          business_category: profile.businessCategory,
          business_rating: profile.businessRating,
          business_reviews_count: profile.businessReviewsCount,
          business_phone: profile.businessPhone,
          business_website: profile.businessWebsite,
          business_hours: formattedHours,
          business_url: profile.businessUrl
        });

      if (insertError) {
        console.error('Error inserting business profile:', insertError);
        return false;
      }
    }

    console.log('Business profile saved successfully for report', reportId);
    return true;
  } catch (error) {
    console.error('Error saving business profile:', error);
    return false;
  }
};
