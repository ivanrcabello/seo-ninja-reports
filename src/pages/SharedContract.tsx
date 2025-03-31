
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useContractData } from '@/components/shared-contract/hooks/useContractData';
import ContractContent from '@/components/shared-contract/ContractContent';
import ContractHeader from '@/components/shared-contract/ContractHeader';
import ContractSign from '@/components/shared-contract/ContractSign';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { PublicContract } from '@/components/shared-contract/types';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import PasswordProtectionDialog from '@/components/shared/PasswordProtectionDialog';

const SharedContract: React.FC = () => {
  const { contractId } = useParams<{ contractId: string }>();
  const [activeTab, setActiveTab] = useState('view');
  const [passwordInput, setPasswordInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isSignDialogOpen, setIsSignDialogOpen] = useState(false);

  const {
    contract,
    loading,
    error,
    isPasswordProtected,
    isPasswordVerified,
    verifyPassword,
    signContract,
    handlePrint
  } = useContractData(contractId || '');

  const handleOpenSignDialog = () => {
    setActiveTab('sign');
  };

  const handleVerifyPassword = async () => {
    if (!passwordInput.trim()) {
      setShowError(true);
      return;
    }
    
    setVerifying(true);
    setShowError(false);
    
    try {
      const success = await verifyPassword(passwordInput);
      
      if (success) {
        toast.success('Acceso concedido');
      } else {
        setShowError(true);
        toast.error('Contraseña incorrecta');
      }
    } catch (err) {
      setShowError(true);
      toast.error('Error al verificar la contraseña');
    } finally {
      setVerifying(false);
    }
  };

  const handleSign = async (signature: string): Promise<boolean> => {
    try {
      const success = await signContract(signature);
      if (success) {
        toast.success('Contrato firmado correctamente');
        setActiveTab('view');
      } else {
        toast.error('Error al firmar el contrato');
      }
      return success;
    } catch (error) {
      console.error('Error signing contract:', error);
      toast.error('Error al firmar el contrato');
      return false;
    }
  };

  // Show password protection dialog if needed
  if (isPasswordProtected && !isPasswordVerified) {
    return (
      <PasswordProtectionDialog
        isOpen={true}
        onClose={() => {}}
        title="Contrato Protegido"
        description="Este contrato está protegido con contraseña. Por favor, introduce la contraseña para acceder."
        password={passwordInput}
        setPassword={setPasswordInput}
        onVerify={handleVerifyPassword}
        isVerifying={verifying}
        showError={showError}
        errorMessage="Contraseña incorrecta. Por favor, inténtalo de nuevo."
      />
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <div className="bg-destructive/10 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-destructive mb-4">Error al cargar el contrato</h2>
          <p className="mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Intentar de nuevo</Button>
        </div>
      </div>
    );
  }

  // Show 404 state
  if (!contract) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <div className="bg-muted p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-4">Contrato no encontrado</h2>
          <p className="mb-4">El contrato que buscas no existe o ha expirado.</p>
          <Button onClick={() => window.location.reload()}>Intentar de nuevo</Button>
        </div>
      </div>
    );
  }

  // Convert SharedContract to PublicContract
  const publicContract: PublicContract = {
    id: contract.id,
    title: contract.title,
    content: contract.content as string, // Type casting to string as required by PublicContract
    client_name: contract.client_name,
    client_website: contract.client_website,
    status: contract.status,
    created_at: contract.created_at,
    updated_at: contract.updated_at,
    client_signed: contract.client_signed || false,
    client_signed_at: contract.client_signed_at,
    client_signature: contract.client_signature,
    admin_signed: contract.admin_signed || false,
    admin_signed_at: contract.admin_signed_at,
    admin_signature: contract.admin_signature,
    shared_url: contract.shared_url,
    content_type: contract.content_type,
    original_id: contract.original_id,
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <AnimatedContainer animation="fade">
        <ContractHeader contract={publicContract} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="mb-4 w-full grid grid-cols-2">
            <TabsTrigger value="view">Ver contrato</TabsTrigger>
            <TabsTrigger 
              value="sign" 
              disabled={contract.client_signed || contract.status === 'expired' || contract.status === 'cancelled'}
            >
              Firmar contrato
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="view" className="border p-6 rounded-lg min-h-[50vh]">
            <ContractContent 
              contract={publicContract} 
              onOpenSignDialog={handleOpenSignDialog}
              onPrint={handlePrint}
              loading={false}
              error={null}
              onSign={handleSign}
              isSignDialogOpen={isSignDialogOpen}
              setIsSignDialogOpen={setIsSignDialogOpen}
            />
          </TabsContent>
          
          <TabsContent value="sign">
            <ContractSign 
              contract={publicContract}
              onSign={handleSign} 
              onCancel={() => setActiveTab('view')} 
            />
          </TabsContent>
        </Tabs>
      </AnimatedContainer>
    </div>
  );
};

export default SharedContract;
