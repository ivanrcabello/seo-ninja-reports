
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
    
    // Try using the function get_public_contract_by_shared_url first
    const { data, error } = await supabase
      .rpc('get_public_contract_by_shared_url', {
        shared_url_param: sharedUrl
      });
      
    if (error) {
      // If the function fails, try a direct query
      console.log('RPC function failed, trying direct query:', error);
      const { data: directData, error: directError } = await supabase
        .from('client_contracts')
        .select(`
          id, 
          title, 
          content, 
          status, 
          client_signed, 
          client_signed_at, 
          client_signature, 
          admin_signed, 
          admin_signed_at, 
          admin_signature,
          shared_url,
          created_at,
          updated_at,
          clients (name, website)
        `)
        .eq('shared_url', sharedUrl)
        .single();
      
      if (directError) {
        throw directError;
      }
      
      if (!directData) {
        return { contract: null, error: null };
      }
      
      const contract: SharedContract = {
        id: directData.id,
        title: directData.title,
        content: directData.content,
        status: directData.status,
        client_name: directData.clients?.name,
        client_website: directData.clients?.website,
        client_signed: directData.client_signed,
        client_signed_at: directData.client_signed_at,
        client_signature: directData.client_signature,
        admin_signed: directData.admin_signed,
        admin_signed_at: directData.admin_signed_at,
        admin_signature: directData.admin_signature,
        created_at: directData.created_at,
        updated_at: directData.updated_at,
        shared_url: directData.shared_url
      };
      
      console.log('Contract data:', contract);
      return { contract, error: null };
    }
    
    if (!data) {
      console.log('No contract found for shared URL:', sharedUrl);
      return { contract: null, error: null };
    }
    
    console.log('Contract found via RPC:', data);
    
    const contract: SharedContract = {
      id: data.id,
      title: data.title,
      content: data.content,
      status: data.status,
      client_name: data.client_name,
      client_website: data.client_website,
      client_signed: data.client_signed,
      client_signed_at: data.client_signed_at,
      client_signature: data.client_signature,
      admin_signed: data.admin_signed,
      admin_signed_at: data.admin_signed_at,
      admin_signature: data.admin_signature,
      created_at: data.created_at,
      updated_at: data.updated_at,
      shared_url: data.shared_url
    };
    
    return { contract, error: null };
  } catch (error: any) {
    console.error('Error fetching contract by shared URL:', error);
    return { contract: null, error };
  }
};

/**
 * Update contract signature by shared URL
 */
export const updateContractSignature = async (sharedUrl: string, signature: string): Promise<{ success: boolean, error: Error | null }> => {
  try {
    const now = new Date().toISOString();
    
    // Use RPC function for the update
    const { data, error } = await supabase.rpc(
      'update_contract_by_shared_url',
      {
        shared_url_param: sharedUrl,
        client_signed_param: true,
        client_signed_at_param: now,
        client_signature_param: signature,
        status_param: 'signed'
      }
    );
    
    if (error) {
      throw error;
    }
    
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Error updating contract signature:', error);
    return { success: false, error };
  }
};
