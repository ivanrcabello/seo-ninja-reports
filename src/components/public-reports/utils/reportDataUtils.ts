
import { supabase } from '@/integrations/supabase/client';

export interface PublicReport {
  id: string;
  title: string;
  summary?: string;
  url?: string;
  status: string;
  content?: any;
  date?: string;
  client_name?: string;
  client_website?: string;
}

/**
 * Check if a report exists by ID - with improved error handling
 */
export const checkReportExists = async (reportId: string) => {
  try {
    console.log('Checking if report exists:', reportId);
    
    // Try using the RPC function first
    const { data, error } = await supabase
      .rpc('check_report_exists', { report_id_param: reportId });
    
    if (error) {
      console.error('Error with RPC check_report_exists:', error);
      
      // Fallback to direct query if RPC fails
      const { data: directData, error: directError } = await supabase
        .from('reports')
        .select('id')
        .or(`id.eq.${reportId},shared_url.eq.${reportId}`)
        .maybeSingle();
      
      if (directError) {
        console.error('Error with direct query fallback:', directError);
        return { exists: false, error: directError };
      }
      
      return { exists: !!directData, error: null };
    }
    
    return { exists: Boolean(data), error };
  } catch (err) {
    console.error('Exception checking if report exists:', err);
    return { exists: false, error: err };
  }
};

/**
 * Check if a report is password protected
 */
export const checkReportPassword = async (reportId: string) => {
  try {
    const { data, error } = await supabase
      .rpc('check_report_password_protection', { report_id_param: reportId });
    
    return { isProtected: Boolean(data), error };
  } catch (err) {
    console.error('Error checking report password protection:', err);
    return { isProtected: false, error: err };
  }
};

/**
 * Verify report password
 */
export const verifyReportPassword = async (reportId: string, password: string) => {
  try {
    const { data, error } = await supabase
      .rpc('verify_shared_report_password', { 
        report_id_param: reportId, 
        password_param: password 
      });
    
    return { success: Boolean(data), error };
  } catch (err) {
    console.error('Error verifying report password:', err);
    return { success: false, error: err };
  }
};

/**
 * Fetch report with RPC - the main method to use
 */
export const fetchReportWithRpc = async (reportId: string) => {
  try {
    console.log('Fetching report with RPC:', reportId);
    const { data, error } = await supabase
      .rpc('get_report_by_any_id', { id_param: reportId });
    
    if (error) {
      console.error('Error fetching report with RPC:', error);
      return { report: null, error };
    }
    
    if (!data) {
      console.error('No data returned from RPC for report:', reportId);
      return { report: null, error: new Error('No data returned') };
    }
    
    console.log('RPC returned report data:', data);
    return { report: data as PublicReport, error };
  } catch (err) {
    console.error('Exception fetching report with RPC:', err);
    return { report: null, error: err };
  }
};

/**
 * Fetch from public_reports view - fallback method
 */
export const fetchFromPublicReportsView = async (reportId: string) => {
  try {
    console.log('Fetching from public_reports view:', reportId);
    const { data, error } = await supabase
      .from('public_reports')
      .select('*')
      .or(`id.eq.${reportId},shared_url.eq.${reportId}`)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching from public_reports view:', error);
    } else if (data) {
      console.log('Found report in public_reports view');
    } else {
      console.log('No report found in public_reports view');
    }
    
    return { report: data as PublicReport, error };
  } catch (err) {
    console.error('Exception fetching from public_reports view:', err);
    return { report: null, error: err };
  }
};

/**
 * Fetch report only - last resort direct table query
 */
export const fetchReportOnly = async (reportId: string) => {
  try {
    console.log('Fetching report directly from reports table:', reportId);
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .or(`id.eq.${reportId},shared_url.eq.${reportId}`)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching report only:', error);
      return { report: null, error };
    }
    
    if (!data) {
      console.error('No report found with direct query:', reportId);
      return { report: null, error: new Error('Report not found') };
    }
    
    console.log('Found report with direct query:', data.id);
    
    const report: PublicReport = {
      id: data.id,
      title: data.title || 'Sin título',
      summary: data.summary,
      url: data.url,
      status: data.status,
      content: data.content,
      date: data.date
    };
    
    return { report, error };
  } catch (err) {
    console.error('Exception fetching report only:', err);
    return { report: null, error: err };
  }
};
