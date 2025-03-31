
import { supabase } from '@/integrations/supabase/client';
import { SharedContract, SharedContractResponse, AccessLogOptions, AccessLogType, ContractSignatureUpdate } from '@/types/shared-content';
import { logContentAccess } from './utils';

/**
 * Obtiene un contrato por su URL compartida
 */
export const fetchContractBySharedUrl = async (sharedUrl: string): Promise<SharedContractResponse> => {
  try {
    const { data, error } = await supabase
      .from('shared_content')
      .select('*')
      .eq('shared_url', sharedUrl)
      .eq('content_type', 'contract')
      .single();
    
    if (error) {
      console.error('Error fetching contract by shared URL:', error);
      return { data: null, error };
    }
    
    return { data: data as SharedContract, error: null };
  } catch (error: any) {
    console.error('Error fetching contract by shared URL:', error);
    return { data: null, error };
  }
};

/**
 * Verifica si un contrato existe
 */
export const checkContractExists = async (sharedUrl: string): Promise<{ exists: boolean; error: Error | null }> => {
  try {
    const { data, error } = await supabase.from('shared_content')
      .select('id')
      .eq('shared_url', sharedUrl)
      .eq('content_type', 'contract')
      .limit(1)
      .single();
      
    if (error) {
      console.error('Error checking contract existence:', error);
      return { exists: false, error };
    }
    
    return { exists: !!data, error: null };
  } catch (error: any) {
    console.error('Error checking contract existence:', error);
    return { exists: false, error };
  }
};

/**
 * Registra el acceso a un contrato compartido
 */
export const logContractAccess = async (
  contractId: string,
  options: AccessLogOptions,
  eventType: AccessLogType = 'view'
): Promise<void> => {
  await logContentAccess('contract', contractId, options, eventType);
};

/**
 * Update a shared contract with signature information
 */
export const updateContractWithSignature = async (
  contractId: string, 
  signatureData: ContractSignatureUpdate
): Promise<boolean> => {
  try {
    // Update using the RPC function
    const { data, error } = await supabase.rpc('update_shared_contract_with_signature', {
      shared_url_param: contractId,
      client_signed_param: signatureData.client_signed,
      client_signed_at_param: signatureData.client_signed_at,
      client_signature_param: signatureData.client_signature,
      status_param: signatureData.status
    });
    
    if (error) {
      console.error('Error updating contract with signature:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error in updateContractWithSignature:', err);
    return false;
  }
};
