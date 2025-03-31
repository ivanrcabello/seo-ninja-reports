
import { useState, useEffect } from 'react';
import { PublicContract } from '../types';
import { fetchContractBySharedUrl, updateContractWithSignature } from '@/api/shared-content';
import { useParams } from 'react-router-dom';
import { checkContentExists, checkContentPasswordProtection, verifyContentPassword } from '@/api/shared-content';
import { toast } from 'sonner';
import { SharedContentStatus } from '@/types/shared-content';

export const useContractData = () => {
  const [contract, setContract] = useState<PublicContract | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState<boolean>(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState<boolean>(false);
  const [isSignDialogOpen, setIsSignDialogOpen] = useState<boolean>(false);
  const { contractId } = useParams<{ contractId: string }>();

  const fetchContract = async (password?: string) => {
    if (!contractId) {
      setError('Invalid contract ID');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Check if contract exists and is password protected
      const { exists } = await checkContentExists(contractId, 'contract');
      
      if (!exists) {
        setError('Contract not found');
        setLoading(false);
        return;
      }
      
      // For contracts, we currently don't use password protection
      // But the infrastructure is here if needed in the future
      setIsPasswordProtected(false);
      setIsPasswordVerified(true);
      
      // Fetch contract data
      const contractData = await fetchContractBySharedUrl(contractId);
      
      if (!contractData) {
        setError('Contract not found');
      } else {
        setContract(contractData);
      }
    } catch (err: any) {
      console.error('Error fetching contract:', err);
      setError(err.message || 'Failed to load contract');
    } finally {
      setLoading(false);
    }
  };

  const verifyPassword = async (password: string) => {
    if (!contractId) return false;

    try {
      const verified = await verifyContentPassword(contractId, 'contract', password);
      
      if (verified) {
        setIsPasswordVerified(true);
        await fetchContract(password);
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

  const signContract = async (signature: string) => {
    if (!contract || !contractId) return;

    try {
      toast.loading('Firmando contrato...');
      
      const now = new Date().toISOString();
      
      // Update contract locally first for immediate UI feedback
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
      
      // Update contract in the database
      await updateContractWithSignature(contractId, {
        client_signed: true,
        client_signed_at: now,
        client_signature: signature
      });
      
      toast.dismiss();
      toast.success('Contrato firmado exitosamente');
    } catch (err: any) {
      console.error('Error signing contract:', err);
      toast.dismiss();
      toast.error('Error al firmar el contrato. Por favor, inténtelo de nuevo más tarde.');
      
      // Revert optimistic update
      fetchContract();
    }
  };

  useEffect(() => {
    if (contractId) {
      fetchContract();
    }
  }, [contractId]);

  const handlePrint = () => {
    window.print();
  };

  const openSignDialog = () => {
    setIsSignDialogOpen(true);
  };

  const closeSignDialog = () => {
    setIsSignDialogOpen(false);
  };

  return {
    contract,
    loading,
    error,
    isPasswordProtected,
    isPasswordVerified,
    verifyPassword,
    signContract,
    handlePrint,
    openSignDialog,
    closeSignDialog,
    isSignDialogOpen,
    setIsSignDialogOpen
  };
};

export default useContractData;
