
import { supabase } from '@/integrations/supabase/client';
import { SharedReport, PasswordVerificationResponse, SharedContentStatus } from '@/types/shared-content';
import { toast } from 'sonner';
import { checkContentExists, checkContentPasswordProtection, verifyContentPassword } from './utils';
import { Json } from '@/integrations/supabase/types';

/**
 * Fetches a report by any ID - either direct id or shared_url
 */
export const fetchReportByAnyId = async (reportId: string): Promise<SharedReport | null> => {
  try {
    // First try direct ID
    let { data: report, error } = await supabase
      .from('reports')
      .select('*, clients(name, website)')
      .eq('id', reportId)
      .single();
      
    // If not found, try shared_url
    if (error || !report) {
      const { data, error: sharedUrlError } = await supabase
        .from('reports')
        .select('*, clients(name, website)')
        .eq('shared_url', reportId)
        .single();
        
      if (sharedUrlError || !data) {
        throw new Error("Report not found");
      }
      
      report = data;
    }
    
    if (!report) {
      throw new Error("Report not found");
    }
    
    // Format as SharedReport
    return {
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
    };
  } catch (error: any) {
    console.error('Error fetching report:', error);
    throw error;
  }
};

/**
 * Fetches a report from the public_reports view by shared_url
 */
export const fetchFromPublicReportsView = async (sharedUrl: string): Promise<SharedReport | null> => {
  try {
    // Use the RPC function to get the public report view
    const { data, error } = await supabase
      .rpc('get_report_by_shared_url', { shared_url_param: sharedUrl });
    
    if (error) throw error;
    
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return null;
    }
    
    // Format as SharedReport
    const report = Array.isArray(data) ? data[0] : data;
    
    return {
      id: report.id,
      title: report.title,
      summary: report.summary,
      url: report.url,
      status: report.status as SharedContentStatus,
      content: report.content,
      date: report.date,
      shared_url: report.shared_url,
      client_name: report.client_name,
      client_website: report.client_website,
      created_at: report.created_at || new Date().toISOString(),
      updated_at: report.updated_at || new Date().toISOString()
    };
  } catch (error: any) {
    console.error('Error fetching public report:', error);
    throw error;
  }
};

/**
 * Fetches a report using RPC
 */
export const fetchReportWithRpc = async (reportId: string): Promise<SharedReport | null> => {
  try {
    let { data, error } = await supabase
      .rpc('get_public_report', { 
        report_id: reportId 
      });
    
    if (error) throw error;
    
    if (!data) {
      return null;
    }
    
    // Format the report
    return {
      id: data.id,
      title: data.title,
      summary: data.summary || '',
      url: data.url || '',
      status: data.status as SharedContentStatus,
      content: data.content,
      date: data.date,
      shared_url: data.shared_url,
      client_name: data.client_name || '',
      client_website: data.client_website || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  } catch (error: any) {
    console.error('Error fetching report with RPC:', error);
    throw error;
  }
};

/**
 * Fetches only the report data without client information
 */
export const fetchReportOnly = async (reportId: string): Promise<SharedReport | null> => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*, clients(name, website)')
      .eq('id', reportId)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return null;
    }
    
    return {
      id: data.id,
      title: data.title,
      summary: data.summary || '',
      url: data.url || '',
      status: data.status as SharedContentStatus,
      content: data.content,
      shared_url: data.shared_url,
      date: data.date,
      client_name: data.clients?.name || '',
      client_website: data.clients?.website || '',
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error: any) {
    console.error('Error fetching report only:', error);
    throw error;
  }
};

/**
 * Updates a report with a password
 */
export const updateReportWithPassword = async (reportId: string, password: string): Promise<PasswordVerificationResponse> => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .update({ password })
      .eq('id', reportId)
      .select()
      .single();
    
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
