
import { useState, useEffect, useCallback } from 'react';
import { SharedContract, ContractSignatureUpdate, AccessLogOptions, AccessLogType, SharedContractResponse } from '@/types/shared-content';
import { 
  fetchContractBySharedUrl, 
  checkContentExists,
  logContentAccess,
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
      const { exists, error: existsError } = await checkContentExists(sharedUrl, 'contract');
      
      if (existsError) {
        console.error('Error checking if contract exists:', existsError);
      } else if (!exists) {
        setError('El contrato no existe');
        setIsLoading(false);
        
        const options: AccessLogOptions = { 
          successful: false, 
          error: 'Contract not found' 
        };
        logContentAccess('contract', sharedUrl, options, 'check');
        return;
      }

      // Fetch contract data
      const response: SharedContractResponse = await fetchContractBySharedUrl(sharedUrl);
      
      if (response.error) {
        throw response.error;
      }
      
      if (!response.data) {
        throw new Error('No se pudo encontrar el contrato solicitado');
      }
      
      setContract(response.data);
      
      // Log successful access
      const options: AccessLogOptions = { successful: true };
      logContentAccess('contract', sharedUrl, options, 'view');
      
    } catch (err: any) {
      console.error('Error fetching shared contract:', err);
      setError(err.message || 'Error al cargar el contrato');
      
      // Log failed access
      const options: AccessLogOptions = { 
        successful: false, 
        error: err.message || 'Unknown error' 
      };
      logContentAccess('contract', sharedUrl, options, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [sharedUrl]);

  const signContract = async (signature: string): Promise<{ success: boolean, error?: string }> => {
    try {
      setIsSigning(true);
      
      const now = new Date().toISOString();
      const signatureData: ContractSignatureUpdate = {
        client_signed: true,
        client_signed_at: now,
        client_signature: signature
      };
      
      const { success, error: signError } = await updateContractWithSignature(sharedUrl, signatureData);
      
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
