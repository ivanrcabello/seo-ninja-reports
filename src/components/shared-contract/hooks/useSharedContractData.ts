
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client'; 
import { ContractSignatureUpdate, SharedContract } from '@/types/shared-content';
import { 
  fetchContractBySharedUrl, 
  checkContractExists, 
  logContractAccess,
  updateContractWithSignature
} from '@/api/shared-content/contracts';

export const useSharedContractData = (contractId: string) => {
  const [contract, setContract] = useState<SharedContract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signing, setSigning] = useState(false);

  const fetchContract = useCallback(async () => {
    if (!contractId) {
      setError('ID de contrato no especificado');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Check if contract exists
      const { exists, error: existsError } = await checkContractExists(contractId);
      
      if (existsError) {
        console.error('Error checking contract existence:', existsError);
        throw existsError;
      }
      
      if (!exists) {
        throw new Error('El contrato no existe');
      }

      // Fetch contract data
      const { data, error: fetchError } = await fetchContractBySharedUrl(contractId);
      
      if (fetchError) {
        throw fetchError;
      }
      
      if (!data) {
        throw new Error('No se pudo encontrar el contrato solicitado');
      }
      
      setContract(data);
      
      // Log access
      logContractAccess(contractId, { successful: true }, 'view');
    } catch (err: any) {
      console.error('Error fetching contract:', err);
      setError(err.message || 'Error al cargar el contrato');
      logContractAccess(contractId, { successful: false, error: err.message || 'Unknown error' }, 'error');
    } finally {
      setLoading(false);
    }
  }, [contractId]);

  const signContract = async (signature: string): Promise<boolean> => {
    if (!contract || !contractId) return false;
    
    try {
      setSigning(true);
      
      const signatureData: ContractSignatureUpdate = {
        client_signed: true,
        client_signed_at: new Date().toISOString(),
        client_signature: signature,
        status: 'signed'
      };
      
      const success = await updateContractWithSignature(contractId, signatureData);
      
      if (success) {
        // Log success
        logContractAccess(contractId, { 
          successful: true,
          action: 'sign'
        }, 'sign');
        
        // Update local state
        setContract(prev => prev ? {
          ...prev,
          client_signed: true,
          client_signed_at: signatureData.client_signed_at,
          client_signature: signature,
          status: 'signed'
        } : null);
        
        return true;
      } else {
        // Log failure
        logContractAccess(contractId, {
          successful: false,
          action: 'sign',
          error: 'Failed to update signature'
        }, 'error');
        
        return false;
      }
    } catch (error: any) {
      console.error('Error signing contract:', error);
      
      // Log error
      logContractAccess(contractId, {
        successful: false,
        action: 'sign',
        error: error.message || 'Unknown error'
      }, 'error');
      
      return false;
    } finally {
      setSigning(false);
    }
  };

  useEffect(() => {
    fetchContract();
  }, [fetchContract]);

  return {
    contract,
    loading,
    error,
    signing,
    signContract,
    refetch: fetchContract
  };
};
