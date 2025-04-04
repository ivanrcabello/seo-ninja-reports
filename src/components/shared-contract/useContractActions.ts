
import { useState } from 'react';
import { toast } from 'sonner';
import { SharedContract, PublicContract } from './types';
import { supabase } from '@/integrations/supabase/client';

export function useContractActions(
  sharedUrl?: string, 
  contract: SharedContract = null,
  setContract?: (contract: SharedContract) => void
) {
  const [isSignDialogOpen, setIsSignDialogOpen] = useState(false);

  const handleSignContract = async (signature: string) => {
    if (!sharedUrl || !contract) {
      toast.error('No se puede firmar el contrato');
      return;
    }

    try {
      // Current date for signature timestamp
      const now = new Date().toISOString();
      
      // Call the RPC function to update the contract with signature
      const { data, error } = await supabase
        .rpc('update_shared_contract_with_signature', {
          shared_url_param: sharedUrl,
          client_signed_param: true,
          client_signed_at_param: now,
          client_signature_param: signature,
          status_param: 'signed'
        });

      if (error) {
        console.error('Error signing contract:', error);
        throw error;
      }

      // Also try to update the original contract if possible
      try {
        await supabase
          .rpc('update_contract_by_shared_url', {
            shared_url_param: sharedUrl,
            client_signed_param: true,
            client_signed_at_param: now,
            client_signature_param: signature,
            status_param: 'signed'
          });
      } catch (originalContractError) {
        console.warn('Could not update original contract, but shared contract was updated:', originalContractError);
      }

      // Update local state
      if (setContract && contract) {
        setContract({
          ...contract,
          client_signed: true,
          client_signed_at: now,
          client_signature: signature,
          status: 'signed'
        });
      }

      setIsSignDialogOpen(false);
      toast.success('Contrato firmado correctamente');
    } catch (err: any) {
      console.error('Error signing contract:', err);
      toast.error(err.message || 'Error al firmar el contrato');
    }
  };

  const handlePrint = () => {
    if (!contract) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('No se pudo abrir la ventana de impresión');
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>${contract.title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .content { margin-bottom: 50px; }
            .signature { margin-top: 50px; display: flex; justify-content: space-between; }
            .signature-box { border-top: 1px solid #000; padding-top: 10px; width: 40%; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${contract.title}</h1>
            ${contract.client_name ? `<p>Cliente: ${contract.client_name}</p>` : ''}
          </div>
          
          <div class="content">${contract.content}</div>
          
          <div class="signature">
            <div class="signature-box">
              ${contract.admin_signature ? `
                <img src="${contract.admin_signature}" style="max-height: 60px;" />
                <p>Firma Administrador</p>
                <p>Fecha: ${contract.admin_signed_at ? new Date(contract.admin_signed_at).toLocaleDateString() : 'Sin firmar'}</p>
              ` : 'Firma Administrador (Pendiente)'}
            </div>
            
            <div class="signature-box">
              ${contract.client_signature ? `
                <img src="${contract.client_signature}" style="max-height: 60px;" />
                <p>Firma Cliente</p>
                <p>Fecha: ${contract.client_signed_at ? new Date(contract.client_signed_at).toLocaleDateString() : 'Sin firmar'}</p>
              ` : 'Firma Cliente (Pendiente)'}
            </div>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Wait for content to load before printing
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return {
    isSignDialogOpen,
    setIsSignDialogOpen,
    handleSignContract,
    handlePrint
  };
}
