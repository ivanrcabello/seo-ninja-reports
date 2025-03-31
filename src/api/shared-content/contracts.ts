
import { supabase } from '@/integrations/supabase/client';
import { SharedContract, ContractSignatureUpdate } from '@/types/shared-content';
import { logContentAccess, checkContentExists, verifyContentPassword } from './utils';

/**
 * Check if a contract exists
 */
export const checkContractExists = async (contractId: string): Promise<{ exists: boolean, error: Error | null }> => {
  return checkContentExists(contractId, 'contract');
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
export const fetchContractBySharedUrl = async (sharedUrl: string): Promise<SharedContract> => {
  try {
    console.log('Fetching contract with shared URL:', sharedUrl);
    
    const { data, error } = await supabase.rpc('get_contract_by_shared_url', {
      shared_url_param: sharedUrl
    });
    
    if (error) throw error;
    
    if (!data || (Array.isArray(data) && data.length === 0)) {
      throw new Error('Contract not found');
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
    
    return contract;
  } catch (error: any) {
    console.error('Error fetching contract:', error);
    
    // Log failed access
    logContractAccess(sharedUrl, { successful: false, error: error.message }, 'error');
    
    throw error;
  }
};

/**
 * Update contract with client signature
 */
export const updateContractWithSignature = async (
  sharedUrl: string, 
  signatureData: ContractSignatureUpdate
): Promise<{ success: boolean, error: Error | null }> => {
  try {
    console.log('Updating contract with signature, shared URL:', sharedUrl);
    
    const { data, error } = await supabase.rpc('update_contract_by_shared_url', {
      shared_url_param: sharedUrl,
      client_signed_param: signatureData.client_signed,
      client_signed_at_param: signatureData.client_signed_at,
      client_signature_param: signatureData.client_signature,
      status_param: 'signed'
    });
    
    if (error) throw error;
    
    // Log successful signature
    logContractAccess(sharedUrl, { successful: true, action: 'sign' }, 'sign');
    
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Error updating contract with signature:', error);
    
    // Log failed signature
    logContractAccess(sharedUrl, { successful: false, error: error.message, action: 'sign' }, 'error');
    
    return { success: false, error };
  }
};
