
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SharedInvoice } from './types';

const useInvoiceData = (sharedUrl: string) => {
  const [invoice, setInvoice] = useState<SharedInvoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);

  const fetchInvoice = useCallback(async () => {
    if (!sharedUrl) {
      setError('URL no válida');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Check if invoice is password protected
      const { data: protectionData, error: protectionError } = await supabase.rpc(
        'check_invoice_password_protection', 
        { shared_url_param: sharedUrl }
      );
      
      if (protectionError) throw new Error(protectionError.message);
      
      setIsPasswordProtected(protectionData === true);
      
      // Fetch invoice data from public_invoices view
      const { data, error } = await supabase
        .from('public_invoices')
        .select('*')
        .eq('shared_url', sharedUrl)
        .maybeSingle();

      if (error) throw new Error(error.message);

      if (!data) {
        throw new Error('Factura no encontrada');
      } 

      // Type assertion to ensure TypeScript understands the structure
      // Convert to SharedInvoice type
      const formattedInvoice: SharedInvoice = {
        id: data.id,
        title: data.title || '',
        description: data.description || '',
        amount: data.amount || 0,
        status: data.status as 'pending' | 'paid' | 'cancelled' | 'overdue',
        due_date: data.due_date,
        payment_method: data.payment_method,
        payment_date: data.payment_date,
        payment_instructions: data.payment_instructions || '',
        shared_url: data.shared_url,
        created_at: data.created_at,
        updated_at: data.updated_at,
        client_name: data.client_name || '',
        client_website: data.client_website
      };
      
      setInvoice(formattedInvoice);
    } catch (err: any) {
      console.error('Error fetching shared invoice:', err);
      setError(err.message || 'Error al cargar la factura');
    } finally {
      setIsLoading(false);
    }
  }, [sharedUrl]);

  useEffect(() => {
    fetchInvoice();
  }, [fetchInvoice]);

  return {
    invoice,
    isLoading,
    error,
    isPasswordProtected,
    refetch: fetchInvoice
  };
};

export default useInvoiceData;
