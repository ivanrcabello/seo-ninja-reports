
import { supabase } from '@/integrations/supabase/client';
import { BusinessProfile } from '@/types/report.types';

export async function saveBusinessProfile(
  reportId: string,
  profileData: Partial<BusinessProfile>
): Promise<BusinessProfile | null> {
  try {
    // First check if a business profile already exists for this report
    const { data: existingProfile, error: fetchError } = await supabase
      .from('business_profiles')
      .select('id')
      .eq('report_id', reportId)
      .maybeSingle();
      
    if (fetchError) {
      console.error('Error checking for existing business profile:', fetchError);
      throw fetchError;
    }
    
    // Prepare business hours to ensure it's a valid JSON object
    let businessHours = {};
    if (profileData.businessHours) {
      if (typeof profileData.businessHours === 'string') {
        try {
          businessHours = JSON.parse(profileData.businessHours as unknown as string);
        } catch (e) {
          console.error('Error parsing business hours:', e);
          // If we can't parse it, use an empty object
          businessHours = {};
        }
      } else {
        businessHours = profileData.businessHours;
      }
    }
    
    let result;
    
    if (existingProfile?.id) {
      // Update existing profile
      const { data, error } = await supabase
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
        .eq('id', existingProfile.id)
        .select()
        .single();
        
      if (error) {
        console.error('Error updating business profile:', error);
        throw error;
      }
      
      result = data;
    } else {
      // Create new profile
      const { data, error } = await supabase
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
        })
        .select()
        .single();
        
      if (error) {
        console.error('Error creating business profile:', error);
        throw error;
      }
      
      result = data;
    }
    
    // Format the result to match the BusinessProfile interface
    return result ? {
      id: result.id,
      reportId: result.report_id,
      businessName: result.business_name,
      businessAddress: result.business_address,
      businessPhone: result.business_phone,
      businessCategory: result.business_category,
      businessRating: result.business_rating,
      businessReviewsCount: result.business_reviews_count,
      businessWebsite: result.business_website,
      businessUrl: result.business_url,
      businessHours: result.business_hours,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    } : null;
    
  } catch (error) {
    console.error('Error saving business profile:', error);
    throw error;
  }
}
