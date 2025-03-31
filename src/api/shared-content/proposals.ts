
import { supabase } from '@/integrations/supabase/client';
import { SharedProposal } from '@/types/shared-content';
import { logContentAccess, checkContentExists, checkContentPasswordProtection, verifyContentPassword } from './utils';

/**
 * Check if a proposal exists
 */
export const checkProposalExists = async (proposalId: string): Promise<{ exists: boolean, error: Error | null }> => {
  return checkContentExists(proposalId, 'proposal');
};

/**
 * Check if a proposal is password protected
 */
export const checkProposalPassword = async (proposalId: string): Promise<{ isProtected: boolean, error: Error | null }> => {
  return checkContentPasswordProtection(proposalId, 'proposal');
};

/**
 * Verify a proposal's password
 */
export const verifyProposalPassword = async (proposalId: string, password: string): Promise<boolean> => {
  return verifyContentPassword(proposalId, 'proposal', password);
};

/**
 * Log proposal access
 */
export const logProposalAccess = (proposalId: string, options: any, eventType: string = 'access') => {
  return logContentAccess(proposalId, 'proposal', options, eventType);
};

/**
 * Fetch proposal by shared URL
 */
export const fetchProposalBySharedUrl = async (sharedUrl: string): Promise<{ proposal: SharedProposal | null, error: Error | null }> => {
  try {
    console.log('Fetching proposal with shared URL:', sharedUrl);
    
    const { data, error } = await supabase.rpc('get_proposal_by_shared_url', {
      shared_url_param: sharedUrl
    });
    
    if (error) throw error;
    
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return { proposal: null, error: new Error('Proposal not found') };
    }
    
    // Handle the case when data is an array
    const proposalData = Array.isArray(data) ? data[0] : data;
    
    // Create a properly typed proposal object
    const proposal: SharedProposal = {
      id: proposalData.id,
      title: proposalData.title,
      description: proposalData.description,
      services: proposalData.services,
      price: proposalData.price,
      status: proposalData.status,
      created_at: proposalData.created_at,
      updated_at: proposalData.updated_at,
      shared_url: proposalData.shared_url,
      client_name: proposalData.client_name,
      client_website: proposalData.client_website
    };
    
    // Log successful access
    logProposalAccess(sharedUrl, { successful: true, source: 'rpc' }, 'view');
    
    return { proposal, error: null };
  } catch (error: any) {
    console.error('Error fetching proposal:', error);
    
    // Log failed access
    logProposalAccess(sharedUrl, { successful: false, error: error.message }, 'error');
    
    return { proposal: null, error };
  }
};
