
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
      console.log(`Fetching invoice with shared URL: ${sharedUrl}`);
      
      // Check if invoice is password protected
      const { data: protectionData, error: protectionError } = await supabase.rpc(
        'check_invoice_password_protection', 
        { shared_url_param: sharedUrl }
      );
      
      if (protectionError) {
        console.error("Protection check error:", protectionError);
        throw new Error(protectionError.message);
      }
      
      setIsPasswordProtected(protectionData === true);
      console.log(`Invoice password protected: ${protectionData}`);
      
      // Fetch invoice data from public_invoices view
      const { data, error } = await supabase
        .from('public_invoices')
        .select('*')
        .eq('shared_url', sharedUrl)
        .maybeSingle();

      if (error) {
        console.error("Database fetch error:", error);
        throw new Error(error.message);
      }

      if (!data) {
        console.error("No invoice data found");
        throw new Error('Factura no encontrada');
      } 

      console.log("Raw invoice data from DB:", data);
      
      // Type assertion to ensure TypeScript understands the structure
      // Convert to SharedInvoice type
      const formattedInvoice: SharedInvoice = {
        id: data.id || '',
        title: data.title || '',
        description: data.description || '',
        amount: data.amount || 0,
        status: (data.status as 'pending' | 'paid' | 'cancelled' | 'overdue') || 'pending',
        due_date: data.due_date,
        payment_method: data.payment_method,
        payment_date: data.payment_date,
        // Use optional chaining and nullish coalescing for potentially missing fields
        payment_instructions: (data as any).payment_instructions || '',
        shared_url: data.shared_url || '',
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString(),
        client_name: data.client_name || '',
        client_website: data.client_website
      };
      
      console.log("Formatted invoice data:", formattedInvoice);
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
