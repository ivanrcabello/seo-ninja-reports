
import { supabase } from '@/integrations/supabase/client';

/**
 * Generic logger for shared content access
 */
export const logContentAccess = (
  contentId: string,
  contentType: 'report' | 'invoice' | 'contract' | 'proposal',
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
    const logData = {
      contentId,
      contentType,
      eventType: options.action || eventType,
      isSuccessful: options.successful,
      isPasswordAttempt: options.passwordAttempt || false,
      errorMessage: options.error,
      source: options.source || 'direct_access',
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };
    
    // Log to console for debugging
    console.log(`${contentType.toUpperCase()} access log:`, logData);
    
    // Store in localStorage for debugging
    try {
      const storageKey = `${contentType}_access_logs`;
      const existingLogs = JSON.parse(localStorage.getItem(storageKey) || '[]');
      existingLogs.push(logData);
      localStorage.setItem(storageKey, JSON.stringify(existingLogs));
    } catch (storageError) {
      console.error('Could not save log to localStorage:', storageError);
    }
    
    return { data: true, error: null };
  } catch (err) {
    console.error(`Exception logging shared ${contentType} access:`, err);
    return { data: null, error: err };
  }
};

/**
 * Generic password verification
 */
export const verifyContentPassword = async (
  contentId: string,
  contentType: 'report' | 'invoice' | 'contract' | 'proposal',
  password: string
): Promise<boolean> => {
  try {
    const functionMap = {
      report: 'verify_shared_report_password',
      invoice: 'verify_shared_invoice_password',
      contract: 'verify_shared_contract_password',
      proposal: 'verify_shared_proposal_password'
    };

    const functionName = functionMap[contentType];
    
    const { data, error } = await supabase.rpc(
      functionName, 
      { 
        report_id_param: contentId,
        shared_url_param: contentId,
        password_param: password
      }
    );
    
    if (error) throw error;
    
    // Log activity
    logContentAccess(contentId, contentType, {
      passwordAttempt: true,
      successful: !!data
    }, 'password_verification');
    
    return !!data;
  } catch (error) {
    console.error(`Error verifying ${contentType} password:`, error);
    return false;
  }
};

/**
 * Generic check for password protection
 */
export const checkContentPasswordProtection = async (
  contentId: string,
  contentType: 'report' | 'invoice' | 'contract' | 'proposal' 
): Promise<{ isProtected: boolean, error: Error | null }> => {
  try {
    const functionMap = {
      report: 'check_report_password_protection',
      invoice: 'check_invoice_password_protection',
      contract: 'check_contract_password_protection',
      proposal: 'check_proposal_password_protection'
    };

    const functionName = functionMap[contentType];
    
    const { data, error } = await supabase.rpc(
      functionName,
      { 
        report_id_param: contentId,
        shared_url_param: contentId
      }
    );
    
    if (error) throw error;
    
    return { isProtected: !!data, error: null };
  } catch (error: any) {
    console.error(`Error checking ${contentType} password protection:`, error);
    return { isProtected: false, error };
  }
};

/**
 * Check if content exists
 */
export const checkContentExists = async (
  contentId: string,
  contentType: 'report' | 'invoice' | 'contract' | 'proposal'
): Promise<{ exists: boolean, error: Error | null }> => {
  try {
    const functionMap = {
      report: 'check_report_exists',
      invoice: 'check_invoice_exists',
      contract: 'check_contract_exists',
      proposal: 'check_proposal_exists'
    };

    // Default to report function if specific one doesn't exist
    const functionName = functionMap[contentType] || 'check_report_exists';
    
    const { data, error } = await supabase.rpc(
      functionName,
      { 
        report_id_param: contentId,
        shared_url_param: contentId
      }
    );
    
    if (error) throw error;
    
    return { exists: !!data, error: null };
  } catch (error: any) {
    console.error(`Error checking if ${contentType} exists:`, error);
    return { exists: false, error };
  }
};
