
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logSharedProposalAccess } from '@/utils/sharedContentLogger';

interface PublicProposal {
  id: string;
  title: string;
  description?: string;
  services?: any;
  status: string;
  price?: number;
  client_name: string;
  client_website?: string;
  created_at: string;
  updated_at: string;
  shared_url: string;
}

const useProposalData = (sharedUrlId: string | undefined) => {
  const [proposal, setProposal] = useState<PublicProposal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  
  const fetchProposal = useCallback(async () => {
    if (!sharedUrlId) {
      setError('URL de propuesta no válido');
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if proposal is password protected
      const { data: protectionData, error: protectionError } = await supabase.rpc(
        'check_proposal_password_protection',
        { shared_url_param: sharedUrlId }
      );
      
      if (protectionError) throw new Error(protectionError.message);
      
      setIsPasswordProtected(protectionData === true);
      
      // If password protected and access not granted, don't fetch content
      if (protectionData === true && !accessGranted) {
        setIsLoading(false);
        return;
      }
      
      // Try to fetch from client_proposals first
      const { data: proposalData, error: proposalError } = await supabase
        .from('client_proposals')
        .select('*, clients:client_id(name, website)')
        .eq('shared_url', sharedUrlId)
        .maybeSingle();
      
      // If not found, try public_proposals
      if (!proposalData || proposalError) {
        const { data: publicProposal, error: publicError } = await supabase
          .from('public_proposals')
          .select('*')
          .eq('shared_url', sharedUrlId)
          .maybeSingle();
        
        if (publicError) throw new Error(publicError.message);
        
        if (!publicProposal) {
          throw new Error('Propuesta no encontrada');
        }
        
        setProposal(publicProposal as PublicProposal);
        
        // Log successful access
        logSharedProposalAccess(sharedUrlId, { successful: true });
      } else {
        // Format data from client_proposals
        const formattedProposal = {
          ...proposalData,
          client_name: proposalData.clients?.name,
          client_website: proposalData.clients?.website
        };
        
        setProposal(formattedProposal as PublicProposal);
        
        // Log successful access
        logSharedProposalAccess(sharedUrlId, { successful: true });
      }
    } catch (err: any) {
      console.error('Error fetching proposal:', err);
      setError(err.message || 'Error al cargar la propuesta');
      
      // Log error
      logSharedProposalAccess(sharedUrlId, {
        successful: false,
        error: err.message
      });
    } finally {
      setIsLoading(false);
    }
  }, [sharedUrlId, accessGranted]);
  
  const verifyPassword = async (password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc(
        'verify_shared_proposal_password',
        {
          shared_url_param: sharedUrlId,
          password_param: password
        }
      );
      
      if (error) throw error;
      
      setAccessGranted(Boolean(data));
      
      // Log password attempt
      logSharedProposalAccess(sharedUrlId!, {
        passwordAttempt: true,
        successful: Boolean(data)
      });
      
      return Boolean(data);
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  };
  
  useEffect(() => {
    fetchProposal();
  }, [fetchProposal]);
  
  return {
    proposal,
    isLoading,
    error,
    isPasswordProtected,
    accessGranted,
    verifyPassword,
    refetch: fetchProposal
  };
};

export default useProposalData;
