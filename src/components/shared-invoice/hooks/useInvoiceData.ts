
import { useState, useEffect } from 'react';
import { SharedInvoice, SharedInvoiceResponse } from '@/types/shared-content';
import { fetchInvoiceBySharedUrl, verifyInvoicePassword, logInvoiceAccess } from '@/api/shared-content/invoices';

interface UseInvoiceDataParams {
  invoiceId: string;
}

interface UseInvoiceDataResult {
  invoice: SharedInvoice | null;
  isLoading: boolean;
  error: string | null;
  isPasswordProtected: boolean;
  accessGranted: boolean;
  verifyPassword: (password: string) => Promise<boolean>;
}

export const useInvoiceData = ({ invoiceId }: UseInvoiceDataParams): UseInvoiceDataResult => {
  const [invoice, setInvoice] = useState<SharedInvoice | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState<boolean>(false);
  const [accessGranted, setAccessGranted] = useState<boolean>(false);

  useEffect(() => {
    const loadInvoice = async () => {
      if (!invoiceId) {
        setError('Invoice ID is required');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response: SharedInvoiceResponse = await fetchInvoiceBySharedUrl(invoiceId);
        
        if (response.error) {
          throw response.error;
        }

        if (response.data) {
          setInvoice(response.data);
          
          // Check if invoice is password protected
          const passwordProtected = !!response.data.password;
          setIsPasswordProtected(passwordProtected);
          
          if (!passwordProtected) {
            setAccessGranted(true);
          }
          
          // Log access
          logInvoiceAccess(invoiceId, { 
            successful: true 
          }, 'view');
        } else {
          logInvoiceAccess(invoiceId, { 
            successful: false,
            error: 'Invoice not found' 
          }, 'not_found');
          
          throw new Error('Invoice not found');
        }
      } catch (err: any) {
        setError(err.message || 'Error al cargar la factura');
        console.error('Error loading invoice:', err);
        
        logInvoiceAccess(invoiceId, { 
          successful: false,
          error: err.message || 'Unknown error' 
        }, 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadInvoice();
  }, [invoiceId]);

  const verifyPassword = async (password: string): Promise<boolean> => {
    try {
      const isValid = await verifyInvoicePassword(invoiceId, password);
      
      if (isValid) {
        setAccessGranted(true);
        
        // Log successful password attempt
        logInvoiceAccess(invoiceId, { 
          successful: true 
        }, 'password');
      } else {
        // Log failed password attempt
        logInvoiceAccess(invoiceId, { 
          successful: false,
          error: 'Invalid password' 
        }, 'password');
      }
      
      return isValid;
    } catch (err) {
      console.error('Error verifying password:', err);
      return false;
    }
  };

  return {
    invoice,
    isLoading,
    error,
    isPasswordProtected,
    accessGranted,
    verifyPassword
  };
};
