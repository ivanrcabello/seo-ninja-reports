
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useInvoiceData, InvoiceHeader, InvoiceContent, InvoiceActions } from '@/components/shared-invoice';
import PasswordProtectionDialog from '@/components/shared/PasswordProtectionDialog';
import { toast } from 'sonner';
import { SharedInvoice as SharedInvoiceType } from '@/types/shared-content';

const SharedInvoice: React.FC = () => {
  const { invoiceId = '' } = useParams<{ invoiceId: string }>();
  const [passwordInput, setPasswordInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [showError, setShowError] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const { 
    invoice, 
    isLoading, 
    error,
    isPasswordProtected, 
    accessGranted, 
    verifyPassword,
    refetch
  } = useInvoiceData(invoiceId);
  
  // Load company logo if available
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        // In a real implementation, you'd fetch this from settings or API
        // For now we'll just use a placeholder or nothing
        setLogo(null);
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
    };
    
    fetchLogo();
  }, []);
  
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
  
  // Show password protection dialog
  if (isPasswordProtected && !accessGranted) {
    return (
      <PasswordProtectionDialog
        isOpen={true}
        onClose={() => {}}
        title="Factura Protegida"
        description="Esta factura está protegida con contraseña. Por favor, introduce la contraseña para acceder."
        password={passwordInput}
        setPassword={setPasswordInput}
        onVerify={handleVerifyPassword}
        isVerifying={verifying}
        showError={showError}
        errorMessage="Contraseña incorrecta. Por favor, inténtalo de nuevo."
      />
    );
  }
  
  // Adapt invoice to type compatibility if needed
  const adaptedInvoice = invoice ? {
    ...invoice,
    // Ensure required fields are present
    created_at: invoice.created_at || new Date().toISOString(),
    status: invoice.status as SharedInvoiceType['status']
  } : null;
  
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
          {adaptedInvoice && (
            <>
              <InvoiceHeader 
                invoice={adaptedInvoice} 
                onPrint={handlePrint}
              />
              
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 p-6">
                  <InvoiceContent invoice={adaptedInvoice} />
                </div>
                
                <div className="hidden md:block w-64 p-6 bg-slate-50 dark:bg-slate-900/60 border-l border-slate-200 dark:border-slate-800 print:hidden">
                  <InvoiceActions 
                    invoice={adaptedInvoice} 
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

export default SharedInvoice;
