
import { useState, useEffect } from 'react';
import { SharedProposal, SharedProposalResponse } from '@/types/shared-content';
import { fetchProposalBySharedUrl, verifyProposalPassword, logProposalAccess } from '@/api/shared-content/proposals';

interface UseProposalDataResult {
  proposal: SharedProposal | null;
  isLoading: boolean;
  error: string | null;
  isPasswordProtected: boolean;
  accessGranted: boolean;
  verifyPassword: (password: string) => Promise<boolean>;
}

export const useProposalData = (proposalId: string): UseProposalDataResult => {
  const [proposal, setProposal] = useState<SharedProposal | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState<boolean>(false);
  const [accessGranted, setAccessGranted] = useState<boolean>(false);

  useEffect(() => {
    const loadProposal = async () => {
      if (!proposalId) {
        setError('Proposal ID is required');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response: SharedProposalResponse = await fetchProposalBySharedUrl(proposalId);
        
        if (response.error) {
          throw response.error;
        }

        if (response.data) {
          setProposal(response.data);
          
          // Check if proposal is password protected
          const passwordProtected = !!response.data.password;
          setIsPasswordProtected(passwordProtected);
          
          if (!passwordProtected) {
            setAccessGranted(true);
          }
          
          // Log access
          logProposalAccess(proposalId, { 
            successful: true 
          }, 'view');
        } else {
          logProposalAccess(proposalId, { 
            successful: false,
            error: 'Proposal not found' 
          }, 'not_found');
          
          throw new Error('Proposal not found');
        }
      } catch (err: any) {
        setError(err.message || 'Error al cargar la propuesta');
        console.error('Error loading proposal:', err);
        
        logProposalAccess(proposalId, { 
          successful: false,
          error: err.message || 'Unknown error' 
        }, 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadProposal();
  }, [proposalId]);

  const verifyPassword = async (password: string): Promise<boolean> => {
    try {
      const isValid = await verifyProposalPassword(proposalId, password);
      
      if (isValid) {
        setAccessGranted(true);
        
        // Log successful password attempt
        logProposalAccess(proposalId, { 
          successful: true 
        }, 'password');
      } else {
        // Log failed password attempt
        logProposalAccess(proposalId, { 
          successful: false,
          error: 'Invalid password' 
        }, 'password');
      }
      
      return isValid;
    } catch (err) {
      console.error('Error verifying password:', err);
      return false;
    }
  };

  return {
    proposal,
    isLoading,
    error,
    isPasswordProtected,
    accessGranted,
    verifyPassword
  };
};
