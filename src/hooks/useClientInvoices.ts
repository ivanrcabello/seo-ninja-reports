
import { useState, useCallback } from 'react';
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
      const { data, error } = await supabase
        .from('client_invoices')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setInvoices(data as ClientInvoice[]);
    } catch (err: any) {
      console.error('Error fetching invoices:', err);
      setError(err.message || 'Error al cargar facturas');
      toast.error(err.message || 'Error al cargar facturas');
    } finally {
      setIsLoading(false);
    }
  }, [clientId]);

  const createInvoice = useCallback(async (invoice: Omit<ClientInvoice, 'id' | 'created_at' | 'updated_at'>) => {
    if (!clientId) return null;

    try {
      const { data, error } = await supabase
        .from('client_invoices')
        .insert({ ...invoice, client_id: clientId })
        .select()
        .single();

      if (error) throw error;

      toast.success('Factura creada correctamente');
      return data as ClientInvoice;
    } catch (err: any) {
      console.error('Error creating invoice:', err);
      toast.error(err.message || 'Error al crear factura');
      return null;
    }
  }, [clientId]);

  const updateInvoice = useCallback(async (id: string, updates: Partial<ClientInvoice>) => {
    try {
      const { data, error } = await supabase
        .from('client_invoices')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast.success('Factura actualizada correctamente');
      return data as ClientInvoice;
    } catch (err: any) {
      console.error('Error updating invoice:', err);
      toast.error(err.message || 'Error al actualizar factura');
      return null;
    }
  }, []);

  const deleteInvoice = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('client_invoices')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Factura eliminada correctamente');
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

      toast.success('Factura marcada como pagada');
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
