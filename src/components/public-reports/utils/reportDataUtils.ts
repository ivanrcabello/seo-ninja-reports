
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
    // Use a simplified approach with explicit typing
    const result = await supabase
      .rpc('check_report_exists', { report_id_param: reportId });
      
    if (result.error) {
      console.error('Error checking report existence:', result.error);
      return { exists: false, error: result.error.message };
    }
    
    // Handle different possible response formats with explicit checks
    const data = result.data;
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
    
    const result = await supabase
      .from('reports')
      .select('password')
      .eq('id', reportId)
      .single();
    
    if (result.error) {
      console.error('Error checking report password:', result.error);
      return { isProtected: false, error: result.error.message };
    }
    
    return { isProtected: !!result.data.password, error: null };
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
    
    const result = await supabase
      .from('public_reports')
      .select('*')
      .eq('id', actualReportId)
      .single();
      
    if (result.error) {
      return { report: null, error: result.error.message };
    }
    
    return { report: result.data as PublicReport, error: null };
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
    
    // Define a clear interface for the RPC response
    interface RpcReportResponse {
      id: string;
      title?: string;
      summary?: string;
      url?: string;
      status?: string;
      content?: any;
      date?: string;
      client_name?: string;
      client_website?: string;
      shared_url?: string;
      password?: string;
    }
    
    // Use explicit typing for RPC call to avoid excessive instantiation
    const result = await supabase
      .rpc('get_public_report_by_id', { 
        report_id_param: actualReportId 
      });
      
    if (result.error) {
      return { report: null, error: result.error.message };
    }
    
    const data = result.data;
    
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
    
    // Define interface for join result to avoid type errors
    interface JoinResult {
      id: string;
      title: string;
      summary: string;
      url: string;
      status: string;
      content: any;
      date: string;
      shared_url?: string;
      password?: string;
      clients: {
        name: string;
        website: string;
      };
    }
    
    try {
      const result = await supabase
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
          password,
          clients!inner(name, website)
        `)
        .eq('id', actualReportId)
        .single();
        
      if (result.error) {
        return { report: null, error: result.error.message };
      }
      
      // Transform the data to match the PublicReport interface
      const data = result.data as unknown as JoinResult;
      
      const report: PublicReport = {
        id: data.id,
        title: data.title,
        summary: data.summary,
        url: data.url,
        status: data.status,
        content: data.content,
        date: data.date,
        client_name: data.clients.name,
        client_website: data.clients.website,
        shared_url: data.shared_url,
        password: data.password
      };
      
      return { report, error: null };
    } catch (error: any) {
      console.error('Error in fetchReportWithJoin:', error);
      return { report: null, error: error.message };
    }
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
      shared_url?: string;
      password?: string;
    }
    
    const result = await supabase
      .from('reports')
      .select('*')
      .eq('id', actualReportId)
      .single();
      
    if (result.error) {
      return { report: null, error: result.error.message };
    }
    
    const data = result.data as ReportOnlyResult;
    
    // Create a partial report with available data
    const report: PublicReport = {
      id: data.id,
      title: data.title || 'Informe SEO',
      summary: data.summary || '',
      url: data.url || '',
      status: data.status || '',
      content: data.content || {},
      date: data.date || '',
      client_name: 'Cliente',  // Default value if no client data
      client_website: data.url || '',
      shared_url: data.shared_url,
      password: data.password
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
      const result = await supabase
        .from('reports')
        .select('id, password')
        .eq('id', reportId)
        .single();
      
      if (result.error) {
        console.error('Error fetching report for password verification:', result.error);
        return { success: false, error: result.error.message };
      }
      
      reportToCheck = result.data as ReportWithPassword;
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
