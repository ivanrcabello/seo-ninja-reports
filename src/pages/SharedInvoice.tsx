
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useInvoiceData } from '@/components/shared-invoice/hooks/useInvoiceData';
import PasswordProtectionDialog from '@/components/shared/PasswordProtectionDialog';
import { toast } from 'sonner';
import InvoiceViewer from '@/components/shared-invoice/InvoiceViewer';

const SharedInvoice: React.FC = () => {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const [passwordInput, setPasswordInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [showError, setShowError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const { 
    invoice, 
    isLoading, 
    error, 
    isPasswordProtected, 
    accessGranted,
    verifyPassword 
  } = useInvoiceData({ invoiceId: invoiceId || '' });

  const handleRetry = () => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      window.location.reload();
    }
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="bg-destructive/10 text-destructive p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Error al cargar la factura</h2>
          <p className="mb-4">{error}</p>
          <button 
            onClick={handleRetry} 
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            disabled={retryCount >= 3}
          >
            Intentar de nuevo
          </button>
          {retryCount >= 3 && (
            <p className="mt-4 text-sm">
              Se ha superado el número máximo de intentos. Por favor, contacta con soporte.
            </p>
          )}
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="bg-muted p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-4">Factura no encontrada</h2>
          <p className="mb-4">Esta factura no existe o ha sido eliminada.</p>
          <button 
            onClick={handleRetry} 
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return <InvoiceViewer invoice={invoice} />;
};

export default SharedInvoice;
