
import { useState, useEffect } from 'react';
import { SharedInvoice, AccessLogOptions } from '@/types/shared-content';
import { 
  fetchInvoiceBySharedUrl, 
  checkInvoiceExists, 
  checkInvoicePassword, 
  verifyInvoicePassword, 
  logInvoiceAccess 
} from '@/api/shared-content';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

export const useInvoiceData = (invoiceId?: string) => {
  const [invoice, setInvoice] = useState<SharedInvoice | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState<boolean>(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState<boolean>(false);
  const params = useParams<{ invoiceId: string }>();
  
  // Use the invoiceId from props or from route params
  const id = invoiceId || params.invoiceId;

  const fetchInvoice = async (password?: string) => {
    if (!id) {
      setError('Invalid invoice ID');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Check if invoice exists
      const { exists, error: existsError } = await checkInvoiceExists(id);
      
      if (existsError) {
        throw existsError;
      }
      
      if (!exists) {
        setError('Invoice not found');
        setLoading(false);
        
        const options: AccessLogOptions = { 
          successful: false, 
          error: 'Invoice not found' 
        };
        logInvoiceAccess(id, options, 'check');
        return;
      }

      // Check if password protected
      const { isProtected, error: protectedError } = await checkInvoicePassword(id);
      
      if (protectedError) {
        throw protectedError;
      }
      
      setIsPasswordProtected(isProtected);
      
      // If not password protected or password is already verified, fetch invoice
      if (!isProtected || isPasswordVerified || password) {
        const { invoice, error: fetchError } = await fetchInvoiceBySharedUrl(id);
        
        if (fetchError) {
          throw fetchError;
        }
        
        if (invoice) {
          setInvoice(invoice);
          
          // Log successful access
          const options: AccessLogOptions = { successful: true };
          logInvoiceAccess(id, options, 'view');
        } else {
          setError('Invoice not found');
          
          // Log failed access
          const options: AccessLogOptions = { 
            successful: false, 
            error: 'Invoice data not found' 
          };
          logInvoiceAccess(id, options, 'data_not_found');
        }
      }
    } catch (err: any) {
      console.error('Error fetching invoice:', err);
      setError(err.message || 'Failed to load invoice');
      
      // Log error
      const options: AccessLogOptions = { 
        successful: false, 
        error: err.message || 'Unknown error' 
      };
      logInvoiceAccess(id, options, 'error');
    } finally {
      setLoading(false);
    }
  };

  const verifyPassword = async (password: string): Promise<boolean> => {
    if (!id) return false;

    try {
      const verified = await verifyInvoicePassword(id, password);
      
      if (verified) {
        setIsPasswordVerified(true);
        await fetchInvoice(password);
        return true;
      } else {
        toast.error('Invalid password');
        return false;
      }
    } catch (err) {
      console.error('Error verifying password:', err);
      toast.error('Error verifying password');
      return false;
    }
  };

  useEffect(() => {
    if (id) {
      fetchInvoice();
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  return {
    invoice,
    loading,
    error,
    isPasswordProtected,
    isPasswordVerified,
    verifyPassword,
    handlePrint
  };
};

export default useInvoiceData;
