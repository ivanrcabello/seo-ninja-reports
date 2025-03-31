
import { supabase } from '@/integrations/supabase/client';
import { SharedProposal, SharedProposalResponse, AccessLogOptions, AccessLogType } from '@/types/shared-content';
import { logContentAccess, checkContentExists, checkContentPasswordProtection, verifyContentPassword } from './utils';
import { logError } from '@/lib/errorLogger';
import { SharedContentRow } from '@/types/supabase-types';

/**
 * Alias para checkContentExists específico para propuestas
 */
export const checkProposalExists = async (proposalId: string): Promise<{ exists: boolean; error: Error | null }> => {
  return checkContentExists(proposalId, 'proposal');
};

/**
 * Alias para checkContentPasswordProtection específico para propuestas
 */
export const checkProposalPassword = async (proposalId: string): Promise<{ isProtected: boolean; error: Error | null }> => {
  return checkContentPasswordProtection(proposalId, 'proposal');
};

/**
 * Alias para verifyContentPassword específico para propuestas
 */
export const verifyProposalPassword = async (proposalId: string, password: string): Promise<boolean> => {
  return verifyContentPassword(proposalId, 'proposal', password);
};

/**
 * Alias para logContentAccess específico para propuestas
 */
export const logProposalAccess = (proposalId: string, options: AccessLogOptions, eventType: AccessLogType = 'view') => {
  return logContentAccess('proposal', proposalId, options, eventType);
};

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
      logError('fetchProposalBySharedUrl', error);
      throw error;
    }
    
    if (!data) {
      logProposalAccess(sharedUrl, { 
        successful: false, 
        error: 'Proposal not found' 
      }, 'not_found');
      
      return { data: null, error: new Error('Proposal not found') };
    }
    
    const rowData = data as SharedContentRow;
    
    // Parse content
    const contentObj = rowData.content || {};
    
    // Mapear a la estructura de SharedProposal
    const proposal: SharedProposal = {
      id: rowData.id,
      original_id: rowData.original_id,
      content_type: 'proposal',
      title: rowData.title,
      description: rowData.description || '',
      content: contentObj,
      status: rowData.status as any,
      shared_url: rowData.shared_url,
      client_name: rowData.client_name,
      client_website: rowData.client_website,
      services: contentObj.services || [],
      price: contentObj.price,
      created_at: rowData.created_at,
      updated_at: rowData.updated_at
    };
    
    // Registrar acceso exitoso
    logProposalAccess(sharedUrl, { successful: true }, 'view');
    
    return { data: proposal, error: null };
  } catch (error: any) {
    logError('fetchProposalBySharedUrl', error);
    
    // Registrar acceso fallido
    logProposalAccess(sharedUrl, { 
      successful: false, 
      error: error.message || 'Unknown error' 
    }, 'error');
    
    return { data: null, error };
  }
};
