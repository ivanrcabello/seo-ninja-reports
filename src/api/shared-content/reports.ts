
import { supabase } from '@/integrations/supabase/client';
import { SharedReport, SharedReportResponse, PasswordVerificationResponse, SharedContentStatus } from '@/types/shared-content';
import { toast } from 'sonner';
import { checkContentExists, checkContentPasswordProtection, verifyContentPassword, logContentAccess } from './utils';

export const checkReportExists = async (reportId: string): Promise<{ exists: boolean; error?: Error }> => {
  return checkContentExists('report', reportId);
};

export const checkReportPassword = async (reportId: string): Promise<{ isProtected: boolean; error?: Error }> => {
  return checkContentPasswordProtection('report', reportId);
};

export const verifyReportPassword = async (reportId: string, password: string): Promise<boolean> => {
  // Log attempt to verify password
  logContentAccess('report', reportId, { passwordAttempt: true, successful: false }, 'password');
  
  const isValid = await verifyContentPassword('report', reportId, password);
  
  if (isValid) {
    // Log successful password verification
    logContentAccess('report', reportId, { passwordAttempt: true, successful: true }, 'password');
  }
  
  return isValid;
};

/**
 * Fetches a report by any ID - either direct id or shared_url
 */
export const fetchReportByAnyId = async (reportId: string): Promise<SharedReportResponse> => {
  try {
    console.log('Fetching report by ID or shared_url:', reportId);
    
    // First try direct ID
    let { data: report, error } = await supabase
      .from('reports')
      .select('*, clients(name, website)')
      .eq('id', reportId)
      .single();
      
    // If not found, try shared_url
    if (error || !report) {
      console.log('Report not found by direct ID, trying shared_url');
      const { data, error: sharedUrlError } = await supabase
        .from('reports')
        .select('*, clients(name, website)')
        .eq('shared_url', reportId)
        .single();
        
      if (sharedUrlError || !data) {
        console.log('Report not found in reports table, checking public_reports view');
        // As a last try, check if it exists in public_reports table
        const { data: publicReport, error: publicError } = await supabase
          .from('public_reports')
          .select('*')
          .eq('shared_url', reportId)
          .single();
          
        if (publicError || !publicReport) {
          console.error('Report not found in any table:', publicError);
          throw new Error("Report not found");
        }
        
        console.log('Found report in public_reports view:', publicReport);
        
        // Format as SharedReport
        return {
          report: {
            id: publicReport.id,
            title: publicReport.title,
            summary: publicReport.summary,
            url: publicReport.url,
            status: publicReport.status as SharedContentStatus,
            content: publicReport.content,
            date: publicReport.date,
            shared_url: publicReport.shared_url,
            client_name: publicReport.client_name,
            client_website: publicReport.client_website,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          error: null
        };
      }
      
      report = data;
    }
    
    if (!report) {
      throw new Error("Report not found");
    }
    
    console.log('Successfully found report:', report.id);
    
    // Format as SharedReport
    return {
      report: {
        id: report.id,
        title: report.title,
        summary: report.summary,
        url: report.url,
        status: report.status as SharedContentStatus,
        content: report.content,
        date: report.date,
        shared_url: report.shared_url,
        client_name: report.clients?.name,
        client_website: report.clients?.website,
        created_at: report.created_at || new Date().toISOString(),
        updated_at: report.updated_at || new Date().toISOString()
      },
      error: null
    };
  } catch (error: any) {
    console.error('Error fetching report:', error);
    return {
      report: null,
      error: new Error(error.message || "Unknown error fetching report")
    };
  }
};

/**
 * Updates a report with a password
 */
export const updateReportWithPassword = async (reportId: string, password: string | null): Promise<PasswordVerificationResponse> => {
  try {
    const { error } = await supabase
      .from('reports')
      .update({ password })
      .eq('id', reportId);
    
    if (error) throw error;
    
    return {
      success: true,
      message: 'Password updated successfully'
    };
  } catch (error: any) {
    console.error('Error updating report with password:', error);
    toast.error('Error updating report with password');
    return {
      success: false,
      message: error.message || 'Error updating report with password'
    };
  }
};

/**
 * Log access to a shared report
 */
export const logReportAccess = (
  reportId: string, 
  options: { successful: boolean; error?: string; passwordAttempt?: boolean; source?: string } = { successful: true },
  accessType: AccessLogType = 'view'
): void => {
  logContentAccess('report', reportId, options, accessType);
};
