
import { supabase } from '@/integrations/supabase/client';
import { PublicReport } from '@/types/shared-content';
import { logContentAccess, checkContentExists, checkContentPasswordProtection, verifyContentPassword } from './utils';

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
 * Fetch report from public_reports view
 */
export const fetchFromPublicReportsView = async (reportId: string): Promise<{ report: PublicReport | null, error: Error | null }> => {
  try {
    console.log('Fetching report from public_reports view:', reportId);
    
    const { data, error } = await supabase
      .from('public_reports')
      .select('*')
      .or(`id.eq.${reportId},shared_url.eq.${reportId}`)
      .maybeSingle();
    
    if (error) throw error;
    
    if (!data) {
      return { report: null, error: null };
    }
    
    const publicReport: PublicReport = {
      id: data.id,
      title: data.title,
      summary: data.summary,
      url: data.url,
      status: data.status as "processing" | "completed" | "failed",
      content: data.content,
      date: data.date,
      client_name: data.client_name,
      client_website: data.client_website,
      shared_url: data.shared_url
    };
    
    return { report: publicReport, error: null };
  } catch (error: any) {
    console.error('Error fetching from public_reports view:', error);
    return { report: null, error: error };
  }
};

/**
 * Fetch report using RPC
 */
export const fetchReportWithRpc = async (reportId: string): Promise<{ report: PublicReport | null, error: Error | null }> => {
  try {
    console.log('Fetching report with RPC:', reportId);
    
    // Try to fetch by shared URL first
    const { data, error } = await supabase.rpc('get_report_by_shared_url', {
      shared_url_param: reportId
    });
    
    if (error) throw error;
    
    if (!data) {
      // If not found by shared URL, try to fetch by ID using another function
      const { data: idData, error: idError } = await supabase.rpc('get_report_by_any_id', {
        id_param: reportId
      });
      
      if (idError) throw idError;
      
      if (!idData) {
        return { report: null, error: null };
      }
      
      return { 
        report: {
          ...idData,
          status: idData.status as "processing" | "completed" | "failed"
        } as PublicReport, 
        error: null 
      };
    }
    
    return { 
      report: {
        ...data,
        status: data.status as "processing" | "completed" | "failed"
      } as PublicReport, 
      error: null 
    };
  } catch (error: any) {
    console.error('Error fetching with RPC:', error);
    return { report: null, error: error };
  }
};

/**
 * Fetch report directly from reports table
 */
export const fetchReportOnly = async (reportId: string): Promise<{ report: PublicReport | null, error: Error | null }> => {
  try {
    console.log('Fetching report directly:', reportId);
    
    // Try with direct ID
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
        shared_url,
        clients (
          name,
          website
        )
      `)
      .or(`id.eq.${reportId},shared_url.eq.${reportId}`)
      .maybeSingle();
    
    if (error) throw error;
    
    if (!data) {
      return { report: null, error: null };
    }
    
    const publicReport: PublicReport = {
      id: data.id,
      title: data.title,
      summary: data.summary,
      url: data.url,
      status: data.status as "processing" | "completed" | "failed",
      content: data.content,
      date: data.date,
      client_name: data.clients?.name,
      client_website: data.clients?.website,
      shared_url: data.shared_url
    };
    
    return { report: publicReport, error: null };
  } catch (error: any) {
    console.error('Error fetching report directly:', error);
    return { report: null, error: error };
  }
};

/**
 * Main function to fetch report by ID or shared URL
 */
export const fetchReportByAnyId = async (reportId: string): Promise<{ report: PublicReport | null, error: Error | null }> => {
  try {
    // Try each method in sequence
    const methods = [
      fetchFromPublicReportsView,
      fetchReportWithRpc,
      fetchReportOnly
    ];
    
    for (const method of methods) {
      const { report, error } = await method(reportId);
      
      // If we got a report or a definitive error, return it
      if (report || (error && error.message !== 'Not found')) {
        return { report, error };
      }
    }
    
    // If we get here, all methods failed
    return { report: null, error: new Error('Report not found') };
  } catch (error: any) {
    console.error('Error in fetchReportByAnyId:', error);
    return { report: null, error };
  }
};
