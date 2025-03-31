
import { supabase } from '@/integrations/supabase/client';
import { SharedContract, SharedContractResponse, AccessLogOptions, AccessLogType, SharedContentStatus } from '@/types/shared-content';
import { logContentAccess } from './utils';

/**
 * Check if a contract exists
 */
export const checkContractExists = async (contractId: string): Promise<{ exists: boolean, error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('public_contracts')
      .select('id')
      .eq('shared_url', contractId)
      .maybeSingle();
    
    if (error) throw error;
    
    return { exists: !!data, error: null };
  } catch (error: any) {
    console.error('Error checking if contract exists:', error);
    return { exists: false, error };
  }
};

/**
 * Log contract access
 */
export const logContractAccess = (contractId: string, options: AccessLogOptions, eventType: AccessLogType = 'view') => {
  return logContentAccess('contract', contractId, options, eventType);
};

/**
 * Fetch contract by shared URL
 */
export const fetchContractBySharedUrl = async (sharedUrl: string): Promise<SharedContractResponse> => {
  try {
    console.log('Fetching contract with shared URL:', sharedUrl);
    
    const { data, error } = await supabase
      .from('public_contracts')
      .select('*')
      .eq('shared_url', sharedUrl)
      .maybeSingle();
    
    if (error) throw error;
    
    if (!data) {
      return { contract: null, error: new Error('Contract not found') };
    }
    
    // Create a properly typed contract object
    const contract: SharedContract = {
      id: data.id,
      title: data.title,
      content: data.content,
      client_name: data.client_name,
      client_website: data.client_website,
      status: data.status as SharedContentStatus,
      created_at: data.created_at,
      updated_at: data.updated_at,
      client_signed: data.client_signed,
      client_signed_at: data.client_signed_at,
      client_signature: data.client_signature,
      admin_signed: data.admin_signed,
      admin_signed_at: data.admin_signed_at,
      admin_signature: data.admin_signature,
      shared_url: data.shared_url
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
 * Update contract with signature data
 */
export const updateContractWithSignature = async (
  contractId: string,
  signatureData: {
    client_signed: boolean;
    client_signed_at: string;
    client_signature: string;
    status: SharedContentStatus;
  }
): Promise<boolean> => {
  try {
    // Use RPC function instead of direct update
    const { data, error } = await supabase
      .rpc('update_contract_by_shared_url', {
        shared_url_param: contractId,
        client_signed_param: signatureData.client_signed,
        client_signed_at_param: signatureData.client_signed_at,
        client_signature_param: signatureData.client_signature,
        status_param: signatureData.status
      });
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating contract signature:', error);
    return false;
  }
};
