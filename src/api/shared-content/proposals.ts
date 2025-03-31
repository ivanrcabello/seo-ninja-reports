
import { supabase } from '@/integrations/supabase/client';
import { SharedProposal, SharedProposalResponse, AccessLogOptions, AccessLogType } from '@/types/shared-content';
import { logContentAccess } from './utils';

/**
 * Check if a proposal exists
 */
export const checkProposalExists = async (proposalId: string): Promise<{ exists: boolean, error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('public_proposals')
      .select('id')
      .eq('shared_url', proposalId)
      .maybeSingle();
    
    if (error) throw error;
    
    return { exists: !!data, error: null };
  } catch (error: any) {
    console.error('Error checking if proposal exists:', error);
    return { exists: false, error };
  }
};

/**
 * Check if a proposal is password protected
 */
export const checkProposalPassword = async (proposalId: string): Promise<{ isProtected: boolean, error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('public_proposals')
      .select('password')
      .eq('shared_url', proposalId)
      .maybeSingle();
    
    if (error) throw error;
    
    // Check if data exists and password is not null or empty
    const isProtected = !!(data && data.password && data.password.trim() !== '');
    return { isProtected, error: null };
  } catch (error: any) {
    console.error('Error checking proposal password protection:', error);
    return { isProtected: false, error };
  }
};

/**
 * Log proposal access
 */
export const logProposalAccess = (proposalId: string, options: AccessLogOptions, eventType: AccessLogType = 'view') => {
  return logContentAccess('proposal', proposalId, options, eventType);
};

/**
 * Fetch proposal by shared URL
 */
export const fetchProposalBySharedUrl = async (sharedUrl: string): Promise<SharedProposalResponse> => {
  try {
    console.log('Fetching proposal with shared URL:', sharedUrl);
    
    const { data, error } = await supabase
      .from('public_proposals')
      .select('*')
      .eq('shared_url', sharedUrl)
      .maybeSingle();
    
    if (error) throw error;
    
    if (!data) {
      return { proposal: null, error: new Error('Proposal not found') };
    }
    
    // Create a properly typed proposal object
    const proposal: SharedProposal = {
      id: data.id,
      title: data.title,
      description: data.description,
      services: data.services,
      price: data.price,
      status: data.status,
      created_at: data.created_at,
      updated_at: data.updated_at,
      shared_url: data.shared_url,
      client_name: data.client_name,
      client_website: data.client_website
    };
    
    // Log successful access
    logProposalAccess(sharedUrl, { successful: true }, 'view');
    
    return { proposal, error: null };
  } catch (error: any) {
    console.error('Error fetching proposal:', error);
    
    // Log failed access
    logProposalAccess(sharedUrl, { successful: false, error: error.message }, 'error');
    
    return { proposal: null, error };
  }
};
