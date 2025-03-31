
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { 
  ContractHeader, 
  ContractContent, 
  SignatureSection, 
  ContractActions,
  useContractData 
} from '@/components/shared-contract';
import { PublicContract } from '@/components/shared-contract/types';
import PasswordProtectionDialog from '@/components/shared/PasswordProtectionDialog';
import { toast } from 'sonner';
import type { SharedContract as SharedContractType } from '@/types/shared-content';

const SharedContract: React.FC = () => {
  const { contractId = '' } = useParams<{ contractId: string }>();
  const [passwordInput, setPasswordInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isSignDialogOpen, setIsSignDialogOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const { 
    contract, 
    isLoading,
    error,
    isPasswordProtected, 
    accessGranted, 
    verifyPassword,
    signContract,
    logo
  } = useContractData(contractId);
  
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
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleSign = async (signature: string) => {
    if (!contract) return;
    
    try {
      const success = await signContract(signature);
      
      if (success) {
        setIsSignDialogOpen(false);
        toast.success('Contrato firmado correctamente');
      } else {
        toast.error('No se pudo firmar el contrato');
      }
    } catch (err) {
      console.error('Error signing contract:', err);
      toast.error('Error al firmar el contrato');
    }
  };
  
  // Convert SharedContract to PublicContract for compatibility
  const adaptedContract = contract ? {
    ...contract,
    status: contract.status
  } as PublicContract : null;
  
  // Show password protection dialog
  if (isPasswordProtected && !accessGranted) {
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
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 print:bg-white">
      {logo && (
        <div className="flex justify-center pt-8 print:pt-0">
          <img
            src={logo}
            alt="Company Logo"
            className="h-12 mx-auto mb-6 print:mb-2"
          />
        </div>
      )}
      
      <div className="container mx-auto px-4 py-8 print:py-2 max-w-4xl">
        <div className="bg-white dark:bg-slate-900 shadow-md rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden print:shadow-none print:border-0"
          ref={contentRef}
        >
          {contract && (
            <>
              <ContractHeader 
                contract={adaptedContract}
                logo={null}
              />
              
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 p-6">
                  <ContractContent
                    loading={isLoading}
                    error={error}
                    contract={adaptedContract}
                    onOpenSignDialog={() => setIsSignDialogOpen(true)}
                    onPrint={handlePrint}
                    onSign={handleSign}
                    isSignDialogOpen={isSignDialogOpen}
                    setIsSignDialogOpen={setIsSignDialogOpen}
                  />
                </div>
                
                <div className="hidden md:block w-64 p-6 bg-slate-50 dark:bg-slate-900/60 border-l border-slate-200 dark:border-slate-800 print:hidden">
                  <ContractActions
                    contract={contract}
                    onOpenSignDialog={() => setIsSignDialogOpen(true)} 
                    onPrint={handlePrint}
                  />
                </div>
              </div>
            </>
          )}
          
          {isLoading && (
            <div className="flex justify-center items-center p-12">
              <div className="w-8 h-8 border-4 border-t-primary border-slate-200 rounded-full animate-spin"></div>
            </div>
          )}
          
          {error && !isLoading && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-red-500 mb-2">Error</h2>
              <p className="text-slate-600 dark:text-slate-400">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SharedContract;
