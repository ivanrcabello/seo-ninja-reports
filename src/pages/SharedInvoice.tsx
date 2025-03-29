
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { InvoiceContent, InvoiceHeader, InvoiceActions, useInvoiceData } from '@/components/shared-invoice';
import type { SharedInvoice as SharedInvoiceType } from '@/components/shared-invoice/types';
import { toast } from 'sonner';
import PasswordProtectionDialog from '@/components/shared-content/PasswordProtectionDialog';

// Component for displaying a shared invoice
const SharedInvoice = () => {
  const { sharedUrl } = useParams<{ sharedUrl: string }>();
  const { 
    invoice, 
    isLoading, 
    error, 
    isPasswordProtected, 
    refetch 
  } = useInvoiceData(sharedUrl || '');
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);

  useEffect(() => {
    if (isPasswordProtected && !accessGranted) {
      setIsPasswordDialogOpen(true);
    }
  }, [isPasswordProtected, accessGranted]);

  // Function to handle printing the invoice
  const handlePrint = () => {
    window.print();
  };

  const verifyPassword = async (password: string) => {
    try {
      // Call function to verify password
      const { data, error: verifyError } = await supabase.rpc(
        'verify_shared_invoice_password', 
        { 
          shared_url_param: sharedUrl || '',
          password_param: password
        }
      );
      
      if (verifyError) throw new Error(verifyError.message);
      
      if (data === true) {
        setAccessGranted(true);
        setIsPasswordDialogOpen(false);
        toast.success('Acceso concedido');
        refetch();
      } else {
        toast.error('Contraseña incorrecta');
      }
    } catch (err: any) {
      console.error("Error verifying password:", err);
      toast.error('Error al verificar la contraseña');
    }
  };

  if (isPasswordDialogOpen) {
    return (
      <PasswordProtectionDialog 
        onSubmit={verifyPassword}
        onCancel={() => window.history.back()}
        type="invoice"
      />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-lg font-medium">Cargando factura...</p>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full p-6 bg-background/80 backdrop-blur-sm rounded-lg shadow-lg border border-red-200">
          <h1 className="text-2xl font-bold text-center text-red-600 mb-4">Error al cargar la factura</h1>
          <p className="text-center text-muted-foreground mb-6">
            {error || 'La factura solicitada no existe o ha sido eliminada.'}
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
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-background/80 backdrop-blur-sm rounded-lg shadow-lg border border-primary/10 overflow-hidden">
        <InvoiceHeader 
          invoice={invoice}
          onPrint={handlePrint}
        />
        
        <InvoiceContent 
          invoice={invoice}
        />
        
        <InvoiceActions 
          invoice={invoice}
          onPrint={handlePrint}
        />
      </div>
    </div>
  );
};

export default SharedInvoice;
