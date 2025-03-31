
import { supabase } from '@/integrations/supabase/client';
import { SharedProposal } from '@/types/shared-content';
import { logContentAccess, checkContentExists, checkContentPasswordProtection, verifyContentPassword } from './utils';

/**
 * Fetch proposal by shared URL
 */
export const fetchProposalBySharedUrl = async (sharedUrl: string): Promise<{ proposal: SharedProposal | null, error: Error | null }> => {
  try {
    console.log('Fetching proposal with shared URL:', sharedUrl);
    
    const { data, error } = await supabase
      .from('public_proposals')
      .select('*')
      .eq('shared_url', sharedUrl)
      .maybeSingle();
    
    if (error) throw error;
    
    if (!data) {
      // Try to fetch directly from client_proposals if view doesn't work
      const { data: directData, error: directError } = await supabase
        .from('client_proposals')
        .select(`
          id, title, description, services, price, status, created_at, updated_at, shared_url,
          clients (
            name, website
          )
        `)
        .eq('shared_url', sharedUrl)
        .maybeSingle();
      
      if (directError) throw directError;
      
      if (!directData) {
        return { proposal: null, error: null };
      }
      
      const proposal: SharedProposal = {
        id: directData.id,
        title: directData.title,
        description: directData.description,
        services: directData.services,
        price: directData.price,
        status: directData.status,
        created_at: directData.created_at,
        updated_at: directData.updated_at,
        shared_url: directData.shared_url,
        client_name: directData.clients?.name,
        client_website: directData.clients?.website
      };
      
      // Log successful access
      logProposalAccess(sharedUrl, { successful: true, source: 'direct_table' }, 'view');
      
      return { proposal, error: null };
    }
    
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
    logProposalAccess(sharedUrl, { successful: true, source: 'public_view' }, 'view');
    
    return { proposal, error: null };
  } catch (error: any) {
    console.error('Error fetching proposal:', error);
    
    // Log failed access
    logProposalAccess(sharedUrl, { successful: false, error: error.message }, 'error');
    
    return { proposal: null, error };
  }
};

/**
 * Log proposal access
 */
export const logProposalAccess = (proposalId: string, options: any, eventType: string = 'access') => {
  return logContentAccess(proposalId, 'proposal', options, eventType);
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
 * Check if a proposal exists
 */
export const checkProposalExists = async (proposalId: string): Promise<{ exists: boolean, error: Error | null }> => {
  return checkContentExists(proposalId, 'proposal');
};
