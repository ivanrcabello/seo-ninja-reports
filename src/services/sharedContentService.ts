
import { supabase } from '@/integrations/supabase/client';

/**
 * Check if a shared content exists
 */
export async function checkSharedContentExists(contentId: string, contentType?: string) {
  try {
    const { data, error } = await supabase
      .rpc('check_content_exists', { 
        content_id: contentId,
        content_type: contentType
      });
    
    if (error) throw error;
    
    return { exists: !!data, error: null };
  } catch (error: any) {
    console.error('Error checking if content exists:', error);
    return { exists: false, error: error.message };
  }
}

/**
 * Check if content is password protected
 */
export async function checkContentPasswordProtection(contentId: string, contentType?: string) {
  try {
    const { data, error } = await supabase
      .rpc('check_content_password_protected', { 
        content_id: contentId,
        content_type: contentType
      });
    
    if (error) throw error;
    
    return { isProtected: !!data, error: null };
  } catch (error: any) {
    console.error('Error checking content password protection:', error);
    return { isProtected: false, error: error.message };
  }
}

/**
 * Verify content password
 */
export async function verifyContentPassword(contentId: string, contentType: string, password: string) {
  try {
    const { data, error } = await supabase
      .rpc('verify_content_password', { 
        content_id: contentId,
        content_type: contentType,
        password_param: password
      });
    
    if (error) throw error;
    
    return { verified: !!data, error: null };
  } catch (error: any) {
    console.error('Error verifying content password:', error);
    return { verified: false, error: error.message };
  }
}

/**
 * Log shared content access
 */
export async function logSharedContentAccess(
  contentType: string,
  contentId: string,
  accessType: string,
  successful: boolean = true,
  errorMessage?: string,
  passwordAttempt: boolean = false,
  source: string = 'web_client'
) {
  try {
    const { data, error } = await supabase
      .rpc('log_shared_content_access', { 
        content_type: contentType,
        content_id: contentId,
        access_type: accessType,
        successful,
        error_message: errorMessage,
        password_attempt: passwordAttempt,
        source
      });
    
    if (error) throw error;
    
    return { success: true, logId: data, error: null };
  } catch (error: any) {
    console.error('Error logging shared content access:', error);
    return { success: false, logId: null, error: error.message };
  }
}

/**
 * Get shared contract by URL
 */
export async function getSharedContract(sharedUrl: string) {
  try {
    const { data, error } = await supabase
      .rpc('get_contract_by_shared_url', { 
        shared_url_param: sharedUrl
      });
    
    if (error) throw error;
    
    // Check if data is an array and has at least one item
    const result = Array.isArray(data) && data.length > 0 ? data[0] : data;
    
    return { data: result, error: null };
  } catch (error: any) {
    console.error('Error fetching shared contract:', error);
    return { data: null, error: error.message };
  }
}

/**
 * Get shared proposal by URL
 */
export async function getSharedProposal(sharedUrl: string) {
  try {
    const { data, error } = await supabase
      .rpc('get_proposal_by_shared_url', { 
        shared_url_param: sharedUrl
      });
    
    if (error) throw error;
    
    // Check if data is an array and has at least one item
    const result = Array.isArray(data) && data.length > 0 ? data[0] : data;
    
    // Check for password protection
    const { isProtected } = await checkContentPasswordProtection(sharedUrl, 'proposal');
    
    return { data: result, error: null, isPasswordProtected: isProtected };
  } catch (error: any) {
    console.error('Error fetching shared proposal:', error);
    return { data: null, error: error.message };
  }
}

/**
 * Get shared invoice by URL
 */
export async function getSharedInvoice(sharedUrl: string) {
  try {
    const { data, error } = await supabase
      .rpc('get_invoice_by_shared_url', { 
        shared_url_param: sharedUrl
      });
    
    if (error) throw error;
    
    // Check if data is an array and has at least one item
    const result = Array.isArray(data) && data.length > 0 ? data[0] : data;
    
    return { data: result, error: null };
  } catch (error: any) {
    console.error('Error fetching shared invoice:', error);
    return { data: null, error: error.message };
  }
}

/**
 * Get shared report by URL
 */
export async function getSharedReport(sharedUrl: string) {
  try {
    const { data, error } = await supabase
      .rpc('get_public_report_by_shared_url', { 
        shared_url_param: sharedUrl
      });
    
    if (error) throw error;
    
    // Check if data is an array and has at least one item
    const result = Array.isArray(data) && data.length > 0 ? data[0] : data;
    
    return { data: result, error: null };
  } catch (error: any) {
    console.error('Error fetching shared report:', error);
    return { data: null, error: error.message };
  }
}

/**
 * Update shared contract with signature
 */
export async function updateSharedContractWithSignature(
  sharedUrl: string,
  clientSigned: boolean,
  clientSignedAt: string,
  clientSignature: string,
  status: string = 'signed'
) {
  try {
    const { data, error } = await supabase
      .rpc('update_shared_contract_with_signature', { 
        shared_url_param: sharedUrl,
        client_signed_param: clientSigned,
        client_signed_at_param: clientSignedAt,
        client_signature_param: clientSignature,
        status_param: status
      });
    
    if (error) throw error;
    
    return { success: true, data, error: null };
  } catch (error: any) {
    console.error('Error updating shared contract with signature:', error);
    return { success: false, data: null, error: error.message };
  }
}
