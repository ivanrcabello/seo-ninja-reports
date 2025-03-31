
import { supabase } from '@/integrations/supabase/client';
import { SharedContract, SharedContractResponse, AccessLogOptions, AccessLogType, ContractSignatureUpdate } from '@/types/shared-content';
import { logContentAccess, checkContentExists } from './utils';
import { logError } from '@/lib/errorLogger';

/**
 * Alias para checkContentExists específico para contratos
 */
export const checkContractExists = async (contractId: string): Promise<{ exists: boolean; error: Error | null }> => {
  return checkContentExists(contractId, 'contract');
};

/**
 * Alias para logContentAccess específico para contratos
 */
export const logContractAccess = (contractId: string, options: AccessLogOptions, eventType: AccessLogType = 'view') => {
  return logContentAccess('contract', contractId, options, eventType);
};

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
      .maybeSingle();
      
    if (error) {
      logError('fetchContractBySharedUrl', error);
      throw error;
    }
    
    if (!data) {
      logContractAccess(sharedUrl, { 
        successful: false, 
        error: 'Contract not found' 
      }, 'not_found');
      
      return { data: null, error: new Error('Contract not found') };
    }
    
    // Parse content
    const content = data.content || {};
    
    // Mapear a la estructura de SharedContract
    const contract: SharedContract = {
      id: data.id,
      original_id: data.original_id,
      content_type: 'contract',
      title: data.title,
      content: content.contract_content || content.content || '',
      status: data.status,
      shared_url: data.shared_url,
      client_name: data.client_name,
      client_website: data.client_website,
      client_signed: content.client_signed || false,
      client_signed_at: content.client_signed_at,
      client_signature: content.client_signature,
      admin_signed: content.admin_signed || false,
      admin_signed_at: content.admin_signed_at,
      admin_signature: content.admin_signature,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    
    // Registrar acceso exitoso
    logContractAccess(sharedUrl, { successful: true }, 'view');
    
    return { data: contract, error: null };
  } catch (error: any) {
    logError('fetchContractBySharedUrl', error);
    
    // Registrar acceso fallido
    logContractAccess(sharedUrl, { 
      successful: false, 
      error: error.message || 'Unknown error' 
    }, 'error');
    
    return { data: null, error };
  }
};

/**
 * Actualiza un contrato con información de firma
 */
export const updateContractWithSignature = async (
  contractId: string,
  signatureData: ContractSignatureUpdate
): Promise<{ success: boolean, error?: Error }> => {
  try {
    const { data, error } = await supabase.rpc('update_shared_contract_with_signature', {
      shared_url_param: contractId,
      client_signed_param: signatureData.client_signed,
      client_signed_at_param: signatureData.client_signed_at,
      client_signature_param: signatureData.client_signature,
      status_param: signatureData.status || 'signed'
    });
    
    if (error) throw error;
    
    return { success: !!data };
  } catch (error: any) {
    logError('updateContractWithSignature', error);
    return { success: false, error };
  }
};
