
import { supabase } from '@/integrations/supabase/client';

/**
 * Generic function to check if shared content exists
 */
export const checkContentExists = async (contentId: string, contentType: string): Promise<{ exists: boolean, error: Error | null }> => {
  try {
    let exists = false;
    
    switch (contentType) {
      case 'contract':
        const { data: contractExists } = await supabase
          .from('client_contracts')
          .select('id')
          .or(`id.eq.${contentId},shared_url.eq.${contentId}`)
          .limit(1);
        exists = Boolean(contractExists && contractExists.length > 0);
        break;
        
      case 'report':
        const { data: reportExists } = await supabase
          .rpc('check_report_exists', { report_id_param: contentId });
        exists = Boolean(reportExists);
        break;
        
      case 'proposal':
        const { data: proposalExists } = await supabase
          .from('client_proposals')
          .select('id')
          .or(`id.eq.${contentId},shared_url.eq.${contentId}`)
          .limit(1);
        exists = Boolean(proposalExists && proposalExists.length > 0);
        break;
        
      case 'invoice':
        const { data: invoiceExists } = await supabase
          .from('client_invoices')
          .select('id')
          .or(`id.eq.${contentId},shared_url.eq.${contentId}`)
          .limit(1);
        exists = Boolean(invoiceExists && invoiceExists.length > 0);
        break;
        
      default:
        return { exists: false, error: new Error(`Unknown content type: ${contentType}`) };
    }
    
    return { exists, error: null };
  } catch (error: any) {
    console.error(`Error checking if ${contentType} exists:`, error);
    return { exists: false, error };
  }
};

/**
 * Generic function to check if content is password protected
 */
export const checkContentPasswordProtection = async (contentId: string, contentType: string): Promise<{ isProtected: boolean, error: Error | null }> => {
  try {
    let isProtected = false;
    
    switch (contentType) {
      case 'contract':
        // For contracts, we'll just check if the contract exists since they don't have passwords
        // We'll assume they're not password protected for now
        isProtected = false;
        break;
        
      case 'report':
        // Use the RPC function to check if report is password protected
        const { data: reportProtected, error: reportError } = await supabase
          .rpc('check_report_password_protection', { report_id_param: contentId });
          
        if (reportError) {
          throw reportError;
        }
        
        isProtected = Boolean(reportProtected);
        break;
        
      case 'proposal':
        // Use the RPC function to check if proposal is password protected
        const { data: proposalProtected, error: proposalError } = await supabase
          .rpc('check_proposal_password_protection', { shared_url_param: contentId });
          
        if (proposalError) {
          throw proposalError;
        }
        
        isProtected = Boolean(proposalProtected);
        break;
        
      case 'invoice':
        // Use the RPC function to check if invoice is password protected
        const { data: invoiceProtected, error: invoiceError } = await supabase
          .rpc('check_invoice_password_protection', { shared_url_param: contentId });
          
        if (invoiceError) {
          throw invoiceError;
        }
        
        isProtected = Boolean(invoiceProtected);
        break;
        
      default:
        return { isProtected: false, error: new Error(`Unknown content type: ${contentType}`) };
    }
    
    return { isProtected, error: null };
  } catch (error: any) {
    console.error(`Error checking if ${contentType} is password protected:`, error);
    return { isProtected: false, error };
  }
};

/**
 * Generic function to verify content password
 */
export const verifyContentPassword = async (contentId: string, contentType: string, password: string): Promise<boolean> => {
  try {
    switch (contentType) {
      case 'contract':
        // Contracts don't have passwords in this system
        // Always return true for now
        return true;
        
      case 'report':
        // Use the RPC function to verify report password
        const { data: reportVerified, error: reportError } = await supabase
          .rpc('verify_shared_report_password', { 
            report_id_param: contentId,
            password_param: password
          });
          
        if (reportError) {
          throw reportError;
        }
        
        return Boolean(reportVerified);
        
      case 'proposal':
        // Use the RPC function to verify proposal password
        const { data: proposalVerified, error: proposalError } = await supabase
          .rpc('verify_shared_proposal_password', { 
            shared_url_param: contentId,
            password_param: password
          });
          
        if (proposalError) {
          throw proposalError;
        }
        
        return Boolean(proposalVerified);
        
      case 'invoice':
        // Use the RPC function to verify invoice password
        const { data: invoiceVerified, error: invoiceError } = await supabase
          .rpc('verify_shared_invoice_password', { 
            shared_url_param: contentId,
            password_param: password
          });
          
        if (invoiceError) {
          throw invoiceError;
        }
        
        return Boolean(invoiceVerified);
        
      default:
        console.error(`Unknown content type: ${contentType}`);
        return false;
    }
  } catch (error: any) {
    console.error(`Error verifying ${contentType} password:`, error);
    return false;
  }
};

/**
 * Log content access for security and analytics
 */
export const logContentAccess = (contentId: string, contentType: string, options: any, eventType: string = 'access') => {
  // In real application, this would save to a log table
  // But for this example, we'll just console log
  const logData = {
    timestamp: new Date().toISOString(),
    contentId,
    contentType,
    eventType,
    ...options
  };
  
  console.log('Content Access Log:', logData);
  
  // Here you could insert into an access_logs table
};
