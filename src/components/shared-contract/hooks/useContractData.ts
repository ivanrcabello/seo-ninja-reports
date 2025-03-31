
import { useState, useEffect, useCallback, useRef } from 'react';
import { useSharedContractData } from './useSharedContractData';
import { SharedContentStatus } from '@/types/shared-content';
import { useToast } from '@/components/ui/use-toast';

export const useContractData = (contractId: string) => {
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const printContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const { 
    contract, 
    loading, // Changed from isLoading to loading to match the property name in useSharedContractData
    error, 
    signContract,
    refetch
  } = useSharedContractData(contractId);
  
  // Handle printing
  const handlePrint = useCallback(() => {
    window.print();
  }, []);
  
  // Mock verify password since contracts don't use password protection
  const verifyPassword = useCallback(async (password: string) => {
    if (!isPasswordProtected) {
      return true;
    }
    return false;
  }, [isPasswordProtected]);
  
  // Loading contract status
  useEffect(() => {
    if (contract && contract.status === 'expired') {
      toast({
        variant: 'destructive',
        title: 'Contrato expirado',
        description: 'Este contrato ha expirado y ya no puede ser firmado.'
      });
    }
  }, [contract, toast]);
  
  return {
    contract,
    loading, // Ensure we're returning the correct property name
    error,
    isPasswordProtected,
    isPasswordVerified,
    verifyPassword,
    signContract,
    handlePrint,
    refetch
  };
};

export default useContractData;
