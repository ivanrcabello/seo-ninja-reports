
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSharedContractData } from '@/components/shared-contract/hooks/useSharedContractData';
import ContractHeader from '@/components/shared-contract/ContractHeader';
import ContractSign from '@/components/shared-contract/ContractSign';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { logContractAccess } from '@/api/shared-content/contracts';
import { SharedContentStatus } from '@/types/shared-content';
import { toast } from 'sonner';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { useReactToPrint } from 'react-to-print';

const SharedContract: React.FC = () => {
  const { contractId = '' } = useParams();
  const contentRef = useRef<HTMLDivElement>(null);
  const [isSignDialogOpen, setIsSignDialogOpen] = useState(false);
  const { 
    contract, 
    loading, 
    error, 
    signing,
    signContract,
    refetch 
  } = useSharedContractData(contractId);

  useEffect(() => {
    // Log page view
    if (contractId) {
      logContractAccess(contractId, { 
        successful: true 
      }, 'page_view');
    }
  }, [contractId]);

  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    documentTitle: `Contrato - ${contract?.title || 'Sin título'}`,
    onBeforePrint: () => {
      if (contractId) {
        logContractAccess(contractId, { 
          successful: true 
        }, 'print');
      }
    },
    onAfterPrint: () => {
      toast.success('PDF generado correctamente');
    }
  });

  const handleSign = async (signatureData: string) => {
    if (!contract) return false;
    
    try {
      const success = await signContract(signatureData);
      return success;
    } catch (error) {
      console.error('Error al firmar:', error);
      return false;
    }
  };

  const canSign = !contract?.client_signed && contract?.status !== 'signed' && contract?.status !== 'expired';

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-16 w-full mb-8" />
          <Skeleton className="h-72 w-full mb-4" />
          <Skeleton className="h-72 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-card border rounded-lg p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h1 className="text-2xl font-bold mb-2">Error al cargar contrato</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al inicio
              </Button>
              <Button onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reintentar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-card border rounded-lg p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Contrato no encontrado</h1>
            <p className="text-muted-foreground mb-6">
              El contrato solicitado no existe o ha sido eliminado.
            </p>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ContractHeader
        title={contract.title}
        client={contract.client_name}
        canSign={canSign}
        status={contract.status as SharedContentStatus}
        onOpenSignDialog={() => setIsSignDialogOpen(true)}
        onPrint={handlePrint}
      />
      
      <AnimatedContainer animation="fade" className="py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div 
            ref={contentRef}
            className="contract-content prose prose-lg max-w-none dark:prose-invert bg-card border shadow-sm rounded-lg p-8 mb-8"
          >
            {contract.content ? (
              <div dangerouslySetInnerHTML={{ __html: contract.content }} />
            ) : (
              <div className="text-center text-muted-foreground">
                <p>El contrato no tiene contenido para mostrar.</p>
              </div>
            )}
            
            {contract.client_signed && contract.client_signature && (
              <div className="mt-12 border-t pt-6">
                <h3 className="text-xl font-semibold mb-4">Firmado por cliente</h3>
                <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-muted/30">
                  <img 
                    src={contract.client_signature} 
                    alt="Firma del cliente" 
                    className="max-h-24 mb-2" 
                  />
                  <p className="text-sm text-muted-foreground">
                    Firmado el {new Date(contract.client_signed_at || '').toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </AnimatedContainer>
      
      <ContractSign
        open={isSignDialogOpen}
        onOpenChange={setIsSignDialogOpen}
        onSign={handleSign}
        isLoading={signing}
      />
    </div>
  );
};

export default SharedContract;
