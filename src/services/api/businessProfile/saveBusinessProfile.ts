
import { supabase } from '@/integrations/supabase/client';
import { BusinessProfile } from '@/types/report.types';
import { toast } from 'sonner';

/**
 * Saves a business profile for a report
 */
export const saveBusinessProfile = async (reportId: string, profileData: Partial<BusinessProfile>): Promise<void> => {
  try {
    // First, update the report to mark it as having a business profile
    const { error: reportUpdateError } = await supabase
      .from('reports')
      .update({ 
        has_business_profile: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', reportId);
      
    if (reportUpdateError) {
      console.error('Error updating report has_business_profile flag:', reportUpdateError);
      // Continue anyway to try saving the profile
    }
    
    // Check if a business profile already exists for this report
    const { data: existingProfile, error: fetchError } = await supabase
      .from('business_profiles')
      .select('id')
      .eq('report_id', reportId)
      .maybeSingle();
      
    if (fetchError && fetchError.code !== 'PGRST116') {  // Ignore not found error
      console.error('Error checking for existing business profile:', fetchError);
      throw fetchError;
    }
    
    // Prepare business hours to ensure it's a valid JSON object
    let businessHours = {};
    if (profileData.businessHours) {
      if (typeof profileData.businessHours === 'string') {
        try {
          businessHours = JSON.parse(profileData.businessHours as string);
        } catch (e) {
          console.error('Error parsing business hours:', e);
        }
      } else {
        businessHours = profileData.businessHours;
      }
    }
    
    if (existingProfile?.id) {
      // Update existing profile
      const { error: updateError } = await supabase
        .from('business_profiles')
        .update({
          business_name: profileData.businessName || '',
          business_address: profileData.businessAddress || '',
          business_phone: profileData.businessPhone || '',
          business_category: profileData.businessCategory || '',
          business_rating: profileData.businessRating || null,
          business_reviews_count: profileData.businessReviewsCount || 0,
          business_website: profileData.businessWebsite || '',
          business_url: profileData.businessUrl || '',
          business_hours: businessHours,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingProfile.id);
        
      if (updateError) {
        console.error('Error updating business profile:', updateError);
        throw updateError;
      }
    } else {
      // Create new profile
      const { error: insertError } = await supabase
        .from('business_profiles')
        .insert({
          report_id: reportId,
          business_name: profileData.businessName || '',
          business_address: profileData.businessAddress || '',
          business_phone: profileData.businessPhone || '',
          business_category: profileData.businessCategory || '',
          business_rating: profileData.businessRating || null,
          business_reviews_count: profileData.businessReviewsCount || 0,
          business_website: profileData.businessWebsite || '',
          business_url: profileData.businessUrl || '',
          business_hours: businessHours,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
      if (insertError) {
        console.error('Error creating business profile:', insertError);
        throw insertError;
      }
    }
    
    // Also update report content to include business profile
    const { data: reportData, error: getReportError } = await supabase
      .from('reports')
      .select('content')
      .eq('id', reportId)
      .maybeSingle();
      
    if (getReportError) {
      console.error('Error getting report content:', getReportError);
      // This is not critical, we can continue
    } else if (reportData && reportData.content) {
      // Ensure content is an object
      let content = reportData.content;
      
      if (typeof content !== 'object') {
        try {
          content = JSON.parse(String(content));
        } catch (e) {
          content = {};
        }
      }
      
      // Add business profile to content
      const typedContent = content as any;
      typedContent.businessProfile = profileData;
      
      // Update report with business profile in content
      const { error: updateContentError } = await supabase
        .from('reports')
        .update({ 
          content: typedContent,
          updated_at: new Date().toISOString() 
        })
        .eq('id', reportId);
        
      if (updateContentError) {
        console.error('Error updating report content with business profile:', updateContentError);
        // Not critical, continue
      }
    }
    
    console.log('Business profile saved successfully');
  } catch (error: any) {
    console.error('Error saving business profile:', error);
    toast.error('Error al guardar perfil de negocio', {
      description: error.message || 'Ha ocurrido un error al guardar el perfil'
    });
    throw error;
  }
};
