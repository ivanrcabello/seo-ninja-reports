
import { supabase } from '@/integrations/supabase/client';
import { SharedContract } from '@/types/shared-content';
import { logContentAccess, checkContentExists, checkContentPasswordProtection, verifyContentPassword } from './utils';

/**
 * Check if a contract exists
 */
export const checkContractExists = async (contractId: string): Promise<{ exists: boolean, error: Error | null }> => {
  return checkContentExists(contractId, 'contract');
};

/**
 * Check if a contract is password protected
 * Note: Contracts don't have password protection, but we keep the API consistent
 */
export const checkContractPassword = async (contractId: string): Promise<{ isProtected: boolean, error: Error | null }> => {
  return checkContentPasswordProtection(contractId, 'contract');
};

/**
 * Verify a contract's password
 * Note: Contracts don't have password protection, but we keep the API consistent
 */
export const verifyContractPassword = async (contractId: string, password: string): Promise<boolean> => {
  return verifyContentPassword(contractId, 'contract', password);
};

/**
 * Log contract access
 */
export const logContractAccess = (contractId: string, options: any, eventType: string = 'access') => {
  return logContentAccess(contractId, 'contract', options, eventType);
};

/**
 * Fetch contract by shared URL
 */
export const fetchContractBySharedUrl = async (sharedUrl: string): Promise<{ contract: SharedContract | null, error: Error | null }> => {
  try {
    console.log('Fetching contract with shared URL:', sharedUrl);
    
    const { data, error } = await supabase.rpc('get_contract_by_shared_url', {
      shared_url_param: sharedUrl
    });
      
    if (error) throw error;
    
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return { contract: null, error: new Error('Contract not found') };
    }
    
    // Handle the case when data is an array
    const contractData = Array.isArray(data) ? data[0] : data;
    
    // Create a properly typed contract object
    const contract: SharedContract = {
      id: contractData.id,
      title: contractData.title,
      content: contractData.content,
      status: contractData.status,
      client_signed: contractData.client_signed,
      client_signed_at: contractData.client_signed_at,
      client_signature: contractData.client_signature,
      admin_signed: contractData.admin_signed,
      admin_signed_at: contractData.admin_signed_at,
      admin_signature: contractData.admin_signature,
      shared_url: contractData.shared_url,
      created_at: contractData.created_at,
      updated_at: contractData.updated_at,
      client_name: contractData.client_name,
      client_website: contractData.client_website
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
export const updateContractSignature = async (sharedUrl: string, signature: string): Promise<{ success: boolean, error: Error | null }> => {
  try {
    // Update the contract with the client signature
    const { data, error } = await supabase.rpc('update_contract_by_shared_url', {
      shared_url_param: sharedUrl,
      client_signed_param: true,
      client_signed_at_param: new Date().toISOString(),
      client_signature_param: signature,
      status_param: 'signed'
    });
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Error updating contract signature:', error);
    return { success: false, error };
  }
};
