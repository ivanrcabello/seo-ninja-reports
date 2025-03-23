
import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ClientContract } from '@/types/client.types';
import { Badge } from '@/components/ui/badge';
import { BadgeCheck, Clock, Download, Eye, FileText, FilePen, HandshakeIcon, Pencil, Send, Share2, X, Ban } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { es } from 'date-fns/locale';
import { useClientContracts } from '@/hooks/useClientContracts';
import SignatureDialog from './SignatureDialog';
import ShareContractDialog from './ShareContractDialog';
import { toast } from 'sonner';

interface ContractViewerProps {
  contract: ClientContract;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ContractViewer: React.FC<ContractViewerProps> = ({ contract, open, onOpenChange }) => {
  const { signContract, generateShareUrl } = useClientContracts(contract?.client_id);
  const [isSignDialogOpen, setIsSignDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isSigningAsAdmin, setIsSigningAsAdmin] = useState(false);
  
  // Close all child dialogs when parent dialog closes
  useEffect(() => {
    if (!open) {
      setIsSignDialogOpen(false);
      setIsShareDialogOpen(false);
    }
  }, [open]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      setIsSignDialogOpen(false);
      setIsShareDialogOpen(false);
      setIsSigningAsAdmin(false);
    };
  }, []);
  
  const getStatusIcon = useCallback(() => {
    if (!contract) return <FileText className="h-5 w-5" />;
    
    switch (contract.status) {
      case 'draft':
        return <FileText className="h-5 w-5 text-muted-foreground" />;
      case 'sent':
        return <Send className="h-5 w-5 text-blue-500" />;
      case 'signed':
        return <BadgeCheck className="h-5 w-5 text-green-500" />;
      case 'expired':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'cancelled':
        return <Ban className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  }, [contract]);
  
  const getStatusLabel = useCallback(() => {
    if (!contract) return 'Desconocido';
    
    switch (contract.status) {
      case 'draft': return 'Borrador';
      case 'sent': return 'Enviado';
      case 'signed': return 'Firmado';
      case 'expired': return 'Vencido';
      case 'cancelled': return 'Cancelado';
      default: return 'Desconocido';
    }
  }, [contract]);
  
  const getStatusColor = useCallback(() => {
    if (!contract) return 'bg-muted text-muted-foreground';
    
    switch (contract.status) {
      case 'draft': return 'bg-muted text-muted-foreground';
      case 'sent': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'signed': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'expired': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-muted text-muted-foreground';
    }
  }, [contract]);
  
  const formatDate = useCallback((dateString?: string) => {
    if (!dateString) return 'No disponible';
    try {
      return formatDistance(new Date(dateString), new Date(), { 
        addSuffix: true,
        locale: es
      });
    } catch (error) {
      console.error('Error parsing date:', error);
      return 'Fecha desconocida';
    }
  }, []);
  
  const handleOpenSignDialog = useCallback((isAdmin: boolean) => {
    setIsSigningAsAdmin(isAdmin);
    setIsSignDialogOpen(true);
  }, []);
  
  const handleSignContract = useCallback(async (signature: string) => {
    try {
      if (!contract) return;
      
      await signContract(contract.id, signature, isSigningAsAdmin);
      setIsSignDialogOpen(false);
      toast.success('Contrato firmado exitosamente');
    } catch (error) {
      console.error('Error signing contract:', error);
      toast.error('Error al firmar el contrato');
    }
  }, [contract, signContract, isSigningAsAdmin]);
  
  const handleShare = useCallback(() => {
    setIsShareDialogOpen(true);
  }, []);
  
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
    
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }, [contract]);
  
  // If contract is undefined or null, don't render dialog
  if (!contract) {
    return null;
  }
  
  // Handle dialog close
  const handleDialogOpenChange = (open: boolean) => {
    // Only close if not already closing child dialogs
    if (!isSignDialogOpen && !isShareDialogOpen) {
      onOpenChange(open);
    }
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-2xl">{contract.title}</DialogTitle>
              <div className={`text-sm px-3 py-1.5 rounded-full flex items-center ${getStatusColor()}`}>
                {getStatusIcon()}
                <span className="ml-1.5 font-medium">{getStatusLabel()}</span>
              </div>
            </div>
            
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1.5" />
                Actualizado: {formatDate(contract.updated_at)}
              </div>
              
              {contract.client_signed && (
                <div className="flex items-center">
                  <FilePen className="h-4 w-4 mr-1.5 text-blue-500" />
                  Cliente firmó: {formatDate(contract.client_signed_at)}
                </div>
              )}
              
              {contract.admin_signed && (
                <div className="flex items-center">
                  <FilePen className="h-4 w-4 mr-1.5 text-amber-500" />
                  Admin firmó: {formatDate(contract.admin_signed_at)}
                </div>
              )}
            </div>
          </DialogHeader>
          
          <div className="my-4 border rounded-md p-6 bg-card">
            <div dangerouslySetInnerHTML={{ __html: contract.content }} className="prose prose-sm max-w-none dark:prose-invert" />
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t">
            <div className="flex flex-wrap gap-2">
              {!contract.admin_signed && (
                <Button variant="outline" onClick={() => handleOpenSignDialog(true)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Firmar como Admin
                </Button>
              )}
              
              {!contract.client_signed && (
                <Button variant="outline" onClick={() => handleOpenSignDialog(false)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Firmar como Cliente
                </Button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={handlePrint}>
                <Download className="h-4 w-4 mr-2" />
                Imprimir / Guardar PDF
              </Button>
              
              <Button variant="default" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Compartir
              </Button>
            </div>
          </div>
          
          {(contract.admin_signature || contract.client_signature) && (
            <div className="mt-6 pt-4 border-t">
              <h4 className="text-sm font-medium mb-4">Firmas</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contract.admin_signature && (
                  <div className="border rounded-md p-4 bg-muted/30">
                    <div className="text-xs text-muted-foreground mb-2">Firma del Administrador</div>
                    <div className="flex justify-center border-t pt-2">
                      <img 
                        src={contract.admin_signature} 
                        alt="Firma del Administrador" 
                        className="max-h-16 object-contain" 
                      />
                    </div>
                    <div className="text-xs text-center text-muted-foreground mt-2">
                      {contract.admin_signed_at 
                        ? new Date(contract.admin_signed_at).toLocaleDateString('es-ES', {
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) 
                        : 'Fecha no disponible'}
                    </div>
                  </div>
                )}
                
                {contract.client_signature && (
                  <div className="border rounded-md p-4 bg-muted/30">
                    <div className="text-xs text-muted-foreground mb-2">Firma del Cliente</div>
                    <div className="flex justify-center border-t pt-2">
                      <img 
                        src={contract.client_signature} 
                        alt="Firma del Cliente" 
                        className="max-h-16 object-contain" 
                      />
                    </div>
                    <div className="text-xs text-center text-muted-foreground mt-2">
                      {contract.client_signed_at 
                        ? new Date(contract.client_signed_at).toLocaleDateString('es-ES', {
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) 
                        : 'Fecha no disponible'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Only render dialogs if the main dialog is open */}
      {open && (
        <>
          <SignatureDialog 
            open={isSignDialogOpen}
            onOpenChange={setIsSignDialogOpen}
            onSign={handleSignContract}
            isAdmin={isSigningAsAdmin}
          />
          
          {contract && (
            <ShareContractDialog 
              open={isShareDialogOpen}
              onOpenChange={setIsShareDialogOpen}
              contractId={contract.id}
              contractTitle={contract.title}
              onGenerateShareUrl={() => generateShareUrl(contract.id)}
            />
          )}
        </>
      )}
    </>
  );
};

export default ContractViewer;
