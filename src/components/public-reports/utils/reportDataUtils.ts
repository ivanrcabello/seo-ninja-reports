
import { supabase } from '@/integrations/supabase/client';

// Define simpler interfaces to avoid excessive type nesting
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

// Simple response types for better TypeScript performance
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
    console.log(`Checking if report exists: ${reportId}`);
    
    // First check if this is a shared_url
    const { data: reportBySharedUrl, error: sharedUrlError } = await supabase
      .from('reports')
      .select('id')
      .eq('shared_url', reportId)
      .maybeSingle();

    if (reportBySharedUrl) {
      console.log('Found report by shared_url');
      return { exists: true, error: null };
    }
    
    // If no report found by shared_url, try direct id
    const { data: reportById, error: idError } = await supabase
      .from('reports')
      .select('id')
      .eq('id', reportId)
      .single();
      
    if (idError) {
      console.error('Error checking report existence by ID:', idError);
      return { exists: false, error: idError.message };
    }
    
    return { exists: !!reportById, error: null };
  } catch (error: any) {
    console.error('Error in checkReportExists:', error);
    return { exists: false, error: error.message };
  }
}

// Check if a report is password-protected
export async function checkReportPassword(reportId: string): Promise<ReportPasswordCheck> {
  try {
    console.log(`Checking if report is password protected: ${reportId}`);
    
    // First try using shared_url
    const { data: reportBySharedUrl, error: sharedUrlError } = await supabase
      .from('reports')
      .select('id, password')
      .eq('shared_url', reportId)
      .maybeSingle();

    if (reportBySharedUrl) {
      console.log('Found report password status by shared_url');
      return { 
        isProtected: !!reportBySharedUrl.password, 
        error: null 
      };
    }

    // If not found by shared_url, try direct id
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
    console.log(`Fetching from public_reports view: ${reportId}`);
    
    // First try with shared_url to get the actual report ID
    const { data: reportBySharedUrl, error: sharedUrlError } = await supabase
      .from('reports')
      .select('id')
      .eq('shared_url', reportId)
      .maybeSingle();
      
    const actualReportId = reportBySharedUrl?.id || reportId;
    
    // Now fetch the full report data
    const { data, error } = await supabase
      .from('public_reports')
      .select('*')
      .eq('id', actualReportId)
      .single();
      
    if (error) {
      console.error('Error fetching from public_reports view:', error);
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
    console.log(`Fetching with RPC: ${reportId}`);
    
    // Check if this is a shared_url and get the actual report ID or use directly
    let response;
    
    // First try to get report by shared_url using the dedicated function
    try {
      response = await supabase.rpc('get_report_by_shared_url', { 
        shared_url_param: reportId 
      });
      
      if (response.error) {
        console.log('Could not fetch by shared_url, trying direct ID');
        // If that fails, try the regular function with direct ID
        response = await supabase.rpc('get_public_report_by_id', { 
          report_id_param: reportId 
        });
      }
    } catch (rpcError) {
      console.error('Initial RPC error:', rpcError);
      // Try the regular function as fallback
      response = await supabase.rpc('get_public_report_by_id', { 
        report_id_param: reportId 
      });
    }
    
    const { data, error } = response;
    
    if (error) {
      console.error('Error in RPC fetching:', error);
      return { report: null, error: error.message };
    }
    
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
    console.log(`Fetching with direct join: ${reportId}`);
    
    // First check if this is a shared_url and get the actual report ID
    const { data: reportBySharedUrl, error: sharedUrlError } = await supabase
      .from('reports')
      .select('id')
      .eq('shared_url', reportId)
      .maybeSingle();
      
    const actualReportId = reportBySharedUrl?.id || reportId;
    
    // Direct join query
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
        password,
        clients!inner(name, website)
      `)
      .eq('id', actualReportId)
      .single();
        
    if (error) {
      console.error('Error in direct join query:', error);
      return { report: null, error: error.message };
    }
    
    // Transform join result to match PublicReport interface
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
}

// Get report from reports table only
export async function fetchReportOnly(reportId: string): Promise<ReportFetchResult> {
  try {
    console.log(`Fetching report only: ${reportId}`);
    
    // First check if this is a shared_url and get the actual report ID
    const { data: reportBySharedUrl, error: sharedUrlError } = await supabase
      .from('reports')
      .select('id')
      .eq('shared_url', reportId)
      .maybeSingle();
      
    const actualReportId = reportBySharedUrl?.id || reportId;
    
    // Get basic report data
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', actualReportId)
      .single();
      
    if (error) {
      console.error('Error fetching report only:', error);
      return { report: null, error: error.message };
    }
    
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
    console.log(`Verifying report password: ${reportId}`);
    
    // Try to use the database function for password verification
    try {
      const { data, error } = await supabase.rpc('verify_shared_report_password', {
        report_id_param: reportId,
        password_param: password
      });
      
      if (error) throw error;
      
      return { success: !!data, error: null };
    } catch (rpcError: any) {
      console.error('RPC password verification failed, using fallback method:', rpcError);
      
      // Fallback: Manual verification
      let reportToCheck;
      
      // First try with shared_url
      const { data: reportBySharedUrl, error: sharedUrlError } = await supabase
        .from('reports')
        .select('id, password')
        .eq('shared_url', reportId)
        .maybeSingle();
        
      if (reportBySharedUrl) {
        reportToCheck = reportBySharedUrl;
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
        
        reportToCheck = data;
      }
      
      // Verify the password
      if (!reportToCheck || !reportToCheck.password) {
        // Report is not password protected
        return { success: true, error: null };
      }
      
      const success = reportToCheck.password === password;
      return { success, error: null };
    }
  } catch (error: any) {
    console.error('Error in verifyReportPassword:', error);
    return { success: false, error: error.message };
  }
}
