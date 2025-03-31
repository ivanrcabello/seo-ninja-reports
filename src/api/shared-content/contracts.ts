
import { supabase } from '@/integrations/supabase/client';
import { SharedContract } from '@/types/shared-content';
import { logContentAccess, checkContentExists, checkContentPasswordProtection, verifyContentPassword } from './utils';

/**
 * Fetch contract by shared URL
 */
export const fetchContractBySharedUrl = async (sharedUrl: string): Promise<{ contract: SharedContract | null, error: Error | null }> => {
  try {
    console.log('Fetching contract with shared URL:', sharedUrl);
    
    const { data, error } = await supabase.rpc('get_public_contract_by_shared_url', {
      shared_url_param: sharedUrl
    });
    
    if (error) throw error;
    
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return { contract: null, error: null };
    }
    
    // Handle the case when data is an array
    const contractData = Array.isArray(data) ? data[0] : data;
    
    const contract: SharedContract = {
      id: contractData.id,
      title: contractData.title,
      content: contractData.content,
      client_name: contractData.client_name,
      client_website: contractData.client_website,
      status: contractData.status,
      created_at: contractData.created_at,
      updated_at: contractData.updated_at,
      client_signed: contractData.client_signed,
      client_signed_at: contractData.client_signed_at,
      client_signature: contractData.client_signature,
      admin_signed: contractData.admin_signed,
      admin_signed_at: contractData.admin_signed_at,
      admin_signature: contractData.admin_signature,
      shared_url: contractData.shared_url
    };
    
    // Log successful access
    logContractAccess(sharedUrl, { successful: true }, 'view');
    
    return { contract, error: null };
  } catch (error: any) {
    console.error('Error fetching contract:', error);
    
    // Log failed access
    logContractAccess(sharedUrl, { successful: false, error: error.message }, 'error');
    
    return { contract: null, error };
  }
};

/**
 * Update contract signature
 */
export const updateContractSignature = async (
  sharedUrl: string,
  clientSignature: string
): Promise<{ success: boolean, error: Error | null }> => {
  try {
    console.log('Updating contract signature for:', sharedUrl);
    
    const { data, error } = await supabase.rpc('update_contract_by_shared_url', {
      shared_url_param: sharedUrl,
      client_signed_param: true,
      client_signed_at_param: new Date().toISOString(),
      client_signature_param: clientSignature,
      status_param: 'signed'
    });
    
    if (error) throw error;
    
    // Log successful update
    logContractAccess(sharedUrl, { successful: true, action: 'sign' }, 'signature');
    
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Error updating contract signature:', error);
    
    // Log failed update
    logContractAccess(sharedUrl, { successful: false, error: error.message, action: 'sign' }, 'signature_error');
    
    return { success: false, error };
  }
};

/**
 * Log contract access
 */
export const logContractAccess = (contractId: string, options: any, eventType: string = 'access') => {
  return logContentAccess(contractId, 'contract', options, eventType);
};

/**
 * Check if a contract is password protected
 */
export const checkContractPassword = async (contractId: string): Promise<{ isProtected: boolean, error: Error | null }> => {
  return checkContentPasswordProtection(contractId, 'contract');
};

/**
 * Verify a contract's password
 */
export const verifyContractPassword = async (contractId: string, password: string): Promise<boolean> => {
  return verifyContentPassword(contractId, 'contract', password);
};

/**
 * Check if a contract exists
 */
export const checkContractExists = async (contractId: string): Promise<{ exists: boolean, error: Error | null }> => {
  return checkContentExists(contractId, 'contract');
};
