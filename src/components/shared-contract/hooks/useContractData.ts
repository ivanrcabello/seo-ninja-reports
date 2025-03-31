
import { useState, useEffect } from 'react';
import { SharedContract, ContractSignatureUpdate, AccessLogOptions, AccessLogType, SharedContentStatus } from '@/types/shared-content';
import { fetchContractBySharedUrl, updateContractWithSignature, checkContractExists, checkContractPassword, verifyContractPassword, logContractAccess } from '@/api/shared-content';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

// Define PublicContract type (referenced in component)
export type PublicContract = SharedContract;

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
      const { exists, error: existsError } = await checkContractExists(id);
      
      if (existsError) {
        throw existsError;
      }
      
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
      const response = await fetchContractBySharedUrl(id);
      
      if (response.error) {
        throw response.error;
      }
      
      if (response.contract) {
        setContract(response.contract);
        
        // Log successful access
        const logOptions: AccessLogOptions = { successful: true };
        logContractAccess(id, logOptions, 'view');
      } else {
        setError('Contract not found');
        
        // Log failed access
        const logOptions: AccessLogOptions = { 
          successful: false, 
          error: 'Contract data not found' 
        };
        logContractAccess(id, logOptions, 'data_not_found');
      }
    } catch (err: any) {
      console.error('Error fetching contract:', err);
      setError(err.message || 'Failed to load contract');
      
      // Log error
      const logOptions: AccessLogOptions = { 
        successful: false, 
        error: err.message || 'Unknown error' 
      };
      logContractAccess(id, logOptions, 'error');
    } finally {
      setLoading(false);
    }
  };

  const verifyPassword = async (password: string) => {
    if (!id) return false;

    try {
      const verified = await verifyContractPassword(id, password);
      
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

  return {
    contract,
    loading,
    error,
    isPasswordProtected,
    isPasswordVerified,
    verifyPassword,
    signContract,
    handlePrint,
    isSignDialogOpen,
    setIsSignDialogOpen
  };
};

export default useContractData;
