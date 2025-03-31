
import { useState, useEffect, useCallback } from 'react';
import { SharedContract } from '@/types/shared-content';
import { 
  fetchContractBySharedUrl, 
  updateContractSignature,
  checkContractExists, 
  checkContractPassword,
  verifyContractPassword,
  logContractAccess
} from '@/api/shared-content';

export const useContractData = (sharedUrl: string) => {
  const [contract, setContract] = useState<SharedContract | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);

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
        throw existsError;
      }
      
      if (!exists) {
        setError('El contrato no existe');
        setIsLoading(false);
        logContractAccess(sharedUrl, { successful: false, error: 'Contract not found' }, 'check');
        return;
      }
      
      // Check password protection
      const { isProtected, error: passwordError } = await checkContractPassword(sharedUrl);
      
      if (passwordError) {
        console.error('Error checking contract password:', passwordError);
        throw passwordError;
      } 
      
      setIsPasswordProtected(isProtected);
      console.log(`Contract is password protected: ${isProtected}`);
      
      // If password protected and access not granted, don't fetch content yet
      if (isProtected && !accessGranted) {
        setIsLoading(false);
        return;
      }

      // Fetch contract data
      const { contract: contractData, error: fetchError } = await fetchContractBySharedUrl(sharedUrl);
      
      if (fetchError) {
        throw fetchError;
      }
      
      if (!contractData) {
        setError('No se pudo encontrar el contrato solicitado');
        logContractAccess(sharedUrl, { successful: false, error: 'Contract data not found' }, 'data_not_found');
      } else {
        console.log('Contract data loaded successfully');
        setContract(contractData);
        logContractAccess(sharedUrl, { successful: true }, 'view');
        
        // Try to fetch logo from settings
        try {
          // This would be implemented in a real application
          // For now, just use a placeholder or nothing
          setLogo(null);
        } catch (logoErr) {
          console.error('Error fetching logo:', logoErr);
        }
      }
    } catch (err: any) {
      console.error('Error fetching shared contract:', err);
      setError(err.message || 'Error al cargar el contrato');
      
      // Log error
      logContractAccess(sharedUrl, { successful: false, error: err.message || 'Unknown error' }, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [sharedUrl, accessGranted]);

  const verifyPassword = async (password: string): Promise<boolean> => {
    try {
      const success = await verifyContractPassword(sharedUrl, password);
      
      if (success) {
        setAccessGranted(success);
        fetchContract();
      }
      
      return success;
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  };

  const signContract = async (signature: string): Promise<boolean> => {
    try {
      if (!contract) return false;
      
      const { success, error: signError } = await updateContractSignature(sharedUrl, signature);
      
      if (signError) {
        throw signError;
      }
      
      if (success) {
        // Update local state with the signed contract
        setContract(prev => {
          if (!prev) return null;
          return {
            ...prev,
            client_signed: true,
            client_signed_at: new Date().toISOString(),
            client_signature: signature,
            status: 'signed'
          };
        });
        
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error('Error signing contract:', err);
      return false;
    }
  };

  useEffect(() => {
    if (sharedUrl) {
      fetchContract();
    }
  }, [fetchContract]);

  return {
    contract,
    isLoading,
    error,
    isPasswordProtected,
    accessGranted,
    verifyPassword,
    signContract,
    refetch: fetchContract,
    logo
  };
};
