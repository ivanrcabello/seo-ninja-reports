
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  ContractHeader,
  ContractContent,
  ContactInfo,
  useContractData,
  useContractActions
} from '@/components/shared-contract';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const SharedContract = () => {
  const { sharedUrl } = useParams<{ sharedUrl: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { contract, setContract, loading, error, logo } = useContractData(sharedUrl);
  const { 
    isSignDialogOpen, 
    setIsSignDialogOpen, 
    handleSignContract, 
    handlePrint 
  } = useContractActions(sharedUrl, contract, setContract);

  const handleBackToHome = () => {
    // Check if we came from another page in the app
    if (location.key !== 'default') {
      navigate(-1); // Go back in history if possible
    } else {
      navigate('/'); // Otherwise go to home
    }
  };

  // Handle browser navigation events in a safer way
  useEffect(() => {
    // For handling user closing the browser
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Don't need to do anything special here
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Clean up
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Use a simpler approach for navigation with React Router
  useEffect(() => {
    // This component is mounted, so let's make sure we can navigate properly
    return () => {
      // Clean up when unmounting
    };
  }, [navigate]);

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
          <div className="text-center flex flex-col items-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-center text-red-600 mb-4">Error al cargar el contrato</h1>
            <p className="text-center text-muted-foreground mb-6">
              {error || 'El contrato solicitado no existe o ha sido eliminado.'}
            </p>
            <Button onClick={handleBackToHome} variant="default">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 p-6">
        <div className="max-w-4xl mx-auto">
          <Button 
            onClick={handleBackToHome} 
            variant="ghost" 
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al inicio
          </Button>
          
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
