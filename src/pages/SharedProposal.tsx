
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProposalData } from '@/components/shared-proposal/hooks/useProposalData';
import { ProposalContent, ProposalHeader } from '@/components/shared-proposal';
import { PasswordProtectionDialog } from '@/components/shared';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const SharedProposal: React.FC = () => {
  const { proposalId } = useParams<{ proposalId: string }>();
  const [passwordInput, setPasswordInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [showError, setShowError] = useState(false);
  
  const { 
    proposal, 
    loading, 
    error, 
    isPasswordProtected, 
    isPasswordVerified,
    verifyPassword,
    handlePrint,
    refetch
  } = useProposalData(proposalId || '');

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

  if (isPasswordProtected && !isPasswordVerified) {
    return (
      <PasswordProtectionDialog
        isOpen={true}
        onClose={() => {}}
        title="Propuesta Protegida"
        description="Esta propuesta está protegida con contraseña. Por favor, introduce la contraseña para acceder."
        password={passwordInput}
        setPassword={setPasswordInput}
        onVerify={handleVerifyPassword}
        isVerifying={verifying}
        showError={showError}
        errorMessage="Contraseña incorrecta. Por favor, inténtalo de nuevo."
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-medium">Cargando propuesta...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-6 bg-background border border-border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-red-600 dark:text-red-500">Error</h2>
          <p className="mb-4 text-muted-foreground">{error}</p>
          <button 
            onClick={() => refetch()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-6 bg-background border border-border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Propuesta no encontrada</h2>
          <p className="text-muted-foreground mb-6">La propuesta que buscas no existe o ha sido eliminada.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ProposalHeader proposal={proposal} />
      <div className="container mx-auto py-8">
        <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
          <ProposalContent proposal={proposal} onPrint={handlePrint} />
        </div>
      </div>
    </div>
  );
};

export default SharedProposal;
