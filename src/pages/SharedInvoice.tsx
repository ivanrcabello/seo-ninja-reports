
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { InvoiceContent, InvoiceHeader, InvoiceActions } from '@/components/shared-invoice';
import type { SharedInvoice as SharedInvoiceType } from '@/components/shared-invoice/types';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import PasswordProtectionDialog from '@/components/shared-content/PasswordProtectionDialog';
import { 
  checkContentPasswordProtection, 
  verifyContentPassword
} from '@/api/shared-content/utils';
import { getSharedInvoice } from '@/services/sharedContentService';

const SharedInvoice = () => {
  const { sharedUrl } = useParams<{ sharedUrl: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<SharedInvoiceType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);

  const handleBackToHome = () => {
    navigate('/');
  };

  const handlePrint = () => {
    window.print();
  };

  const verifyPassword = async (password: string) => {
    try {
      const verified = await verifyContentPassword(sharedUrl || '', 'invoice', password);
      
      if (verified) {
        setAccessGranted(true);
        setIsPasswordDialogOpen(false);
        toast.success('Acceso concedido');
        fetchInvoice();
      } else {
        toast.error('Contraseña incorrecta');
      }
    } catch (err: any) {
      console.error("Error verifying password:", err);
      toast.error('Error al verificar la contraseña');
    }
  };

  const fetchInvoice = async () => {
    if (!sharedUrl) return;
    
    try {
      setIsLoading(true);
      
      console.log("Fetching invoice with shared URL:", sharedUrl);
      
      const isProtected = await checkContentPasswordProtection(sharedUrl, 'invoice');
      
      if (isProtected && !accessGranted) {
        setIsPasswordProtected(true);
        setIsPasswordDialogOpen(true);
        setIsLoading(false);
        return;
      }
      
      const response = await getSharedInvoice(sharedUrl);
      
      if (response.error) {
        console.error("Error fetching invoice:", response.error);
        throw new Error(response.error);
      }
      
      if (!response.data) {
        throw new Error('Factura no encontrada');
      }
      
      console.log("Invoice data retrieved successfully:", response.data);
      
      setInvoice(response.data as SharedInvoiceType);
    } catch (err: any) {
      console.error("Error in fetchInvoice:", err);
      setError(err.message || 'No se pudo cargar la factura');
      
      toast.error('Error', { 
        description: err.message || 'No se pudo cargar la factura'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchInvoice();
  }, [sharedUrl]);

  if (isPasswordDialogOpen) {
    return (
      <PasswordProtectionDialog 
        onSubmit={verifyPassword}
        onCancel={() => {
          setError('Acceso denegado');
          setIsPasswordDialogOpen(false);
        }}
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
          <div className="text-center flex flex-col items-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-center text-red-600 mb-4">Error al cargar la factura</h1>
            <p className="text-center text-muted-foreground mb-6">
              {error || 'La factura solicitada no existe o ha sido eliminada.'}
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
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Button 
          onClick={handleBackToHome} 
          variant="ghost" 
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al inicio
        </Button>
      
        <div className="bg-background/80 backdrop-blur-sm rounded-lg shadow-lg border border-primary/10 overflow-hidden">
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
    </div>
  );
};

export default SharedInvoice;
