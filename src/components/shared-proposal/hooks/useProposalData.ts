
import { useState, useEffect } from 'react';
import { SharedProposal, AccessLogOptions } from '@/types/shared-content';
import { 
  fetchProposalBySharedUrl, 
  checkProposalExists, 
  checkProposalPassword, 
  verifyProposalPassword, 
  logProposalAccess 
} from '@/api/shared-content';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

export const useProposalData = (proposalId?: string) => {
  const [proposal, setProposal] = useState<SharedProposal | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState<boolean>(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState<boolean>(false);
  const params = useParams<{ proposalId: string }>();
  
  // Use the proposalId from props or from route params
  const id = proposalId || params.proposalId;

  const fetchProposal = async (password?: string) => {
    if (!id) {
      setError('Invalid proposal ID');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Check if proposal exists
      const { exists, error: existsError } = await checkProposalExists(id);
      
      if (existsError) {
        throw existsError;
      }
      
      if (!exists) {
        setError('Proposal not found');
        setLoading(false);
        
        const options: AccessLogOptions = { 
          successful: false, 
          error: 'Proposal not found' 
        };
        logProposalAccess(id, options, 'check');
        return;
      }

      // Check if password protected
      const { isProtected, error: protectedError } = await checkProposalPassword(id);
      
      if (protectedError) {
        throw protectedError;
      }
      
      setIsPasswordProtected(isProtected);
      
      // If not password protected or password is already verified, fetch proposal
      if (!isProtected || isPasswordVerified || password) {
        const { proposal, error: fetchError } = await fetchProposalBySharedUrl(id);
        
        if (fetchError) {
          throw fetchError;
        }
        
        if (proposal) {
          setProposal(proposal);
          
          // Log successful access
          const options: AccessLogOptions = { successful: true };
          logProposalAccess(id, options, 'view');
        } else {
          setError('Proposal not found');
          
          // Log failed access
          const options: AccessLogOptions = { 
            successful: false, 
            error: 'Proposal data not found' 
          };
          logProposalAccess(id, options, 'data_not_found');
        }
      }
    } catch (err: any) {
      console.error('Error fetching proposal:', err);
      setError(err.message || 'Failed to load proposal');
      
      // Log error
      const options: AccessLogOptions = { 
        successful: false, 
        error: err.message || 'Unknown error' 
      };
      logProposalAccess(id, options, 'error');
    } finally {
      setLoading(false);
    }
  };

  const verifyPassword = async (password: string): Promise<boolean> => {
    if (!id) return false;

    try {
      const verified = await verifyProposalPassword(id, password);
      
      if (verified) {
        setIsPasswordVerified(true);
        await fetchProposal(password);
        return true;
      } else {
        toast.error('Invalid password');
        return false;
      }
    } catch (err) {
      console.error('Error verifying password:', err);
      toast.error('Error verifying password');
      return false;
    }
  };

  useEffect(() => {
    if (id) {
      fetchProposal();
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  return {
    proposal,
    loading,
    error,
    isPasswordProtected,
    isPasswordVerified,
    verifyPassword,
    handlePrint
  };
};

export default useProposalData;
