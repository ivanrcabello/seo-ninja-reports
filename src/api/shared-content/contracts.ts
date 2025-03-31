
import { supabase } from '@/integrations/supabase/client';
import { SharedContract, SharedContractResponse, ContractSignatureUpdate, AccessLogOptions, AccessLogType, SharedContentStatus } from '@/types/shared-content';
import { logContentAccess } from './utils';

/**
 * Check if a contract exists
 */
export const checkContractExists = async (contractId: string): Promise<{ exists: boolean; error: Error | null }> => {
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
    const { data, error } = await supabase
      .from('public_contracts')
      .select('*')
      .eq('shared_url', sharedUrl)
      .maybeSingle();
    
    if (error) throw error;
    
    if (!data) {
      return { contract: null, error: new Error('Contract not found') };
    }
    
    const status = data.status as SharedContentStatus;
    
    const contract: SharedContract = {
      id: data.id,
      title: data.title,
      content: data.content,
      status: status,
      client_signed: data.client_signed,
      client_signed_at: data.client_signed_at,
      client_signature: data.client_signature,
      admin_signed: data.admin_signed,
      admin_signed_at: data.admin_signed_at,
      admin_signature: data.admin_signature,
      shared_url: data.shared_url,
      created_at: data.created_at,
      updated_at: data.updated_at,
      client_name: data.client_name,
      client_website: data.client_website
    };
    
    return { contract, error: null };
  } catch (error: any) {
    console.error('Error fetching contract:', error);
    return { contract: null, error };
  }
};

/**
 * Update contract with signature
 */
export const updateContractWithSignature = async (
  contractId: string,
  signatureData: ContractSignatureUpdate
): Promise<{ success: boolean, error: Error | null }> => {
  try {
    // First try to update in public_contracts
    const { error: publicError } = await supabase
      .from('public_contracts')
      .update({
        client_signed: signatureData.client_signed,
        client_signed_at: signatureData.client_signed_at,
        client_signature: signatureData.client_signature,
        status: 'signed' as SharedContentStatus
      })
      .eq('shared_url', contractId);
    
    if (publicError) throw publicError;
    
    // Then try to find and update in client_contracts
    const { data: contract, error: findError } = await supabase
      .from('client_contracts')
      .select('id')
      .eq('shared_url', contractId)
      .maybeSingle();
    
    if (!findError && contract) {
      // Update the original contract too
      const { error: updateError } = await supabase
        .from('client_contracts')
        .update({
          client_signed: signatureData.client_signed,
          client_signed_at: signatureData.client_signed_at,
          client_signature: signatureData.client_signature,
          status: 'signed'
        })
        .eq('id', contract.id);
      
      if (updateError) {
        console.error('Error updating original contract:', updateError);
      }
    }
    
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Error updating contract with signature:', error);
    return { success: false, error };
  }
};
