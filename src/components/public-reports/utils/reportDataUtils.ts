
import { supabase } from '@/integrations/supabase/client';

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
}

export interface AccessLogOptions {
  successful: boolean;
  passwordAttempt?: boolean;
  error?: string;
  action?: string;
}

// Check if a report exists and is accessible
export async function checkReportExists(reportId: string) {
  try {
    // First try using the shared_url field
    let { data: reportBySharedUrl, error: sharedUrlError } = await supabase
      .from('reports')
      .select('id')
      .eq('shared_url', reportId)
      .maybeSingle();

    if (reportBySharedUrl) {
      return { exists: true, error: null };
    }

    // If no report found by shared_url, try direct id
    const { data, error } = await supabase
      .rpc('check_report_exists', { report_id_param: reportId });
      
    if (error) {
      console.error('Error checking report existence:', error);
      return { exists: false, error: error.message };
    }
    
    return { exists: !!data, error: null };
  } catch (error: any) {
    console.error('Error in checkReportExists:', error);
    return { exists: false, error: error.message };
  }
}

// Check if a report is password-protected
export async function checkReportPassword(reportId: string) {
  try {
    // First try using shared_url
    let { data: reportBySharedUrl, error: sharedUrlError } = await supabase
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
export async function fetchFromPublicReportsView(reportId: string) {
  try {
    // First try with shared_url
    let { data: reportBySharedUrl, error: sharedUrlError } = await supabase
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
export async function fetchReportWithRpc(reportId: string) {
  try {
    // First check if this is a shared_url and get the actual report ID
    let { data: reportBySharedUrl, error: sharedUrlError } = await supabase
      .from('reports')
      .select('id')
      .eq('shared_url', reportId)
      .maybeSingle();
      
    const actualReportId = reportBySharedUrl?.id || reportId;
    
    const { data, error } = await supabase
      .rpc('get_public_report_by_id', { 
        report_id_param: actualReportId 
      });
      
    if (error) {
      return { report: null, error: error.message };
    }
    
    return { report: data[0] as PublicReport, error: null };
  } catch (error: any) {
    console.error('Error in fetchReportWithRpc:', error);
    return { report: null, error: error.message };
  }
}

// Try to get report using direct join
export async function fetchReportWithJoin(reportId: string) {
  try {
    // First check if this is a shared_url and get the actual report ID
    let { data: reportBySharedUrl, error: sharedUrlError } = await supabase
      .from('reports')
      .select('id')
      .eq('shared_url', reportId)
      .maybeSingle();
      
    const actualReportId = reportBySharedUrl?.id || reportId;
    
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
    const report: PublicReport = {
      id: data.id,
      title: data.title,
      summary: data.summary,
      url: data.url,
      status: data.status,
      content: data.content,
      date: data.date,
      client_name: data.clients.name,
      client_website: data.clients.website
    };
    
    return { report, error: null };
  } catch (error: any) {
    console.error('Error in fetchReportWithJoin:', error);
    return { report: null, error: error.message };
  }
}

// Get report from reports table only
export async function fetchReportOnly(reportId: string) {
  try {
    // First check if this is a shared_url and get the actual report ID
    let { data: reportBySharedUrl, error: sharedUrlError } = await supabase
      .from('reports')
      .select('id')
      .eq('shared_url', reportId)
      .maybeSingle();
      
    const actualReportId = reportBySharedUrl?.id || reportId;
    
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', actualReportId)
      .single();
      
    if (error) {
      return { report: null, error: error.message };
    }
    
    // Create a partial report with available data
    const report: PublicReport = {
      id: data.id,
      title: data.title || 'Informe SEO',
      summary: data.summary || '',
      url: data.url || '',
      status: data.status,
      content: data.content,
      date: data.date,
      client_name: 'Cliente',  // Default value if no client data
      client_website: data.url || ''
    };
    
    return { report, error: null };
  } catch (error: any) {
    console.error('Error in fetchReportOnly:', error);
    return { report: null, error: error.message };
  }
}

// Verify report password
export async function verifyReportPassword(reportId: string, password: string) {
  try {
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
    if (!reportToCheck.password) {
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
