
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SharedInvoice } from './types';

export function useInvoiceData(sharedUrl: string) {
  const [invoice, setInvoice] = useState<SharedInvoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoice = useCallback(async () => {
    if (!sharedUrl) {
      setError('URL no válida');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .rpc('get_public_invoice_by_shared_url', { shared_url_param: sharedUrl });

      if (error) throw error;

      if (!data || data.length === 0) {
        setError('Factura no encontrada');
        setInvoice(null);
      } else {
        setInvoice(data[0] as SharedInvoice);
      }
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
    refetch: fetchInvoice
  };
}

// We're removing the default export and only using named export
