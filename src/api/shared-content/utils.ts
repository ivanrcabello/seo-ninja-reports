
import { supabase } from '@/integrations/supabase/client';
import { SharedContentStatus } from '@/types/shared-content';

/**
 * Check if content exists (works for all content types)
 */
export const checkContentExists = async (contentId: string, contentType: 'report' | 'invoice' | 'proposal' | 'contract'): Promise<{ exists: boolean, error: Error | null }> => {
  try {
    const { data, error } = await supabase.rpc('check_content_exists', {
      content_id: contentId,
      content_type: contentType
    });
    
    if (error) throw error;
    
    return { exists: data, error: null };
  } catch (err: any) {
    console.error(`Error checking if ${contentType} exists:`, err);
    return { exists: false, error: err };
  }
};

/**
 * Check if content is password protected (works for all content types)
 */
export const checkContentPasswordProtection = async (contentId: string, contentType: 'report' | 'invoice' | 'proposal' | 'contract'): Promise<{ isProtected: boolean, error: Error | null }> => {
  try {
    const { data, error } = await supabase.rpc('check_content_password_protected', {
      content_id: contentId,
      content_type: contentType
    });
    
    if (error) throw error;
    
    return { isProtected: data, error: null };
  } catch (err: any) {
    console.error(`Error checking if ${contentType} is password protected:`, err);
    return { isProtected: false, error: err };
  }
};

/**
 * Verify content password (works for all content types)
 */
export const verifyContentPassword = async (contentId: string, contentType: 'report' | 'invoice' | 'proposal' | 'contract', password: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('verify_content_password', {
      content_id: contentId,
      content_type: contentType,
      password_param: password
    });
    
    if (error) throw error;
    
    return data;
  } catch (err) {
    console.error(`Error verifying ${contentType} password:`, err);
    return false;
  }
};

/**
 * Log content access (useful for analytics)
 */
export const logContentAccess = async (contentId: string, contentType: string, options: any = {}, eventType: string = 'access') => {
  try {
    // You could implement actual logging here
    // For now we just console.log
    console.log(`Content access logged: ${contentType} ${contentId} - ${eventType}`, options);
    return true;
  } catch (err) {
    console.error(`Error logging ${contentType} access:`, err);
    return false;
  }
};

// Type-safe helper functions for specific content types
// These will be used by the specific content modules

// Report specific helpers
export const checkReportExists = (reportId: string) => checkContentExists(reportId, 'report');
export const checkReportPassword = (reportId: string) => checkContentPasswordProtection(reportId, 'report');
export const verifyReportPassword = (reportId: string, password: string) => verifyContentPassword(reportId, 'report', password);
export const logReportAccess = (reportId: string, options: any, eventType: string = 'access') => logContentAccess(reportId, 'report', options, eventType);

// Contract specific helpers
export const checkContractExists = (contractId: string) => checkContentExists(contractId, 'contract');
export const checkContractPassword = (contractId: string) => checkContentPasswordProtection(contractId, 'contract');
export const verifyContractPassword = (contractId: string, password: string) => verifyContentPassword(contractId, 'contract', password);
export const logContractAccess = (contractId: string, options: any, eventType: string = 'access') => logContentAccess(contractId, 'contract', options, eventType);

// Invoice specific helpers
export const checkInvoiceExists = (invoiceId: string) => checkContentExists(invoiceId, 'invoice');
export const checkInvoicePassword = (invoiceId: string) => checkContentPasswordProtection(invoiceId, 'invoice');
export const verifyInvoicePassword = (invoiceId: string, password: string) => verifyContentPassword(invoiceId, 'invoice', password);
export const logInvoiceAccess = (invoiceId: string, options: any, eventType: string = 'access') => logContentAccess(invoiceId, 'invoice', options, eventType);

// Proposal specific helpers
export const checkProposalExists = (proposalId: string) => checkContentExists(proposalId, 'proposal');
export const checkProposalPassword = (proposalId: string) => checkContentPasswordProtection(proposalId, 'proposal');
export const verifyProposalPassword = (proposalId: string, password: string) => verifyContentPassword(proposalId, 'proposal', password);
export const logProposalAccess = (proposalId: string, options: any, eventType: string = 'access') => logContentAccess(proposalId, 'proposal', options, eventType);
