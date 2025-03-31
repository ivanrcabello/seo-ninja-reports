
import { useState } from 'react';
import { updateContractWithSignature } from '@/api/shared-content';
import { PublicContract } from './types';
import { toast } from 'sonner';
import { SharedContentStatus, ContractSignatureUpdate } from '@/types/shared-content';

export const useContractActions = (initialContract: PublicContract | null) => {
  const [contract, setContract] = useState<PublicContract | null>(initialContract);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const refreshContract = (newContract: PublicContract) => {
    setContract(newContract);
  };
  
  const signContract = async (signature: string) => {
    if (!contract) {
      setError('No contract loaded');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const now = new Date().toISOString();
      
      // Optimistically update the UI
      setContract(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          status: "signed" as SharedContentStatus,
          client_signed: true,
          client_signed_at: now,
          client_signature: signature
        };
      });
      
      // Send to API
      if (contract.shared_url) {
        const signatureData: ContractSignatureUpdate = {
          client_signed: true,
          client_signed_at: now,
          client_signature: signature
        };
        
        await updateContractWithSignature(contract.shared_url, signatureData);
        toast.success('Contrato firmado exitosamente');
      }
    } catch (err: any) {
      console.error('Error signing contract:', err);
      setError(err.message || 'Failed to sign contract');
      toast.error('Error al firmar el contrato');
      
      // Revert optimistic update if there was an error
      setContract(initialContract);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  return {
    contract,
    loading,
    error,
    signContract,
    refreshContract,
    handlePrint
  };
};

export default useContractActions;
