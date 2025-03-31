
import { supabase } from '@/integrations/supabase/client';
import { SharedReport, SharedReportResponse, AccessLogOptions, AccessLogType, SharedContentStatus } from '@/types/shared-content';
import { logContentAccess } from './utils';

/**
 * Check if a report exists
 */
export const checkReportExists = async (reportId: string): Promise<{ exists: boolean; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('public_reports')
      .select('id')
      .eq('shared_url', reportId)
      .maybeSingle();
    
    if (error) throw error;
    
    return { exists: !!data, error: null };
  } catch (error: any) {
    console.error('Error checking if report exists:', error);
    return { exists: false, error };
  }
};

/**
 * Check if report has password
 */
export const checkReportPassword = async (reportId: string): Promise<{ isProtected: boolean; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('public_reports')
      .select('password')
      .eq('shared_url', reportId)
      .maybeSingle();
    
    if (error) throw error;
    
    const isProtected = !!(data && data.password && data.password.trim() !== '');
    return { isProtected, error: null };
  } catch (error: any) {
    console.error('Error checking report password:', error);
    return { isProtected: false, error };
  }
};

/**
 * Verify report password
 */
export const verifyReportPassword = async (reportId: string, password: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('public_reports')
      .select('password')
      .eq('shared_url', reportId)
      .single();
    
    if (error) {
      console.error('Error fetching report password:', error);
      return false;
    }
    
    if (!data || !data.password || data.password.trim() === '') {
      return true;
    }
    
    return data.password === password;
  } catch (error) {
    console.error('Error verifying report password:', error);
    return false;
  }
};

/**
 * Log report access
 */
export const logReportAccess = (reportId: string, options: AccessLogOptions, eventType: AccessLogType = 'view') => {
  return logContentAccess('report', reportId, options, eventType);
};

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
        // Add created_at and updated_at with default values if they don't exist
        created_at: publicReportData.created_at || new Date().toISOString(),
        updated_at: publicReportData.updated_at || new Date().toISOString(),
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
