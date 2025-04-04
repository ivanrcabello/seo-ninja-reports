
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ClientInvoice } from '@/types/client.types';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export const useClientInvoices = (clientId?: string) => {
  const [invoices, setInvoices] = useState<ClientInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = useCallback(async () => {
    if (!clientId) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log("Fetching invoices for client:", clientId);
      const { data, error } = await supabase
        .from('client_invoices')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log("Invoices fetched:", data);
      setInvoices(data as ClientInvoice[]);
    } catch (err: any) {
      console.error('Error fetching invoices:', err);
      setError(err.message || 'Error al cargar facturas');
      toast.error(err.message || 'Error al cargar facturas');
    } finally {
      setIsLoading(false);
    }
  }, [clientId]);

  // Fetch invoices initially
  useEffect(() => {
    if (clientId) {
      fetchInvoices();
    }
  }, [clientId, fetchInvoices]);

  const createInvoice = useCallback(async (invoice: Omit<ClientInvoice, 'id' | 'created_at' | 'updated_at'>) => {
    if (!clientId) return null;

    try {
      console.log("Creating invoice:", invoice);
      const { data, error } = await supabase
        .from('client_invoices')
        .insert({ ...invoice, client_id: clientId })
        .select()
        .single();

      if (error) throw error;

      console.log("Invoice created:", data);
      toast.success('Factura creada correctamente');
      
      // Update local state with the new invoice
      setInvoices(prev => [data as ClientInvoice, ...prev]);
      
      return data as ClientInvoice;
    } catch (err: any) {
      console.error('Error creating invoice:', err);
      toast.error(err.message || 'Error al crear factura');
      return null;
    }
  }, [clientId]);

  const updateInvoice = useCallback(async (id: string, updates: Partial<ClientInvoice>) => {
    try {
      console.log("Updating invoice:", id, updates);
      const { data, error } = await supabase
        .from('client_invoices')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      console.log("Invoice updated:", data);
      toast.success('Factura actualizada correctamente');
      
      // Update local state with the updated invoice
      setInvoices(prev => 
        prev.map(invoice => invoice.id === id ? (data as ClientInvoice) : invoice)
      );
      
      return data as ClientInvoice;
    } catch (err: any) {
      console.error('Error updating invoice:', err);
      toast.error(err.message || 'Error al actualizar factura');
      return null;
    }
  }, []);

  const deleteInvoice = useCallback(async (id: string) => {
    try {
      console.log("Deleting invoice:", id);
      const { error } = await supabase
        .from('client_invoices')
        .delete()
        .eq('id', id);

      if (error) throw error;

      console.log("Invoice deleted");
      toast.success('Factura eliminada correctamente');
      
      // Update local state to remove the deleted invoice
      setInvoices(prev => prev.filter(invoice => invoice.id !== id));
      
      return true;
    } catch (err: any) {
      console.error('Error deleting invoice:', err);
      toast.error(err.message || 'Error al eliminar factura');
      return false;
    }
  }, []);

  const generateShareUrl = useCallback(async (id: string) => {
    try {
      // Generate a UUID for the shared URL
      const sharedUrl = uuidv4();
      
      const { data, error } = await supabase
        .from('client_invoices')
        .update({ shared_url: sharedUrl })
        .eq('id', id)
        .select('shared_url')
        .single();

      if (error) throw error;

      // Update the local state with the new shared_url
      setInvoices(prev => 
        prev.map(invoice => 
          invoice.id === id ? { ...invoice, shared_url: sharedUrl } : invoice
        )
      );

      return data.shared_url;
    } catch (err: any) {
      console.error('Error generating share URL:', err);
      toast.error(err.message || 'Error al generar enlace compartido');
      throw err;
    }
  }, []);

  const markAsPaid = useCallback(async (id: string, paymentMethod: string) => {
    const now = new Date().toISOString();
    try {
      console.log("Marking invoice as paid:", id);
      const { data, error } = await supabase
        .from('client_invoices')
        .update({ 
          status: 'paid', 
          payment_date: now,
          payment_method: paymentMethod
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      console.log("Invoice marked as paid:", data);
      toast.success('Factura marcada como pagada');
      
      // Update local state with the updated invoice
      setInvoices(prev => 
        prev.map(invoice => invoice.id === id ? (data as ClientInvoice) : invoice)
      );
      
      return data as ClientInvoice;
    } catch (err: any) {
      console.error('Error updating invoice payment status:', err);
      toast.error(err.message || 'Error al actualizar estado de pago');
      return null;
    }
  }, []);

  return {
    invoices,
    isLoading,
    error,
    fetchInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    generateShareUrl,
    markAsPaid
  };
};
