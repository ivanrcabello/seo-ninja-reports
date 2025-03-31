
import { supabase } from '@/integrations/supabase/client';
import { SharedReport, SharedReportResponse, SharedContentStatus } from '@/types/shared-content';

/**
 * Fetch report by any type of ID (direct ID or shared_url)
 */
export const fetchReportByAnyId = async (reportId: string): Promise<SharedReportResponse> => {
  try {
    console.log('Fetching report with ID or shared_url:', reportId);
    
    // Try to fetch from public_reports first (by shared_url)
    const { data: publicReportData, error: publicError } = await supabase
      .from('public_reports')
      .select('*')
      .eq('shared_url', reportId)
      .maybeSingle();
    
    if (!publicError && publicReportData) {
      console.log('Found report in public_reports');
      
      const status = publicReportData.status as SharedContentStatus;
      
      const report: SharedReport = {
        id: publicReportData.id,
        title: publicReportData.title || 'Unnamed Report',
        content: publicReportData.content,
        summary: publicReportData.summary,
        url: publicReportData.url,
        status: status,
        date: publicReportData.date,
        shared_url: publicReportData.shared_url,
        created_at: new Date().toISOString(), // Add missing properties
        updated_at: new Date().toISOString(), // Add missing properties
        client_name: publicReportData.client_name,
        client_website: publicReportData.client_website
      };
      
      return { report, error: null };
    }
    
    // If not found in public_reports, try in reports
    const { data: reportData, error: reportError } = await supabase
      .from('reports')
      .select('*, clients(name, website)')
      .or(`id.eq.${reportId},shared_url.eq.${reportId}`)
      .maybeSingle();
    
    if (reportError) {
      console.error('Error fetching report from reports table:', reportError);
      throw new Error('Error fetching report data');
    }
    
    if (!reportData) {
      console.log('Report not found in either table');
      return { report: null, error: new Error('Report not found') };
    }
    
    console.log('Found report in reports table');
    
    const status = reportData.status as SharedContentStatus;
    
    // Map to the public interface
    const report: SharedReport = {
      id: reportData.id,
      title: reportData.title,
      content: reportData.content,
      summary: reportData.summary,
      url: reportData.url,
      status: status,
      date: reportData.date,
      shared_url: reportData.shared_url,
      created_at: reportData.created_at,
      updated_at: reportData.updated_at,
      client_name: reportData.clients?.name,
      client_website: reportData.clients?.website
    };
    
    return { report, error: null };
  } catch (error: any) {
    console.error('Error in fetchReportByAnyId:', error);
    return { report: null, error };
  }
};

/**
 * Update a report with a new password
 */
export const updateReportWithPassword = async (
  reportId: string, 
  password: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .update({ password })
      .eq('id', reportId);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating report password:', error);
    return false;
  }
};
