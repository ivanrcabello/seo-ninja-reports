
import { useState, useEffect, useCallback } from 'react';
import { SharedInvoice } from '@/types/shared-content';
import { 
  fetchInvoiceBySharedUrl,
  checkInvoiceExists, 
  checkInvoicePassword,
  verifyInvoicePassword,
  logInvoiceAccess
} from '@/api/shared-content';

export const useInvoiceData = (sharedUrl: string) => {
  const [invoice, setInvoice] = useState<SharedInvoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);

  const fetchInvoice = useCallback(async () => {
    if (!sharedUrl) {
      setError('URL de factura no proporcionada');
      setIsLoading(false);
      return;
    }

    console.log(`Starting fetch for invoice with shared URL: ${sharedUrl}`);
    setIsLoading(true);
    setError(null);

    try {
      // First check if invoice exists
      const { exists, error: existsError } = await checkInvoiceExists(sharedUrl);
      
      if (existsError) {
        console.error('Error checking if invoice exists:', existsError);
      } else if (!exists) {
        setError('La factura no existe');
        setIsLoading(false);
        logInvoiceAccess(sharedUrl, { successful: false, error: 'Invoice not found' }, 'check');
        return;
      }
      
      // Check password protection
      const { isProtected, error: passwordError } = await checkInvoicePassword(sharedUrl);
      
      if (passwordError) {
        console.error('Error checking invoice password:', passwordError);
      } else {
        setIsPasswordProtected(isProtected);
        console.log(`Invoice is password protected: ${isProtected}`);
        
        // If password protected and access not granted, don't fetch content yet
        if (isProtected && !accessGranted) {
          setIsLoading(false);
          return;
        }
      }

      // Fetch invoice data
      const { invoice: invoiceData, error: fetchError } = await fetchInvoiceBySharedUrl(sharedUrl);
      
      if (fetchError) {
        throw fetchError;
      }
      
      if (!invoiceData) {
        setError('No se pudo encontrar la factura solicitada');
        logInvoiceAccess(sharedUrl, { successful: false, error: 'Invoice data not found' }, 'data_not_found');
      } else {
        setInvoice(invoiceData);
        logInvoiceAccess(sharedUrl, { successful: true }, 'view');
      }
    } catch (err: any) {
      console.error('Error fetching shared invoice:', err);
      setError(err.message || 'Error al cargar la factura');
      
      // Log error
      logInvoiceAccess(sharedUrl, { successful: false, error: err.message || 'Unknown error' }, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [sharedUrl, accessGranted]);

  const verifyPassword = async (password: string): Promise<boolean> => {
    try {
      const success = await verifyInvoicePassword(sharedUrl, password);
      
      if (success) {
        setAccessGranted(success);
      }
      
      return success;
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  };

  useEffect(() => {
    if (sharedUrl) {
      fetchInvoice();
    }
  }, [fetchInvoice]);

  return {
    invoice,
    isLoading,
    error,
    isPasswordProtected,
    accessGranted,
    verifyPassword,
    refetch: fetchInvoice
  };
};
