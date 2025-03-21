
import { supabase } from '@/integrations/supabase/client';
import { Report, BusinessProfile } from '@/types/report.types';
import { toast } from 'sonner';
import { generateSeoReport, retryFailedReport, checkAndFixStuckReports } from './api/reportGenerationService';

/**
 * Fetches all reports for the current user
 */
export const fetchReports = async (): Promise<Report[]> => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select(`
        id, 
        client_id,
        title,
        date,
        status,
        url,
        summary,
        content,
        custom_prompt,
        notes,
        has_business_profile
      `)
      .order('date', { ascending: false });

    if (error) {
      toast.error('Error al cargar informes', {
        description: error.message,
      });
      throw error;
    }

    return data.map(report => ({
      id: report.id,
      clientId: report.client_id,
      title: report.title,
      date: report.date,
      status: report.status as 'processing' | 'completed' | 'failed',
      url: report.url,
      summary: report.summary,
      content: report.content ? (report.content as unknown as Report['content']) : undefined,
      customPrompt: report.custom_prompt,
      notes: report.notes,
      hasBusinessProfile: report.has_business_profile
    }));
  } catch (error: any) {
    console.error('Error fetching reports:', error);
    return [];
  }
};

/**
 * Creates a new report
 */
export const createNewReport = async (data: Omit<Report, 'id' | 'date' | 'status'>): Promise<Report> => {
  try {
    // Convert content to a JSON-compatible structure
    const contentForDb = data.content ? JSON.parse(JSON.stringify(data.content)) : null;
    
    const { data: reportData, error } = await supabase
      .from('reports')
      .insert({
        client_id: data.clientId,
        title: data.title,
        url: data.url,
        summary: data.summary || '',
        content: contentForDb,
        custom_prompt: data.customPrompt || '',
        notes: data.notes || '',
        status: 'completed'
      })
      .select()
      .single();

    if (error) {
      toast.error('Error al crear informe', {
        description: error.message,
      });
      throw error;
    }

    return {
      id: reportData.id,
      clientId: reportData.client_id,
      title: reportData.title,
      date: reportData.date,
      status: reportData.status as 'processing' | 'completed' | 'failed',
      url: reportData.url,
      summary: reportData.summary,
      content: reportData.content ? (reportData.content as unknown as Report['content']) : undefined,
      customPrompt: reportData.custom_prompt,
      notes: reportData.notes
    };
  } catch (error: any) {
    console.error('Error creating report:', error);
    throw error;
  }
};

/**
 * Updates an existing report
 */
export const updateExistingReport = async (id: string, data: Partial<Report>): Promise<Report> => {
  try {
    // Create an object with only the fields we need to update
    const updateData: any = {};
    
    if (data.title !== undefined) updateData.title = data.title;
    if (data.url !== undefined) updateData.url = data.url;
    if (data.summary !== undefined) updateData.summary = data.summary;
    if (data.content !== undefined) {
      // Convert content to a JSON-compatible structure
      updateData.content = JSON.parse(JSON.stringify(data.content));
    }
    if (data.status !== undefined) updateData.status = data.status;
    if (data.customPrompt !== undefined) updateData.custom_prompt = data.customPrompt;
    if (data.notes !== undefined) updateData.notes = data.notes;
    
    // Add updated_at timestamp
    updateData.updated_at = new Date().toISOString();
    
    const { data: reportData, error } = await supabase
      .from('reports')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      toast.error('Error al actualizar informe', {
        description: error.message,
      });
      throw error;
    }

    return {
      id: reportData.id,
      clientId: reportData.client_id,
      title: reportData.title,
      date: reportData.date,
      status: reportData.status as 'processing' | 'completed' | 'failed',
      url: reportData.url,
      summary: reportData.summary,
      content: reportData.content ? (reportData.content as unknown as Report['content']) : undefined,
      customPrompt: reportData.custom_prompt,
      notes: reportData.notes,
      hasBusinessProfile: reportData.has_business_profile
    };
  } catch (error: any) {
    console.error('Error updating report:', error);
    throw error;
  }
};

/**
 * Deletes a report by ID
 */
export const deleteReportById = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Error al eliminar informe', {
        description: error.message,
      });
      throw error;
    }

    toast.success('Informe eliminado correctamente');
  } catch (error: any) {
    console.error('Error deleting report:', error);
    throw error;
  }
};

/**
 * Generates an SEO report with OpenAI
 */
export {
  generateSeoReport,
  retryFailedReport,
  checkAndFixStuckReports
};

/**
 * Re-export the fetchPageSpeedData function from the pagespeed module
 */
export { fetchPageSpeedData } from './api/pagespeed/fetchPageSpeedData';

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
