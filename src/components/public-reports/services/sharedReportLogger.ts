
import { supabase } from '@/integrations/supabase/client';

export interface AccessLogOptions {
  successful: boolean;
  passwordAttempt?: boolean;
  error?: string;
  action?: string;
}

/**
 * Logs access to shared reports for analytics and security
 */
export async function logSharedReportAccess(
  reportId: string, 
  options: AccessLogOptions,
  source: string = 'direct_access'
) {
  try {
    const { data: ip } = await fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .catch(() => ({ ip: 'unknown' }));

    const userAgent = navigator.userAgent;
    const timestamp = new Date().toISOString();
    
    const logData = {
      report_id: reportId,
      timestamp,
      ip_address: ip,
      user_agent: userAgent,
      success: options.successful,
      is_password_attempt: !!options.passwordAttempt,
      error_message: options.error || null,
      access_source: source,
      action_type: options.action || 'view'
    };
    
    console.log('Logging shared report access:', logData);
    
    // Save logs to local storage since shared_report_access_logs table doesn't exist
    const localLogs = JSON.parse(localStorage.getItem('report_access_logs') || '[]');
    localLogs.push(logData);
    localStorage.setItem('report_access_logs', JSON.stringify(localLogs));
  } catch (error) {
    console.error('Failed to log report access:', error);
  }
}
