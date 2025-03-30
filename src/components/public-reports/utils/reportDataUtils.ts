
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';

export interface PublicReport {
  id: string;
  title: string;
  summary: string;
  url: string;
  status: string;
  content: any;
  date: string;
  client_name: string;
  client_website: string;
  shared_url?: string;
  password?: string;
}

// Simplified response types to avoid deep recursion
export interface ReportCheckResult {
  exists: boolean;
  error: string | null;
}

export interface ReportPasswordCheck {
  isProtected: boolean;
  error: string | null;
}

export interface ReportFetchResult {
  report: PublicReport | null;
  error: string | null;
}

export interface PasswordVerifyResult {
  success: boolean;
  error: string | null;
}

export interface AccessLogOptions {
  successful: boolean;
  passwordAttempt?: boolean;
  error?: string;
  action?: string;
}

// Check if a report exists and is accessible
export async function checkReportExists(reportId: string): Promise<ReportCheckResult> {
  try {
    // First try using the shared_url field
    const { data: reportBySharedUrl, error: sharedUrlError } = await supabase
      .from('reports')
      .select('id')
      .eq('shared_url', reportId)
      .maybeSingle();

    if (reportBySharedUrl) {
      return { exists: true, error: null };
    }

    // If no report found by shared_url, try direct id
    // Use explicit typing to avoid deep recursion
    type RpcResponse = { exists: boolean } | boolean | null;
    
    const { data, error } = await supabase
      .rpc<RpcResponse>('check_report_exists', { report_id_param: reportId });
      
    if (error) {
      console.error('Error checking report existence:', error);
      return { exists: false, error: error.message };
    }
    
    // Handle different possible response formats
    const exists = typeof data === 'boolean' ? data : 
                  (data && typeof data === 'object' && 'exists' in data) ? (data as {exists: boolean}).exists : 
                  false;
    
    return { exists, error: null };
  } catch (error: any) {
    console.error('Error in checkReportExists:', error);
    return { exists: false, error: error.message };
  }
}

// Check if a report is password-protected
export async function checkReportPassword(reportId: string): Promise<ReportPasswordCheck> {
  try {
    // First try using shared_url
    const { data: reportBySharedUrl, error: sharedUrlError } = await supabase
      .from('reports')
      .select('id, password')
      .eq('shared_url', reportId)
      .maybeSingle();

    if (reportBySharedUrl) {
      return { 
        isProtected: !!reportBySharedUrl.password, 
        error: null 
      };
    }

    // If not found by shared_url, try direct id
    interface ReportWithPassword {
      password: string | null;
    }
    
    const { data, error } = await supabase
      .from('reports')
      .select('password')
      .eq('id', reportId)
      .single();
    
    if (error) {
      console.error('Error checking report password:', error);
      return { isProtected: false, error: error.message };
    }
    
    return { isProtected: !!data.password, error: null };
  } catch (error: any) {
    console.error('Error in checkReportPassword:', error);
    return { isProtected: false, error: error.message };
  }
}

// Try to get report from public_reports view
export async function fetchFromPublicReportsView(reportId: string): Promise<ReportFetchResult> {
  try {
    // First try with shared_url
    const { data: reportBySharedUrl, error: sharedUrlError } = await supabase
      .from('reports')
      .select('id')
      .eq('shared_url', reportId)
      .maybeSingle();
      
    const actualReportId = reportBySharedUrl?.id || reportId;
    
    const { data, error } = await supabase
      .from('public_reports')
      .select('*')
      .eq('id', actualReportId)
      .single();
      
    if (error) {
      return { report: null, error: error.message };
    }
    
    return { report: data as PublicReport, error: null };
  } catch (error: any) {
    console.error('Error in fetchFromPublicReportsView:', error);
    return { report: null, error: error.message };
  }
}

// Try to get report using RPC function
export async function fetchReportWithRpc(reportId: string): Promise<ReportFetchResult> {
  try {
    // First check if this is a shared_url and get the actual report ID
    const { data: reportBySharedUrl, error: sharedUrlError } = await supabase
      .from('reports')
      .select('id')
      .eq('shared_url', reportId)
      .maybeSingle();
      
    const actualReportId = reportBySharedUrl?.id || reportId;
    
    // Use explicit type annotation for the RPC response
    type RpcResponseItem = Partial<PublicReport>;
    
    const { data, error } = await supabase
      .rpc<RpcResponseItem[] | RpcResponseItem>('get_public_report_by_id', { 
        report_id_param: actualReportId 
      });
      
    if (error) {
      return { report: null, error: error.message };
    }
    
    // Handle response whether it's an array or single item
    if (Array.isArray(data) && data.length > 0) {
      return { report: data[0] as PublicReport, error: null };
    } else if (data && typeof data === 'object') {
      return { report: data as PublicReport, error: null };
    }
    
    return { report: null, error: "No report data returned" };
  } catch (error: any) {
    console.error('Error in fetchReportWithRpc:', error);
    return { report: null, error: error.message };
  }
}

// Try to get report using direct join
export async function fetchReportWithJoin(reportId: string): Promise<ReportFetchResult> {
  try {
    // First check if this is a shared_url and get the actual report ID
    const { data: reportBySharedUrl, error: sharedUrlError } = await supabase
      .from('reports')
      .select('id')
      .eq('shared_url', reportId)
      .maybeSingle();
      
    const actualReportId = reportBySharedUrl?.id || reportId;
    
    interface JoinResult {
      id: string;
      title: string;
      summary: string;
      url: string;
      status: string;
      content: any;
      date: string;
      clients: {
        name: string;
        website: string;
      };
    }
    
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
        clients!inner(name, website)
      `)
      .eq('id', actualReportId)
      .single();
      
    if (error) {
      return { report: null, error: error.message };
    }
    
    // Transform the data to match the PublicReport interface
    const typedData = data as JoinResult;
    const report: PublicReport = {
      id: typedData.id,
      title: typedData.title,
      summary: typedData.summary,
      url: typedData.url,
      status: typedData.status,
      content: typedData.content,
      date: typedData.date,
      client_name: typedData.clients.name,
      client_website: typedData.clients.website
    };
    
    return { report, error: null };
  } catch (error: any) {
    console.error('Error in fetchReportWithJoin:', error);
    return { report: null, error: error.message };
  }
}

// Get report from reports table only
export async function fetchReportOnly(reportId: string): Promise<ReportFetchResult> {
  try {
    // First check if this is a shared_url and get the actual report ID
    const { data: reportBySharedUrl, error: sharedUrlError } = await supabase
      .from('reports')
      .select('id')
      .eq('shared_url', reportId)
      .maybeSingle();
      
    const actualReportId = reportBySharedUrl?.id || reportId;
    
    interface ReportOnlyResult {
      id: string;
      title?: string;
      summary?: string;
      url?: string;
      status?: string;
      content?: any;
      date?: string;
    }
    
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', actualReportId)
      .single();
      
    if (error) {
      return { report: null, error: error.message };
    }
    
    const typedData = data as ReportOnlyResult;
    
    // Create a partial report with available data
    const report: PublicReport = {
      id: typedData.id,
      title: typedData.title || 'Informe SEO',
      summary: typedData.summary || '',
      url: typedData.url || '',
      status: typedData.status || '',
      content: typedData.content || {},
      date: typedData.date || '',
      client_name: 'Cliente',  // Default value if no client data
      client_website: typedData.url || ''
    };
    
    return { report, error: null };
  } catch (error: any) {
    console.error('Error in fetchReportOnly:', error);
    return { report: null, error: error.message };
  }
}

// Verify report password
export async function verifyReportPassword(reportId: string, password: string): Promise<PasswordVerifyResult> {
  try {
    interface ReportWithPassword {
      id: string;
      password: string | null;
    }
    
    let reportToCheck: ReportWithPassword | null = null;
    
    // First try with shared_url
    const { data: reportBySharedUrl, error: sharedUrlError } = await supabase
      .from('reports')
      .select('id, password')
      .eq('shared_url', reportId)
      .maybeSingle();
      
    if (reportBySharedUrl) {
      reportToCheck = reportBySharedUrl as ReportWithPassword;
    } else {
      // If not found by shared_url, try direct id
      const { data, error } = await supabase
        .from('reports')
        .select('id, password')
        .eq('id', reportId)
        .single();
      
      if (error) {
        console.error('Error fetching report for password verification:', error);
        return { success: false, error: error.message };
      }
      
      reportToCheck = data as ReportWithPassword;
    }
    
    // Verify the password
    if (!reportToCheck || !reportToCheck.password) {
      // Report is not password protected
      return { success: true, error: null };
    }
    
    const success = reportToCheck.password === password;
    return { success, error: null };
  } catch (error: any) {
    console.error('Error in verifyReportPassword:', error);
    return { success: false, error: error.message };
  }
}
