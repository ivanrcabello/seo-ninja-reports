
import { useState, useEffect, useCallback } from 'react';
import { SharedContract } from '@/types/shared-content';
import { 
  fetchContractBySharedUrl, 
  checkContractExists,
  logContractAccess,
  updateContractWithSignature
} from '@/api/shared-content';

export const useSharedContractData = (sharedUrl: string) => {
  const [contract, setContract] = useState<SharedContract | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSigning, setIsSigning] = useState(false);

  const fetchContract = useCallback(async () => {
    if (!sharedUrl) {
      setError('URL de contrato no proporcionada');
      setIsLoading(false);
      return;
    }

    console.log(`Starting fetch for contract with shared URL: ${sharedUrl}`);
    setIsLoading(true);
    setError(null);

    try {
      // First check if contract exists
      const { exists, error: existsError } = await checkContractExists(sharedUrl);
      
      if (existsError) {
        console.error('Error checking if contract exists:', existsError);
      } else if (!exists) {
        setError('El contrato no existe');
        setIsLoading(false);
        logContractAccess(sharedUrl, { successful: false, error: 'Contract not found' }, 'check');
        return;
      }

      // Fetch contract data
      const { contract: contractData, error: fetchError } = await fetchContractBySharedUrl(sharedUrl);
      
      if (fetchError) {
        throw fetchError;
      }
      
      if (!contractData) {
        throw new Error('No se pudo encontrar el contrato solicitado');
      }
      
      setContract(contractData);
      logContractAccess(sharedUrl, { successful: true }, 'view');
      
    } catch (err: any) {
      console.error('Error fetching shared contract:', err);
      setError(err.message || 'Error al cargar el contrato');
      logContractAccess(sharedUrl, { successful: false, error: err.message || 'Unknown error' }, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [sharedUrl]);

  const signContract = async (signature: string): Promise<{ success: boolean, error?: string }> => {
    try {
      setIsSigning(true);
      
      const { success, error: signError } = await updateContractWithSignature(sharedUrl, signature);
      
      if (signError) {
        throw signError;
      }
      
      if (!success) {
        throw new Error('No se pudo firmar el contrato');
      }
      
      // Re-fetch contract to update state
      await fetchContract();
      
      return { success: true };
    } catch (err: any) {
      console.error('Error signing contract:', err);
      return { success: false, error: err.message || 'Error al firmar el contrato' };
    } finally {
      setIsSigning(false);
    }
  };

  useEffect(() => {
    fetchContract();
  }, [fetchContract]);

  return {
    contract,
    isLoading,
    error,
    isSigning,
    signContract,
    refetch: fetchContract
  };
};
