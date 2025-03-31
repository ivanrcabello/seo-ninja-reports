
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProposalContent, ProposalHeader } from '@/components/shared-proposal';
import PasswordProtectionDialog from '@/components/shared/PasswordProtectionDialog';
import { toast } from 'sonner';
import { useProposalData } from '@/components/shared-proposal/hooks/useProposalData';

const SharedProposal: React.FC = () => {
  const { proposalId = '' } = useParams<{ proposalId: string }>();
  const [passwordInput, setPasswordInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [showError, setShowError] = useState(false);
  
  const { 
    proposal,
    loading, // Note: using loading instead of isLoading
    error,
    isPasswordProtected,
    isPasswordVerified, // Note: using isPasswordVerified instead of accessGranted
    verifyPassword,
    handlePrint
  } = useProposalData(proposalId);
  
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
  
  // Show password protection dialog
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
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 print:bg-white">
      <div className="container mx-auto px-4 py-8 print:py-2 max-w-4xl">
        <div className="bg-white dark:bg-slate-900 shadow-md rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden print:shadow-none print:border-0">
          {proposal ? (
            <>
              <ProposalHeader proposal={proposal} />
              <ProposalContent proposal={proposal} onPrint={handlePrint} />
            </>
          ) : loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="w-8 h-8 border-4 border-t-primary border-slate-200 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-red-500 mb-2">Error</h2>
              <p className="text-slate-600 dark:text-slate-400">{error || 'No se pudo cargar la propuesta.'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SharedProposal;
