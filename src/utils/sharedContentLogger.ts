
import { supabase } from '@/integrations/supabase/client';

/**
 * Log when a shared report is accessed
 */
export const logSharedReportAccess = async (
  reportId: string, 
  options: {
    successful: boolean;
    passwordAttempt?: boolean;
    error?: string;
    action?: string;
    source?: string;
  },
  eventType: string = 'access'
) => {
  try {
    const { data, error } = await supabase
      .from('shared_content_logs')
      .insert({
        content_id: reportId,
        content_type: 'report',
        event_type: options.action || eventType,
        is_successful: options.successful,
        is_password_attempt: options.passwordAttempt || false,
        error_message: options.error,
        source: options.source || 'direct_access',
        user_agent: navigator.userAgent,
        ip_address: null // This is filled on the server side
      });
      
    if (error) {
      console.error('Error logging shared report access:', error);
    }
    
    return { data, error };
  } catch (err) {
    console.error('Exception logging shared report access:', err);
    return { data: null, error: err };
  }
};

/**
 * Log when a shared proposal is accessed
 */
export const logSharedProposalAccess = async (
  proposalId: string, 
  options: {
    successful: boolean;
    passwordAttempt?: boolean;
    error?: string;
    action?: string;
    source?: string;
  },
  eventType: string = 'access'
) => {
  try {
    const { data, error } = await supabase
      .from('shared_content_logs')
      .insert({
        content_id: proposalId,
        content_type: 'proposal',
        event_type: options.action || eventType,
        is_successful: options.successful,
        is_password_attempt: options.passwordAttempt || false,
        error_message: options.error,
        source: options.source || 'direct_access',
        user_agent: navigator.userAgent,
        ip_address: null // This is filled on the server side
      });
      
    if (error) {
      console.error('Error logging shared proposal access:', error);
    }
    
    return { data, error };
  } catch (err) {
    console.error('Exception logging shared proposal access:', err);
    return { data: null, error: err };
  }
};
