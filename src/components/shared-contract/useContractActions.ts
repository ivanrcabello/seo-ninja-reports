
import { useState, useCallback } from 'react';
import { PublicContract } from './types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function useContractActions(
  contractId?: string,
  contract: PublicContract | null = null,
  setContract?: React.Dispatch<React.SetStateAction<PublicContract | null>>
) {
  const [isSignDialogOpen, setIsSignDialogOpen] = useState(false);

  const handlePrint = useCallback(() => {
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
            .signature { margin-top: 50px; display: flex; justify-content: space-between; }
            .signature-box { border-top: 1px solid #000; padding-top: 10px; width: 40%; text-align: center; }
          </style>
        </head>
        <body>
          <h1 style="text-align: center;">${contract.title}</h1>
          <div>${contract.content}</div>
          
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
    }, 300);
  }, [contract]);

  const handleSignContract = useCallback(async (signature: string) => {
    if (!contractId || !contract || !setContract) {
      toast.error('No se puede firmar el contrato en este momento');
      return;
    }

    try {
      console.log('Signing contract with shared URL:', contractId);
      
      // Get the original contract ID from shared_content
      const { data: sharedContentData, error: sharedContentError } = await supabase
        .from('shared_content')
        .select('original_id, content')
        .eq('shared_url', contractId)
        .eq('content_type', 'contract')
        .single();
        
      if (sharedContentError) {
        console.error('Error fetching original contract ID:', sharedContentError);
        throw sharedContentError;
      }
      
      if (!sharedContentData?.original_id) {
        throw new Error('No se encontró el contrato original');
      }
      
      const originalContractId = sharedContentData.original_id;
      console.log('Original contract ID:', originalContractId);
      
      // Update the original contract with the signature
      const now = new Date().toISOString();
      const updateData = {
        client_signed: true,
        client_signed_at: now,
        client_signature: signature
      };
      
      // Check if admin has already signed, if so, mark contract as fully signed
      const currentContent = typeof sharedContentData.content === 'string' 
        ? JSON.parse(sharedContentData.content) 
        : sharedContentData.content || {};
      
      if (currentContent.admin_signed) {
        updateData['status'] = 'signed';
      }
      
      const { error: updateError } = await supabase
        .from('client_contracts')
        .update(updateData)
        .eq('id', originalContractId);
        
      if (updateError) {
        console.error('Error updating original contract:', updateError);
        throw updateError;
      }
      
      // Also update the shared_content record
      const updatedContent = {
        ...currentContent,
        client_signed: true,
        client_signed_at: now,
        client_signature: signature
      };
      
      const { error: updateSharedError } = await supabase
        .from('shared_content')
        .update({
          content: updatedContent,
          status: currentContent.admin_signed ? 'signed' : 'sent'
        })
        .eq('shared_url', contractId)
        .eq('content_type', 'contract');
        
      if (updateSharedError) {
        console.error('Error updating shared content:', updateSharedError);
        throw updateSharedError;
      }
      
      // Update the local contract state
      setContract({
        ...contract,
        client_signed: true,
        client_signed_at: now,
        client_signature: signature,
        status: currentContent.admin_signed ? 'signed' : contract.status
      });
      
      // Close the signature dialog and show success message
      setIsSignDialogOpen(false);
      toast.success('Contrato firmado exitosamente');
      
    } catch (error: any) {
      console.error('Error signing contract:', error);
      toast.error('Error al firmar el contrato: ' + (error.message || 'Error desconocido'));
    }
  }, [contractId, contract, setContract]);

  return {
    isSignDialogOpen,
    setIsSignDialogOpen,
    handlePrint,
    handleSignContract
  };
}
