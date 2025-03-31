
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
    // Log to console and localStorage for debugging without database operations
    console.log('Report access log:', {
      contentId: reportId,
      contentType: 'report',
      eventType: options.action || eventType,
      isSuccessful: options.successful,
      isPasswordAttempt: options.passwordAttempt || false,
      errorMessage: options.error,
      source: options.source || 'direct_access',
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });
    
    // Store in localStorage for debugging
    try {
      const existingLogs = JSON.parse(localStorage.getItem('report_access_logs') || '[]');
      existingLogs.push({
        contentId: reportId,
        contentType: 'report',
        eventType: options.action || eventType,
        isSuccessful: options.successful,
        isPasswordAttempt: options.passwordAttempt || false,
        errorMessage: options.error,
        source: options.source || 'direct_access',
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('report_access_logs', JSON.stringify(existingLogs));
    } catch (storageError) {
      console.error('Could not save log to localStorage:', storageError);
    }
    
    return { data: true, error: null };
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
    // Use the same approach as for report access logging
    console.log('Proposal access log:', {
      contentId: proposalId,
      contentType: 'proposal',
      eventType: options.action || eventType,
      isSuccessful: options.successful,
      isPasswordAttempt: options.passwordAttempt || false,
      errorMessage: options.error,
      source: options.source || 'direct_access',
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });
    
    // Store in localStorage for debugging
    try {
      const existingLogs = JSON.parse(localStorage.getItem('proposal_access_logs') || '[]');
      existingLogs.push({
        contentId: proposalId,
        contentType: 'proposal',
        eventType: options.action || eventType,
        isSuccessful: options.successful,
        isPasswordAttempt: options.passwordAttempt || false,
        errorMessage: options.error,
        source: options.source || 'direct_access',
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('proposal_access_logs', JSON.stringify(existingLogs));
    } catch (storageError) {
      console.error('Could not save log to localStorage:', storageError);
    }
    
    return { data: true, error: null };
  } catch (err) {
    console.error('Exception logging shared proposal access:', err);
    return { data: null, error: err };
  }
};
