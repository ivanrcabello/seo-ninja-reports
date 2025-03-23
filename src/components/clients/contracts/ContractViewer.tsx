
import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ClientContract } from '@/types/client.types';
import { FileText, Printer, PenLine, Share } from 'lucide-react';
import { useClientContracts } from '@/hooks/useClientContracts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import SignatureDialog from './SignatureDialog';
import ShareContractDialog from './ShareContractDialog';

interface ContractViewerProps {
  contract: ClientContract;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ContractViewer: React.FC<ContractViewerProps> = ({
  contract,
  open,
  onOpenChange
}) => {
  const { signContract, generateShareUrl } = useClientContracts();
  const [isSignDialogOpen, setIsSignDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  
  // Clean up component state when closing
  useEffect(() => {
    if (!open) {
      setIsSignDialogOpen(false);
      setIsShareDialogOpen(false);
    }
  }, [open]);

  const handleSignContract = useCallback(async (signature: string) => {
    try {
      await signContract(contract.id, signature, true);
      setIsSignDialogOpen(false);
    } catch (error) {
      console.error('Error signing contract:', error);
    }
  }, [contract.id, signContract]);

  const handlePrintContract = useCallback(() => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      console.error('Failed to open print window');
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
                <p>Fecha: ${contract.admin_signed_at ? format(new Date(contract.admin_signed_at), 'PPP', { locale: es }) : 'Sin firmar'}</p>
              ` : 'Firma Administrador (Pendiente)'}
            </div>
            
            <div class="signature-box">
              ${contract.client_signature ? `
                <img src="${contract.client_signature}" style="max-height: 60px;" />
                <p>Firma Cliente</p>
                <p>Fecha: ${contract.client_signed_at ? format(new Date(contract.client_signed_at), 'PPP', { locale: es }) : 'Sin firmar'}</p>
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

  const handleOpenSignDialog = useCallback(() => {
    setIsSignDialogOpen(true);
  }, []);

  const handleOpenShareDialog = useCallback(() => {
    setIsShareDialogOpen(true);
  }, []);

  const handleGenerateShareUrl = useCallback(async () => {
    try {
      return await generateShareUrl(contract.id);
    } catch (error) {
      console.error('Error generating share URL:', error);
      throw error;
    }
  }, [contract.id, generateShareUrl]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {contract.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="text-sm text-muted-foreground">
            <p>Creado: {format(new Date(contract.created_at), 'PPP', { locale: es })}</p>
            <p>Estado: {contract.status === 'draft' ? 'Borrador' : 
                        contract.status === 'sent' ? 'Enviado' : 
                        contract.status === 'signed' ? 'Firmado' : 
                        contract.status === 'expired' ? 'Expirado' : 
                        contract.status === 'cancelled' ? 'Cancelado' : 'Desconocido'}</p>
          </div>
          
          <div className="flex gap-2 my-4">
            {/* Admin signature status */}
            <div className={`px-3 py-1 rounded-full text-xs ${contract.admin_signed ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
              {contract.admin_signed ? 'Firmado por admin' : 'Pendiente firma admin'}
            </div>
            
            {/* Client signature status */}
            <div className={`px-3 py-1 rounded-full text-xs ${contract.client_signed ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
              {contract.client_signed ? 'Firmado por cliente' : 'Pendiente firma cliente'}
            </div>
          </div>
          
          <div className="bg-white border rounded-md p-6 max-h-[50vh] overflow-y-auto">
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: contract.content }} />
          </div>
          
          <div className="flex flex-wrap justify-between items-center gap-4 mt-4">
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={handlePrintContract}
                className="gap-2"
              >
                <Printer className="h-4 w-4" />
                Imprimir
              </Button>
              <Button
                variant="outline"
                onClick={handleOpenShareDialog}
                className="gap-2"
              >
                <Share className="h-4 w-4" />
                Compartir
              </Button>
            </div>
            
            <Button
              onClick={handleOpenSignDialog}
              disabled={contract.admin_signed}
              className="gap-2"
            >
              <PenLine className="h-4 w-4" />
              {contract.admin_signed ? 'Ya firmado' : 'Firmar como Admin'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {isSignDialogOpen && (
        <SignatureDialog
          open={isSignDialogOpen}
          onOpenChange={setIsSignDialogOpen}
          onSign={handleSignContract}
          isAdmin={true}
        />
      )}
      
      {isShareDialogOpen && (
        <ShareContractDialog
          open={isShareDialogOpen}
          onOpenChange={setIsShareDialogOpen}
          contractId={contract.id}
          contractTitle={contract.title}
          onGenerateShareUrl={handleGenerateShareUrl}
        />
      )}
    </>
  );
};

export default ContractViewer;
