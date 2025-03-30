
import { PublicReportData, RpcResponseCheckReportExists, RpcResponseGetPublicReportById } from '@/types/supabase-rpc.types';
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

export interface AccessLogOptions {
  successful: boolean;
  passwordAttempt?: boolean;
  error?: string;
  source?: string;
}

/**
 * Check if report exists using RPC
 */
export async function checkReportExists(reportId: string): Promise<{ exists: boolean; error?: any }> {
  console.log('Checking if report exists via RPC:', reportId);
  
  try {
    const { data, error } = await supabase
      .rpc<RpcResponseCheckReportExists>('check_report_exists', { report_id_param: reportId });
    
    // Parse the response correctly
    const reportCheck: RpcResponseCheckReportExists = 
      typeof data === 'boolean' ? { exists: data } : 
      (data && typeof data === 'object' && 'exists' in data) ? data as RpcResponseCheckReportExists : 
      { exists: false };
    
    console.log('Report exists check:', { exists: reportCheck.exists, error });
    
    if (error) {
      console.error('Error checking if report exists (RPC):', error);
      return { exists: false, error };
    }
    
    return { exists: reportCheck.exists };
  } catch (err) {
    console.error('Exception in checkReportExists:', err);
    return { exists: false, error: err };
  }
}

/**
 * Check if report is password protected
 */
export async function checkReportPassword(reportId: string): Promise<{ isProtected: boolean; error?: any }> {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('id, password')
      .eq('id', reportId)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking report password:', error);
      return { isProtected: false, error };
    }
    
    const isProtected = Boolean(data && data.password);
    return { isProtected };
  } catch (err) {
    console.error('Exception in checkReportPassword:', err);
    return { isProtected: false, error: err };
  }
}

/**
 * Fetch report from public_reports view
 */
export async function fetchFromPublicReportsView(reportId: string): Promise<{ report?: PublicReport; error?: any }> {
  console.log('Fetching from public_reports view...');
  try {
    const { data, error } = await supabase
      .from('public_reports')
      .select('*')
      .eq('id', reportId)
      .maybeSingle();
    
    console.log('Public reports view result:', { 
      data: data ? 'Data exists' : 'No data', 
      error 
    });
    
    if (error || !data) {
      return { error };
    }
    
    console.log('Successfully fetched from public_reports view');
    return { report: data as unknown as PublicReport };
  } catch (err) {
    console.error('Exception in fetchFromPublicReportsView:', err);
    return { error: err };
  }
}

/**
 * Fetch report using RPC
 */
export async function fetchReportWithRpc(reportId: string): Promise<{ report?: PublicReport; error?: any }> {
  console.log('Using get_public_report_by_id RPC...');
  try {
    const { data: rpcData, error } = await supabase
      .rpc<RpcResponseGetPublicReportById[]>('get_public_report_by_id', { report_id_param: reportId });
    
    // Process RPC data correctly
    let rpcReportData: RpcResponseGetPublicReportById[] = [];
    if (rpcData) {
      if (Array.isArray(rpcData)) {
        rpcReportData = rpcData as RpcResponseGetPublicReportById[];
      } else if (typeof rpcData === 'object') {
        rpcReportData = [rpcData as unknown as RpcResponseGetPublicReportById];
      }
    }
    
    console.log('RPC result:', { 
      data: rpcReportData && rpcReportData.length > 0 ? 'Data exists' : 'No data', 
      error 
    });
    
    if (error || !rpcReportData || rpcReportData.length === 0) {
      return { error: error || new Error('No data returned from RPC') };
    }
    
    console.log('Successfully fetched via RPC');
    const reportToSet: PublicReport = {
      id: rpcReportData[0].id,
      title: rpcReportData[0].title || 'Informe sin título',
      summary: rpcReportData[0].summary || undefined,
      url: rpcReportData[0].url || undefined,
      status: rpcReportData[0].status || 'unknown',
      content: rpcReportData[0].content,
      date: rpcReportData[0].date || undefined,
      client_name: rpcReportData[0].client_name || undefined,
      client_website: rpcReportData[0].client_website || undefined,
    };
    
    return { report: reportToSet };
  } catch (err) {
    console.error('Exception in fetchReportWithRpc:', err);
    return { error: err };
  }
}

/**
 * Fetch report using direct join query
 */
export async function fetchReportWithJoin(reportId: string): Promise<{ report?: PublicReport; error?: any }> {
  console.log('Using direct join query...');
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
      .eq('id', reportId)
      .maybeSingle();
    
    console.log('Join query result:', { 
      data: data ? 'Data exists' : 'No data', 
      error 
    });
    
    if (error || !data) {
      return { error };
    }
    
    console.log('Successfully fetched with join query');
    
    // Format the data to match PublicReport interface
    const formattedReport: PublicReport = {
      id: data.id,
      title: data.title || 'Informe sin título',
      summary: data.summary,
      url: data.url,
      status: data.status,
      content: data.content,
      date: data.date,
      client_name: data.clients?.name,
      client_website: data.clients?.website
    };
    
    return { report: formattedReport };
  } catch (err) {
    console.error('Exception in fetchReportWithJoin:', err);
    return { error: err };
  }
}

/**
 * Fetch report using reports table only
 */
export async function fetchReportOnly(reportId: string): Promise<{ report?: PublicReport; error?: any }> {
  console.log('Fetching report only (no joins)...');
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .maybeSingle();
    
    console.log('Report only query result:', { 
      data: data ? 'Data exists' : 'No data', 
      error 
    });
    
    if (error || !data) {
      return { error };
    }
    
    console.log('Successfully fetched report only');
    
    const formattedReport: PublicReport = {
      id: data.id,
      title: data.title || 'Informe sin título',
      summary: data.summary,
      url: data.url,
      status: data.status,
      content: data.content,
      date: data.date
    };
    
    return { report: formattedReport };
  } catch (err) {
    console.error('Exception in fetchReportOnly:', err);
    return { error: err };
  }
}

/**
 * Verify report password
 */
export async function verifyReportPassword(reportId: string, password: string): Promise<{ success: boolean; error?: any }> {
  try {
    console.log(`Verifying password for report: ${reportId}`);
    const { data, error } = await supabase
      .rpc<boolean>('verify_shared_report_password', { 
        report_id_param: reportId,
        password_param: password
      });
    
    if (error) {
      console.error('Error in verify_shared_report_password RPC:', error);
      return { success: false, error };
    }
    
    const success = Boolean(data);
    console.log(`Password verification result: ${success}`);
    return { success };
  } catch (error) {
    console.error('Error verifying password:', error);
    return { success: false, error };
  }
}
