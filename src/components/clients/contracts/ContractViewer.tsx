
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
  const [localContract, setLocalContract] = useState<ClientContract | null>(null);
  
  // Initialize local contract state from props
  useEffect(() => {
    if (contract && open) {
      setLocalContract({...contract});
    }
  }, [contract, open]);
  
  // Clean up component state when closing
  useEffect(() => {
    if (!open) {
      console.log("ContractViewer closing, resetting dialog states");
      setIsSignDialogOpen(false);
      setIsShareDialogOpen(false);
    }
  }, [open]);

  const handleSignContract = useCallback(async (signature: string) => {
    if (!localContract) return;
    
    try {
      console.log("Signing contract with ID:", localContract.id);
      const updatedContract = await signContract(localContract.id, signature, true);
      
      // Update local state to immediately show the signature
      if (updatedContract) {
        setLocalContract({
          ...localContract,
          admin_signed: true,
          admin_signed_at: new Date().toISOString(),
          admin_signature: signature,
          status: updatedContract.client_signed ? 'signed' : localContract.status
        });
      }
      
      setIsSignDialogOpen(false);
    } catch (error) {
      console.error('Error signing contract:', error);
    }
  }, [localContract, signContract]);

  const handlePrintContract = useCallback(() => {
    if (!localContract) return;
    
    console.log("Printing contract with ID:", localContract.id);
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      console.error('Failed to open print window');
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>${localContract.title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            .signature { margin-top: 50px; display: flex; justify-content: space-between; }
            .signature-box { border-top: 1px solid #000; padding-top: 10px; width: 40%; text-align: center; }
          </style>
        </head>
        <body>
          <h1 style="text-align: center;">${localContract.title}</h1>
          <div>${localContract.content}</div>
          
          <div class="signature">
            <div class="signature-box">
              ${localContract.admin_signature ? `
                <img src="${localContract.admin_signature}" style="max-height: 60px;" alt="Admin signature" />
                <p>Firma Administrador</p>
                <p>Fecha: ${localContract.admin_signed_at ? format(new Date(localContract.admin_signed_at), 'PPP', { locale: es }) : 'Sin firmar'}</p>
              ` : 'Firma Administrador (Pendiente)'}
            </div>
            
            <div class="signature-box">
              ${localContract.client_signature ? `
                <img src="${localContract.client_signature}" style="max-height: 60px;" alt="Client signature" />
                <p>Firma Cliente</p>
                <p>Fecha: ${localContract.client_signed_at ? format(new Date(localContract.client_signed_at), 'PPP', { locale: es }) : 'Sin firmar'}</p>
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
    
  }, [localContract]);

  const handleOpenSignDialog = useCallback(() => {
    console.log("Opening signature dialog");
    setIsSignDialogOpen(true);
  }, []);

  const handleOpenShareDialog = useCallback(() => {
    console.log("Opening share dialog");
    setIsShareDialogOpen(true);
  }, []);

  const handleGenerateShareUrl = useCallback(async () => {
    if (!localContract) return "";
    
    try {
      console.log("Generating share URL for contract ID:", localContract.id);
      return await generateShareUrl(localContract.id);
    } catch (error) {
      console.error('Error generating share URL:', error);
      throw error;
    }
  }, [localContract, generateShareUrl]);

  // If localContract hasn't been initialized yet, don't render the dialog content
  if (!localContract && open) {
    return null;
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {localContract && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {localContract.title}
                </DialogTitle>
              </DialogHeader>
              
              <div className="text-sm text-muted-foreground">
                <p>Creado: {format(new Date(localContract.created_at), 'PPP', { locale: es })}</p>
                <p>Estado: {localContract.status === 'draft' ? 'Borrador' : 
                            localContract.status === 'sent' ? 'Enviado' : 
                            localContract.status === 'signed' ? 'Firmado' : 
                            localContract.status === 'expired' ? 'Expirado' : 
                            localContract.status === 'cancelled' ? 'Cancelado' : 'Desconocido'}</p>
              </div>
              
              <div className="flex gap-2 my-4">
                {/* Admin signature status */}
                <div className={`px-3 py-1 rounded-full text-xs ${localContract.admin_signed ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                  {localContract.admin_signed ? 'Firmado por admin' : 'Pendiente firma admin'}
                </div>
                
                {/* Client signature status */}
                <div className={`px-3 py-1 rounded-full text-xs ${localContract.client_signed ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                  {localContract.client_signed ? 'Firmado por cliente' : 'Pendiente firma cliente'}
                </div>
              </div>
              
              <div className="bg-white border rounded-md p-6 max-h-[50vh] overflow-y-auto">
                <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: localContract.content }} />
              </div>
              
              {/* Signature preview section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 bg-muted/20 p-3 rounded-md">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Firma Administrador:</h4>
                  <div className="bg-white border rounded-md p-3 min-h-[60px] flex items-center justify-center">
                    {localContract.admin_signature ? (
                      <img 
                        src={localContract.admin_signature} 
                        alt="Firma del Administrador" 
                        className="max-h-16"
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">Pendiente</span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Firma Cliente:</h4>
                  <div className="bg-white border rounded-md p-3 min-h-[60px] flex items-center justify-center">
                    {localContract.client_signature ? (
                      <img 
                        src={localContract.client_signature} 
                        alt="Firma del Cliente" 
                        className="max-h-16"
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">Pendiente</span>
                    )}
                  </div>
                </div>
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
                  disabled={localContract.admin_signed}
                  className="gap-2"
                >
                  <PenLine className="h-4 w-4" />
                  {localContract.admin_signed ? 'Ya firmado' : 'Firmar como Admin'}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {isSignDialogOpen && (
        <SignatureDialog
          open={isSignDialogOpen}
          onOpenChange={setIsSignDialogOpen}
          onSign={handleSignContract}
          isAdmin={true}
          title="Firma como Administrador"
          description="Dibuja tu firma en el área a continuación para firmar este contrato como administrador."
        />
      )}
      
      {isShareDialogOpen && localContract && (
        <ShareContractDialog
          open={isShareDialogOpen}
          onOpenChange={setIsShareDialogOpen}
          contractId={localContract.id}
          contractTitle={localContract.title}
          onGenerateShareUrl={handleGenerateShareUrl}
        />
      )}
    </>
  );
};

export default ContractViewer;
