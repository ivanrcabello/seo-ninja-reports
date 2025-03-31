
import { supabase } from '@/integrations/supabase/client';
import { PublicReport } from '@/types/shared-content';
import { checkContentExists, checkContentPasswordProtection, verifyContentPassword, logContentAccess } from './utils';

/**
 * Check if a report exists
 */
export const checkReportExists = async (reportId: string): Promise<{ exists: boolean, error: Error | null }> => {
  return checkContentExists(reportId, 'report');
};

/**
 * Check if a report is password protected
 */
export const checkReportPassword = async (reportId: string): Promise<{ isProtected: boolean, error: Error | null }> => {
  return checkContentPasswordProtection(reportId, 'report');
};

/**
 * Verify a report's password
 */
export const verifyReportPassword = async (reportId: string, password: string): Promise<boolean> => {
  return verifyContentPassword(reportId, 'report', password);
};

/**
 * Log report access
 */
export const logReportAccess = (reportId: string, options: any, eventType: string = 'access') => {
  return logContentAccess(reportId, 'report', options, eventType);
};

/**
 * Fetch report from public view using the RPC function
 */
export const fetchFromPublicReportsView = async (sharedUrl: string): Promise<{ report: PublicReport | null, error: Error | null }> => {
  try {
    const { data, error } = await supabase.rpc('get_report_by_shared_url', {
      shared_url_param: sharedUrl
    });
    
    if (error) throw error;
    
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return { report: null, error: new Error('Report not found') };
    }
    
    // Handle result being an array
    const reportData = Array.isArray(data) ? data[0] : data;
    
    // Transform to expected format
    const report: PublicReport = {
      id: reportData.id,
      title: reportData.title,
      summary: reportData.summary,
      url: reportData.url,
      status: reportData.status,
      content: reportData.content,
      date: reportData.date,
      shared_url: reportData.shared_url,
      client_name: reportData.client_name,
      client_website: reportData.client_website
    };
    
    return { report, error: null };
  } catch (error: any) {
    console.error('Error fetching report from view:', error);
    return { report: null, error };
  }
};

/**
 * Fetch report using RPC directly
 */
export const fetchReportWithRpc = async (sharedUrl: string): Promise<{ report: PublicReport | null, error: Error | null }> => {
  try {
    const { data, error } = await supabase.rpc('get_report_by_shared_url', {
      shared_url_param: sharedUrl
    });
    
    if (error) throw error;
    
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return { report: null, error: new Error('Report not found') };
    }
    
    // Format report data
    const reportItem = Array.isArray(data) ? data[0] : data;
    const report: PublicReport = {
      id: reportItem.id,
      title: reportItem.title,
      summary: reportItem.summary,
      url: reportItem.url,
      status: reportItem.status,
      content: reportItem.content,
      date: reportItem.date,
      shared_url: reportItem.shared_url,
      client_name: reportItem.client_name,
      client_website: reportItem.client_website
    };
    
    return { report, error: null };
  } catch (error: any) {
    console.error('Error fetching report with RPC:', error);
    return { report: null, error };
  }
};

/**
 * Fetch report by any identifier (shared_url or id)
 */
export const fetchReportByAnyId = async (reportId: string): Promise<{ report: PublicReport | null, error: Error | null }> => {
  // Try different fetching methods
  let result = await fetchFromPublicReportsView(reportId);
  
  if (result.report) {
    logReportAccess(reportId, { successful: true, method: 'public_view' }, 'view');
    return result;
  }
  
  // Try RPC method
  result = await fetchReportWithRpc(reportId);
  
  if (result.report) {
    logReportAccess(reportId, { successful: true, method: 'rpc' }, 'view');
    return result;
  }
  
  // Try direct query as last resort
  result = await fetchReportOnly(reportId);
  
  if (result.report) {
    logReportAccess(reportId, { successful: true, method: 'direct_query' }, 'view');
    return result;
  }
  
  logReportAccess(reportId, { successful: false, error: 'Report not found' }, 'error');
  return { report: null, error: new Error('Report not found') };
};

/**
 * Fetch report with direct query
 */
export const fetchReportOnly = async (sharedUrl: string): Promise<{ report: PublicReport | null, error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('public_reports')
      .select('*')
      .eq('shared_url', sharedUrl)
      .maybeSingle();
    
    if (error) throw error;
    
    if (!data) {
      return { report: null, error: new Error('Report not found') };
    }
    
    const report: PublicReport = {
      id: data.id,
      title: data.title,
      summary: data.summary,
      url: data.url,
      status: data.status,
      content: data.content,
      date: data.date,
      shared_url: data.shared_url,
      client_name: data.client_name,
      client_website: data.client_website
    };
    
    return { report, error: null };
  } catch (error: any) {
    console.error('Error fetching report directly:', error);
    return { report: null, error };
  }
};
