
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
 * Check if a report exists by ID
 */
export const checkReportExists = async (reportId: string) => {
  try {
    const { data, error } = await supabase
      .rpc('check_report_exists', { report_id_param: reportId });
    
    return { exists: Boolean(data), error };
  } catch (err) {
    console.error('Error checking if report exists:', err);
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
 * Fetch from public_reports view
 */
export const fetchFromPublicReportsView = async (reportId: string) => {
  try {
    const { data, error } = await supabase
      .from('public_reports')
      .select('*')
      .or(`id.eq.${reportId},shared_url.eq.${reportId}`)
      .maybeSingle();
    
    return { report: data as PublicReport, error };
  } catch (err) {
    console.error('Error fetching from public_reports view:', err);
    return { report: null, error: err };
  }
};

/**
 * Fetch report with RPC
 */
export const fetchReportWithRpc = async (reportId: string) => {
  try {
    const { data, error } = await supabase
      .rpc('get_report_by_any_id', { id_param: reportId });
    
    return { report: data as PublicReport, error };
  } catch (err) {
    console.error('Error fetching report with RPC:', err);
    return { report: null, error: err };
  }
};

/**
 * Fetch report with join query
 */
export const fetchReportWithJoin = async (reportId: string) => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select(`
        id, 
        title, 
        summary,
        url,
        status,
        content,
        date,
        clients (
          name,
          website
        )
      `)
      .or(`id.eq.${reportId},shared_url.eq.${reportId}`)
      .maybeSingle();
    
    if (data) {
      const report: PublicReport = {
        id: data.id,
        title: data.title,
        summary: data.summary,
        url: data.url,
        status: data.status,
        content: data.content,
        date: data.date,
        client_name: data.clients?.name,
        client_website: data.clients?.website
      };
      
      return { report, error };
    }
    
    return { report: null, error };
  } catch (err) {
    console.error('Error fetching report with join query:', err);
    return { report: null, error: err };
  }
};

/**
 * Fetch report only
 */
export const fetchReportOnly = async (reportId: string) => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .or(`id.eq.${reportId},shared_url.eq.${reportId}`)
      .maybeSingle();
    
    if (data) {
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
    }
    
    return { report: null, error };
  } catch (err) {
    console.error('Error fetching report only:', err);
    return { report: null, error: err };
  }
};
