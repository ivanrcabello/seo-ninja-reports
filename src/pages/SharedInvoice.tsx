
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { InvoiceHeader, InvoiceContent, InvoiceActions } from '@/components/shared-invoice';
import { fetchInvoiceBySharedUrl } from '@/api/shared-content';
import { checkContentExists, checkContentPasswordProtection, verifyContentPassword } from '@/api/shared-content';
import { PasswordProtectionDialog } from '@/components/shared-content/PasswordProtectionDialog';
import { SharedInvoice, SharedContentStatus } from '@/types/shared-content';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const SharedInvoicePage = () => {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const [invoice, setInvoice] = useState<SharedInvoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);

  const fetchInvoice = async (password?: string) => {
    if (!invoiceId) {
      setError('No invoice ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // First check if the invoice exists
      const { exists, error: existsError } = await checkContentExists(invoiceId, 'invoice');
      
      if (existsError) {
        throw existsError;
      }
      
      if (!exists) {
        setError('Invoice not found');
        setLoading(false);
        return;
      }

      // Check if password protected
      const { isProtected, error: protectedError } = await checkContentPasswordProtection(invoiceId, 'invoice');
      
      if (protectedError) {
        throw protectedError;
      }
      
      setIsPasswordProtected(isProtected);
      
      // If password protected and no password provided, wait for password input
      if (isProtected && !password) {
        setIsPasswordVerified(false);
        setLoading(false);
        return;
      }
      
      // If password protected and password provided, verify it first
      if (isProtected && password) {
        const validPassword = await verifyContentPassword(invoiceId, 'invoice', password);
        
        if (!validPassword) {
          setError('Invalid password');
          setIsPasswordVerified(false);
          setLoading(false);
          return;
        }
        
        setIsPasswordVerified(true);
      } else if (!isProtected) {
        // If not password protected, mark as verified
        setIsPasswordVerified(true);
      }

      // Fetch the invoice
      const fetchedInvoice = await fetchInvoiceBySharedUrl(invoiceId);
      
      if (fetchedInvoice) {
        // Ensure it meets the SharedInvoice requirements
        const completeInvoice: SharedInvoice = {
          id: fetchedInvoice.id,
          title: fetchedInvoice.title,
          description: fetchedInvoice.description,
          amount: fetchedInvoice.amount,
          status: fetchedInvoice.status as SharedContentStatus,
          due_date: fetchedInvoice.due_date,
          payment_method: fetchedInvoice.payment_method,
          payment_date: fetchedInvoice.payment_date,
          payment_instructions: fetchedInvoice.payment_instructions,
          shared_url: fetchedInvoice.shared_url,
          created_at: fetchedInvoice.created_at || new Date().toISOString(),
          updated_at: fetchedInvoice.updated_at || new Date().toISOString(),
          client_name: fetchedInvoice.client_name,
          client_website: fetchedInvoice.client_website
        };
        setInvoice(completeInvoice);
      } else {
        setError('Invoice not found');
      }
    } catch (err: any) {
      console.error('Error fetching invoice:', err);
      setError(err.message || 'Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  const verifyPassword = async (password: string) => {
    try {
      const validPassword = await verifyContentPassword(invoiceId!, 'invoice', password);
      
      if (validPassword) {
        setIsPasswordVerified(true);
        fetchInvoice(password);
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

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    if (invoiceId) {
      fetchInvoice();
    }
  }, [invoiceId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg">Cargando factura...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="p-8 border rounded-lg bg-red-50 max-w-md">
          <h1 className="text-2xl font-bold text-red-700 mb-4">Error</h1>
          <p className="text-red-600 mb-6">{error}</p>
          <p className="text-gray-500">
            La factura solicitada no está disponible o ha expirado.
          </p>
        </div>
      </div>
    );
  }

  if (isPasswordProtected && !isPasswordVerified) {
    return <PasswordProtectionDialog onVerifyPassword={verifyPassword} contentType="factura" />;
  }

  if (!invoice) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="p-8 border rounded-lg bg-yellow-50 max-w-md">
          <h1 className="text-2xl font-bold text-yellow-700 mb-4">Factura no encontrada</h1>
          <p className="text-gray-600 mb-6">
            La factura solicitada no está disponible o ha expirado.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <InvoiceHeader invoice={invoice} />
      <InvoiceContent invoice={invoice} />
      <InvoiceActions 
        invoice={invoice}
        onPrint={handlePrint}
      />
    </div>
  );
};

export default SharedInvoicePage;
