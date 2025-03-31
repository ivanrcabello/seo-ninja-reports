
import { supabase } from '@/integrations/supabase/client';
import { SharedProposal, SharedProposalResponse, AccessLogOptions, AccessLogType } from '@/types/shared-content';
import { logContentAccess } from './utils';

/**
 * Obtiene una propuesta por su URL compartida
 */
export const fetchProposalBySharedUrl = async (sharedUrl: string): Promise<SharedProposalResponse> => {
  try {
    const { data, error } = await supabase
      .from('shared_content')
      .select('*')
      .eq('shared_url', sharedUrl)
      .eq('content_type', 'proposal')
      .single();
    
    if (error) {
      console.error('Error fetching proposal by shared URL:', error);
      return { data: null, error };
    }
    
    return { data: data as SharedProposal, error: null };
  } catch (error: any) {
    console.error('Error fetching proposal by shared URL:', error);
    return { data: null, error };
  }
};

/**
 * Verifica si una propuesta existe
 */
export const checkProposalExists = async (proposalId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('check_shared_content_exists', {
      content_id: proposalId,
      content_type: 'proposal'
    });
    
    return !!data;
  } catch (error) {
    console.error('Error checking proposal existence:', error);
    return false;
  }
};

/**
 * Verifica si una propuesta está protegida con contraseña
 */
export const checkProposalPassword = async (proposalId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('check_shared_content_password', {
      content_id: proposalId,
      content_type: 'proposal'
    });
    
    return !!data;
  } catch (error) {
    console.error('Error checking proposal password protection:', error);
    return false;
  }
};

/**
 * Verifica la contraseña de una propuesta
 */
export const verifyProposalPassword = async (proposalId: string, password: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('verify_shared_content_password', {
      content_id: proposalId,
      content_type: 'proposal',
      password_param: password
    });
    
    return !!data;
  } catch (error) {
    console.error('Error verifying proposal password:', error);
    return false;
  }
};

/**
 * Registra acceso a una propuesta compartida
 */
export const logProposalAccess = async (
  proposalId: string,
  options: AccessLogOptions,
  eventType: AccessLogType = 'view'
): Promise<void> => {
  await logContentAccess('proposal', proposalId, options, eventType);
};
