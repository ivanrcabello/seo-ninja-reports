
import { useState, useEffect } from 'react';
import { PublicContract } from '../types';
import { fetchContractBySharedUrl, updateContractWithSignature, checkContentExists, checkContentPasswordProtection, verifyContentPassword } from '@/api/shared-content';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { SharedContentStatus, ContractSignatureUpdate } from '@/types/shared-content';

export const useContractData = (contractId?: string) => {
  const [contract, setContract] = useState<PublicContract | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState<boolean>(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState<boolean>(false);
  const [isSignDialogOpen, setIsSignDialogOpen] = useState<boolean>(false);
  const params = useParams<{ contractId: string }>();
  
  // Use the contractId from props or from route params
  const id = contractId || params.contractId;

  const fetchContract = async (password?: string) => {
    if (!id) {
      setError('Invalid contract ID');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Check if contract exists and is password protected
      const { exists } = await checkContentExists(id, 'contract');
      
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
      const contractData = await fetchContractBySharedUrl(id);
      
      // Convert to PublicContract (as expected by component)
      const publicContract: PublicContract = {
        id: contractData.id,
        title: contractData.title,
        content: contractData.content,
        status: contractData.status,
        client_name: contractData.client_name,
        client_website: contractData.client_website,
        client_signed: contractData.client_signed,
        client_signed_at: contractData.client_signed_at,
        client_signature: contractData.client_signature,
        admin_signed: contractData.admin_signed,
        admin_signed_at: contractData.admin_signed_at,
        admin_signature: contractData.admin_signature,
        created_at: contractData.created_at,
        updated_at: contractData.updated_at,
        shared_url: contractData.shared_url
      };
      
      setContract(publicContract);
    } catch (err: any) {
      console.error('Error fetching contract:', err);
      setError(err.message || 'Failed to load contract');
    } finally {
      setLoading(false);
    }
  };

  const verifyPassword = async (password: string) => {
    if (!id) return false;

    try {
      const verified = await verifyContentPassword(id, 'contract', password);
      
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

  const signContract = async (signature: string): Promise<boolean> => {
    if (!contract || !id) return false;

    try {
      toast.loading('Firmando contrato...');
      
      const now = new Date().toISOString();
      
      const signatureData: ContractSignatureUpdate = {
        client_signed: true,
        client_signed_at: now,
        client_signature: signature
      };
      
      // Update contract in the database
      const { success, error: signError } = await updateContractWithSignature(id, signatureData);
      
      if (signError) {
        throw signError;
      }
      
      // Update contract locally
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
      
      toast.dismiss();
      toast.success('Contrato firmado exitosamente');
      return true;
    } catch (err: any) {
      console.error('Error signing contract:', err);
      toast.dismiss();
      toast.error('Error al firmar el contrato. Por favor, inténtelo de nuevo más tarde.');
      return false;
    }
  };

  useEffect(() => {
    if (id) {
      fetchContract();
    }
  }, [id]);

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
