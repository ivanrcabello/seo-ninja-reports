
import React from 'react';
import { useParams } from 'react-router-dom';
import { 
  ContractHeader,
  ContractContent,
  ContactInfo,
  useContractData,
  useContractActions
} from '@/components/shared-contract';
import PasswordProtectionDialog from '@/components/shared-content/PasswordProtectionDialog';

const SharedContract = () => {
  const { sharedUrl } = useParams<{ sharedUrl: string }>();
  const { contract, setContract, loading, error, logo } = useContractData(sharedUrl);
  const { 
    isSignDialogOpen, 
    setIsSignDialogOpen, 
    handleSignContract, 
    handlePrint 
  } = useContractActions(sharedUrl, contract, setContract);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-lg font-medium">Cargando contrato...</p>
        </div>
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full p-6 bg-background/80 backdrop-blur-sm rounded-lg shadow-lg border border-red-200">
          <h1 className="text-2xl font-bold text-center text-red-600 mb-4">Error al cargar el contrato</h1>
          <p className="text-center text-muted-foreground mb-6">
            {error || 'El contrato solicitado no existe o ha sido eliminado.'}
          </p>
          <div className="flex justify-center">
            <a
              href="/"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Volver al inicio
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Contract Header */}
          <ContractHeader contract={contract} logo={logo} />
          
          {/* Contract Content */}
          <ContractContent 
            loading={loading} 
            error={error} 
            contract={contract} 
            onOpenSignDialog={() => setIsSignDialogOpen(true)} 
            onPrint={handlePrint}
            onSign={handleSignContract}
            isSignDialogOpen={isSignDialogOpen}
            setIsSignDialogOpen={setIsSignDialogOpen}
          />
          
          {/* Información de contacto */}
          <ContactInfo />
        </div>
      </div>
    </>
  );
};

export default SharedContract;
