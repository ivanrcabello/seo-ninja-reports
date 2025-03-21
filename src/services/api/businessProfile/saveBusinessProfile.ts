
import { supabase } from '@/integrations/supabase/client';
import { BusinessProfile } from '@/types/report.types';
import { toast } from 'sonner';

export async function saveBusinessProfile(
  reportId: string,
  profileData: Partial<BusinessProfile>
): Promise<BusinessProfile | null> {
  console.log('Saving business profile for report:', reportId, profileData);
  
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
      console.log('Updating existing business profile with ID:', existingProfile.id);
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
      console.log('Business profile updated successfully:', result);
    } else {
      console.log('Creating new business profile for report:', reportId);
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
      console.log('New business profile created successfully:', result);
    }

    // Update the report to indicate it has a business profile
    try {
      const { error: updateError } = await supabase
        .from('reports')
        .update({ 
          has_business_profile: true,
          updated_at: new Date().toISOString() 
        })
        .eq('id', reportId);
        
      if (updateError) {
        console.error('Error updating has_business_profile flag:', updateError);
      } else {
        console.log('Report has_business_profile flag updated successfully');
      }
    } catch (err) {
      console.error('Exception updating has_business_profile flag:', err);
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
    toast.error('Error al guardar el perfil de negocio', {
      description: 'No se pudo guardar en la base de datos'
    });
    throw error;
  }
}
