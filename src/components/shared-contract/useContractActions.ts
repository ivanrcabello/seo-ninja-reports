
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { PublicContract } from './types';

export function useContractActions(
  sharedUrl?: string,
  contract: PublicContract | null = null,
  setContract?: (contract: PublicContract | null) => void
) {
  const [isSignDialogOpen, setIsSignDialogOpen] = useState(false);
  const [isSigningContract, setIsSigningContract] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleSignContract = async (signature: string) => {
    if (!sharedUrl || !contract) {
      toast.error('No se puede firmar el contrato');
      return;
    }

    setIsSigningContract(true);

    try {
      console.log('Signing contract:', sharedUrl);
      console.log('Signature:', signature);

      // Try first directly with shared_content table
      const { error: updateError } = await supabase.rpc('update_shared_contract_with_signature', {
        shared_url_param: sharedUrl,
        client_signed_param: true,
        client_signed_at_param: new Date().toISOString(),
        client_signature_param: signature,
        status_param: 'signed'
      });
      
      if (updateError) {
        console.error('Error updating shared contract with signature:', updateError);
        // Fall back to direct contract update if RPC fails
        const { error } = await supabase.rpc('update_contract_by_shared_url', {
          shared_url_param: sharedUrl,
          client_signed_param: true,
          client_signed_at_param: new Date().toISOString(),
          client_signature_param: signature,
          status_param: 'signed'
        });

        if (error) {
          throw error;
        }
      }

      // Update local state if successful
      if (setContract && contract) {
        setContract({
          ...contract,
          client_signed: true,
          client_signed_at: new Date().toISOString(),
          client_signature: signature,
          status: 'signed'
        });
      }

      toast.success('¡Contrato firmado correctamente!');
      setIsSignDialogOpen(false);
    } catch (error: any) {
      console.error('Error signing contract:', error);
      toast.error('Error al firmar el contrato', {
        description: error.message || 'Ocurrió un error al procesar la firma'
      });
    } finally {
      setIsSigningContract(false);
    }
  };

  return {
    isSignDialogOpen,
    setIsSignDialogOpen,
    isSigningContract,
    handlePrint,
    handleSignContract
  };
}
