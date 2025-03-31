
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PublicContract } from './types';
import { SharedContentStatus } from '@/types/shared-content';
import { toast } from 'sonner';

export const useContractActions = (
  id: string | undefined, 
  contract: PublicContract | null,
  setContract: React.Dispatch<React.SetStateAction<PublicContract | null>>
) => {
  const [isSignDialogOpen, setIsSignDialogOpen] = useState(false);

  const handleSignContract = useCallback(async (signature: string) => {
    try {
      if (!id || !contract) {
        toast.error('No se puede firmar el contrato: Información faltante');
        return;
      }
      
      const now = new Date().toISOString();
      
      // Use the SECURITY DEFINER function to update the contract
      const { data, error } = await supabase
        .rpc('update_contract_by_shared_url', {
          shared_url_param: id,
          client_signed_param: true,
          client_signed_at_param: now,
          client_signature_param: signature,
          // If the admin already signed, change the status to 'signed'
          status_param: contract.admin_signed ? "signed" : null
        });
        
      if (error) {
        console.error('Error updating contract:', error);
        throw error;
      }
      
      console.log('Contract updated successfully:', data);
      
      // Update the local state
      setContract(prev => {
        if (!prev) return null;
        return {
          ...prev,
          client_signed: true,
          client_signed_at: now,
          client_signature: signature,
          ...(prev.admin_signed ? { status: "signed" as SharedContentStatus } : {})
        };
      });
      
      setIsSignDialogOpen(false);
      toast.success('Contrato firmado exitosamente');
    } catch (error: any) {
      console.error('Error signing contract:', error);
      toast.error('Error al firmar el contrato: ' + error.message);
    }
  }, [id, contract, setContract]);

  const handlePrint = useCallback(() => {
    if (!contract) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('El navegador bloqueó la ventana emergente. Por favor, permita ventanas emergentes para imprimir.');
      return;
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>${contract.title} - Contrato</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            .signatures { margin-top: 50px; display: flex; justify-content: space-between; }
            .signature-box { border-top: 1px solid #000; padding-top: 10px; text-align: center; width: 40%; }
          </style>
        </head>
        <body>
          <h1 style="text-align: center;">${contract.title}</h1>
          <div>${contract.content}</div>
          
          <div class="signatures">
            <div class="signature-box">
              ${contract.admin_signature ? `
                <img src="${contract.admin_signature}" style="max-height: 60px;" />
                <p>Firma Administrador</p>
                <p>Fecha: ${contract.admin_signed_at ? new Date(contract.admin_signed_at).toLocaleDateString('es-ES') : 'No firmado'}</p>
              ` : 'Administrador (Pendiente de firma)'}
            </div>
            
            <div class="signature-box">
              ${contract.client_signature ? `
                <img src="${contract.client_signature}" style="max-height: 60px;" />
                <p>Firma Cliente</p>
                <p>Fecha: ${contract.client_signed_at ? new Date(contract.client_signed_at).toLocaleDateString('es-ES') : 'No firmado'}</p>
              ` : 'Cliente (Pendiente de firma)'}
            </div>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    // Imprimir después de que todo el contenido esté cargado
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }, [contract]);

  return {
    isSignDialogOpen,
    setIsSignDialogOpen,
    handleSignContract,
    handlePrint
  };
};
