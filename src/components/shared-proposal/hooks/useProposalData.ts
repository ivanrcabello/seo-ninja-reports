
import { useState, useEffect, useCallback } from 'react';
import { SharedProposal } from '@/types/shared-content';
import { 
  fetchProposalBySharedUrl,
  checkProposalExists, 
  checkProposalPassword,
  verifyProposalPassword,
  logProposalAccess
} from '@/api/shared-content';

export const useProposalData = (sharedUrl: string) => {
  const [proposal, setProposal] = useState<SharedProposal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);

  const fetchProposal = useCallback(async () => {
    if (!sharedUrl) {
      setError('URL de propuesta no proporcionada');
      setIsLoading(false);
      return;
    }

    console.log(`Starting fetch for proposal with shared URL: ${sharedUrl}`);
    setIsLoading(true);
    setError(null);

    try {
      // First check if proposal exists
      const { exists, error: existsError } = await checkProposalExists(sharedUrl);
      
      if (existsError) {
        console.error('Error checking if proposal exists:', existsError);
      } else if (!exists) {
        setError('La propuesta no existe');
        setIsLoading(false);
        logProposalAccess(sharedUrl, { successful: false, error: 'Proposal not found' }, 'check');
        return;
      }
      
      // Check password protection
      const { isProtected, error: passwordError } = await checkProposalPassword(sharedUrl);
      
      if (passwordError) {
        console.error('Error checking proposal password:', passwordError);
      } else {
        setIsPasswordProtected(isProtected);
        console.log(`Proposal is password protected: ${isProtected}`);
        
        // If password protected and access not granted, don't fetch content yet
        if (isProtected && !accessGranted) {
          setIsLoading(false);
          return;
        }
      }

      // Fetch proposal data
      const { proposal: proposalData, error: fetchError } = await fetchProposalBySharedUrl(sharedUrl);
      
      if (fetchError) {
        throw fetchError;
      }
      
      if (!proposalData) {
        setError('No se pudo encontrar la propuesta solicitada');
        logProposalAccess(sharedUrl, { successful: false, error: 'Proposal data not found' }, 'data_not_found');
      } else {
        setProposal(proposalData);
        logProposalAccess(sharedUrl, { successful: true }, 'view');
      }
    } catch (err: any) {
      console.error('Error fetching shared proposal:', err);
      setError(err.message || 'Error al cargar la propuesta');
      
      // Log error
      logProposalAccess(sharedUrl, { successful: false, error: err.message || 'Unknown error' }, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [sharedUrl, accessGranted]);

  const verifyPassword = async (password: string): Promise<boolean> => {
    try {
      const success = await verifyProposalPassword(sharedUrl, password);
      
      if (success) {
        setAccessGranted(success);
      }
      
      return success;
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  };

  useEffect(() => {
    if (sharedUrl) {
      fetchProposal();
    }
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
