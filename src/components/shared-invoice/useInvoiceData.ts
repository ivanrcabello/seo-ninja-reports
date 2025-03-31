
import { useState, useEffect, useCallback } from 'react';
import { SharedInvoice } from '@/types/shared-content';
import { 
  fetchInvoiceBySharedUrl, 
  checkInvoiceExists, 
  checkInvoicePassword,
  verifyInvoicePassword,
  logInvoiceAccess
} from '@/api/shared-content';

const useInvoiceData = (sharedUrl: string) => {
  const [invoice, setInvoice] = useState<SharedInvoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);

  const fetchInvoice = useCallback(async () => {
    if (!sharedUrl) {
      setError('URL no válida');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Check if invoice exists
      const { exists, error: existsError } = await checkInvoiceExists(sharedUrl);
      
      if (existsError) {
        console.error('Error checking if invoice exists:', existsError);
        throw existsError;
      }
      
      if (!exists) {
        throw new Error('La factura no existe');
      }
      
      // Check if invoice is password protected
      const { isProtected, error: protectionError } = await checkInvoicePassword(sharedUrl);
      
      if (protectionError) {
        console.error('Error checking invoice password protection:', protectionError);
      } else {
        setIsPasswordProtected(isProtected);
        
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
        throw new Error('No se pudo encontrar la factura solicitada');
      }
      
      setInvoice(invoiceData);
      logInvoiceAccess(sharedUrl, { successful: true }, 'view');
      
    } catch (err: any) {
      console.error('Error fetching shared invoice:', err);
      setError(err.message || 'Error al cargar la factura');
      logInvoiceAccess(sharedUrl, { successful: false, error: err.message || 'Unknown error' }, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [sharedUrl, accessGranted]);

  const verifyPassword = async (password: string): Promise<boolean> => {
    try {
      const success = await verifyInvoicePassword(sharedUrl, password);
      
      if (success) {
        setAccessGranted(true);
        // Re-fetch with access granted
        fetchInvoice();
      }
      
      return success;
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchInvoice();
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

export default useInvoiceData;
