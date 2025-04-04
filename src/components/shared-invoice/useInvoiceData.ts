
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SharedInvoice } from './types';

export const useInvoiceData = (sharedUrl: string | undefined) => {
  const [invoice, setInvoice] = useState<SharedInvoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      if (!sharedUrl) {
        setIsLoading(false);
        setError('Missing shared URL');
        return;
      }

      try {
        setIsLoading(true);
        
        // Get invoice data using the function
        const { data, error } = await supabase
          .rpc('get_public_invoice_by_shared_url', { shared_url_param: sharedUrl });
          
        if (error) throw error;
        
        // Check if we got results
        if (!data || (Array.isArray(data) && data.length === 0)) {
          throw new Error('Invoice not found');
        }
        
        // Extract the invoice data (it might be an array with one element)
        const invoiceData = Array.isArray(data) ? data[0] : data;
        
        setInvoice(invoiceData as SharedInvoice);
      } catch (error: any) {
        console.error('Error fetching invoice data:', error);
        setError(error.message || 'Error loading invoice');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInvoiceData();
  }, [sharedUrl]);

  return { invoice, isLoading, error };
};
