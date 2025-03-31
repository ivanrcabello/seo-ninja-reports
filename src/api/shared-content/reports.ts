
import { supabase } from '@/integrations/supabase/client';
import { SharedReport, SharedContentStatus } from '@/types/shared-content';
import { logContentAccess } from './utils';

/**
 * Fetch report by any ID (shared_url, id)
 */
export const fetchReportByAnyId = async (reportId: string): Promise<{ report: SharedReport | null, error: Error | null }> => {
  try {
    console.log('Fetching report with ID:', reportId);
    
    // Try fetching from public_reports view first
    const { data: viewData, error: viewError } = await fetchFromPublicReportsView(reportId);
    
    if (!viewError && viewData) {
      return { report: viewData, error: null };
    }
    
    // If that fails, try the RPC function
    const { data: rpcData, error: rpcError } = await fetchReportWithRpc(reportId);
    
    if (!rpcError && rpcData) {
      return { report: rpcData, error: null };
    }
    
    // If both fail, try direct table access
    const { data: directData, error: directError } = await fetchReportOnly(reportId);
    
    if (!directError && directData) {
      return { report: directData, error: null };
    }
    
    console.error('Could not fetch report with any method:');
    console.error('View error:', viewError);
    console.error('RPC error:', rpcError);
    console.error('Direct error:', directError);
    
    return { report: null, error: new Error('No se pudo encontrar el reporte solicitado') };
  } catch (error: any) {
    console.error('Error in fetchReportByAnyId:', error);
    return { report: null, error };
  }
};

/**
 * Fetch report from public_reports view
 */
export const fetchFromPublicReportsView = async (reportId: string): Promise<{ data: SharedReport | null, error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('public_reports')
      .select('*')
      .or(`id.eq.${reportId},shared_url.eq.${reportId}`)
      .single();
      
    if (error) throw error;
    
    if (!data) return { data: null, error: null };
    
    // Ensure the return type conforms to SharedReport interface
    const report: SharedReport = {
      id: data.id,
      title: data.title,
      summary: data.summary,
      url: data.url,
      status: data.status as SharedContentStatus,
      content: data.content,
      date: data.date,
      shared_url: data.shared_url,
      client_name: data.client_name,
      client_website: data.client_website,
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString()
    };
    
    // Log access
    logContentAccess(reportId, 'report', { successful: true }, 'view');
    
    return { data: report, error: null };
  } catch (error: any) {
    console.error('Error fetching from public_reports view:', error);
    return { data: null, error };
  }
};

/**
 * Fetch report using RPC function
 */
export const fetchReportWithRpc = async (reportId: string): Promise<{ data: SharedReport | null, error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .rpc('get_report_by_any_id', { id_param: reportId });
      
    if (error) throw error;
    
    if (!data) return { data: null, error: null };
    
    // Ensure the return type conforms to SharedReport interface
    const report: SharedReport = {
      id: data.id,
      title: data.title,
      summary: data.summary,
      url: data.url,
      status: data.status as SharedContentStatus,
      content: data.content,
      date: data.date,
      shared_url: data.shared_url,
      client_name: data.client_name,
      client_website: data.client_website,
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString()
    };
    
    // Log access
    logContentAccess(reportId, 'report', { successful: true }, 'view');
    
    return { data: report, error: null };
  } catch (error: any) {
    console.error('Error fetching with RPC function:', error);
    return { data: null, error };
  }
};

/**
 * Fetch report directly from reports table
 */
export const fetchReportOnly = async (reportId: string): Promise<{ data: SharedReport | null, error: Error | null }> => {
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
        shared_url,
        created_at,
        updated_at,
        clients (name, website)
      `)
      .or(`id.eq.${reportId},shared_url.eq.${reportId}`)
      .single();
      
    if (error) throw error;
    
    if (!data) return { data: null, error: null };
    
    // Ensure the return type conforms to SharedReport interface
    const report: SharedReport = {
      id: data.id,
      title: data.title || 'Informe sin título',
      summary: data.summary,
      url: data.url,
      status: data.status as SharedContentStatus,
      content: data.content,
      date: data.date,
      shared_url: data.shared_url,
      client_name: data.clients?.name,
      client_website: data.clients?.website,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    
    // Log access
    logContentAccess(reportId, 'report', { successful: true }, 'view');
    
    return { data: report, error: null };
  } catch (error: any) {
    console.error('Error fetching from reports table:', error);
    return { data: null, error };
  }
};

/**
 * Update report with password
 */
export const updateReportWithPassword = async (reportId: string, password: string): Promise<{ success: boolean, error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .update({ password })
      .eq('id', reportId);
      
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Error updating report password:', error);
    return { success: false, error };
  }
};
