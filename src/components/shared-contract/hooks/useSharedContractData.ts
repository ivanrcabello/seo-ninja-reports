
import { useState, useEffect } from 'react';
import { SharedContract, SharedContractResponse } from '@/types/shared-content';
import { fetchContractBySharedUrl, logContractAccess } from '@/api/shared-content/contracts';

interface UseSharedContractDataResult {
  contract: SharedContract | null;
  isLoading: boolean;
  error: string | null;
  signContract: (signature: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export const useSharedContractData = (contractId: string): UseSharedContractDataResult => {
  const [contract, setContract] = useState<SharedContract | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadContract = async () => {
    if (!contractId) {
      setError('Contract ID is required');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response: SharedContractResponse = await fetchContractBySharedUrl(contractId);
      
      if (response.error) {
        throw response.error;
      }

      if (response.data) {
        setContract(response.data);
        
        // Log access
        logContractAccess(contractId, { 
          successful: true 
        }, 'view');
      } else {
        logContractAccess(contractId, { 
          successful: false,
          error: 'Contract not found' 
        }, 'not_found');
        
        throw new Error('Contract not found');
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar el contrato');
      console.error('Error loading contract:', err);
      
      logContractAccess(contractId, { 
        successful: false,
        error: err.message || 'Unknown error' 
      }, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContract();
  }, [contractId]);

  const signContract = async (signature: string): Promise<boolean> => {
    if (!contract) return false;
    
    try {
      // Call the signSharedContract function from API (we'll implement this)
      const signData = {
        client_signed: true,
        client_signed_at: new Date().toISOString(),
        client_signature: signature,
        status: 'signed' as const
      };
      
      // Update the contract in the database
      const { error } = await supabase
        .from('shared_content')
        .update(signData)
        .eq('shared_url', contractId);
        
      if (error) throw error;
      
      // Log successful signing
      logContractAccess(contractId, { 
        successful: true 
      }, 'sign');
      
      // Update local contract state
      await loadContract();
      
      return true;
    } catch (err) {
      console.error('Error signing contract:', err);
      
      // Log failed signing
      logContractAccess(contractId, { 
        successful: false,
        error: 'Failed to sign contract' 
      }, 'sign');
      
      return false;
    }
  };

  return {
    contract,
    isLoading,
    error,
    signContract,
    refetch: loadContract
  };
};
