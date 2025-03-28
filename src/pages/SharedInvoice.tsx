
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { InvoiceContent, InvoiceHeader, InvoiceActions } from '@/components/shared-invoice';
import type { SharedInvoice as SharedInvoiceType } from '@/components/shared-invoice';
import { toast } from 'sonner';

// Component for displaying a shared invoice
const SharedInvoice = () => {
  const { sharedUrl } = useParams<{ sharedUrl: string }>();
  const [invoice, setInvoice] = useState<SharedInvoiceType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to handle printing the invoice
  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    async function fetchInvoice() {
      if (!sharedUrl) return;
      
      try {
        setIsLoading(true);
        
        console.log("Fetching invoice with shared URL:", sharedUrl);
        
        // Fetch from public_invoices directly (no RLS, no authentication required)
        const { data, error: fetchError } = await supabase
          .from('public_invoices')
          .select('*')
          .eq('shared_url', sharedUrl)
          .single();
        
        if (fetchError) {
          console.error("Error fetching invoice:", fetchError);
          throw new Error(fetchError.message);
        }
        
        if (!data) {
          throw new Error('Factura no encontrada');
        }
        
        console.log("Invoice data retrieved successfully:", data);
        
        // Aseguramos que el status sea uno de los valores permitidos
        const validStatus = ['pending', 'paid', 'cancelled', 'overdue'] as const;
        const status = validStatus.includes(data.status as any) 
          ? data.status as 'pending' | 'paid' | 'cancelled' | 'overdue'
          : 'pending'; // Valor por defecto si no es válido
        
        // Convertimos los datos obtenidos al tipo SharedInvoiceType
        const formattedInvoice: SharedInvoiceType = {
          id: data.id,
          title: data.title,
          description: data.description,
          amount: data.amount,
          status: status,
          due_date: data.due_date,
          payment_method: data.payment_method,
          payment_date: data.payment_date,
          payment_instructions: data.payment_instructions || '', // Handle case when payment_instructions is undefined
          shared_url: data.shared_url,
          created_at: data.created_at,
          updated_at: data.updated_at,
          client_name: data.client_name,
          client_website: data.client_website
        };
        
        setInvoice(formattedInvoice);
      } catch (err: any) {
        console.error("Error in fetchInvoice:", err);
        setError(err.message || 'No se pudo cargar la factura');
        
        toast.error('Error', { 
          description: err.message || 'No se pudo cargar la factura'
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchInvoice();
  }, [sharedUrl]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-lg font-medium">Cargando factura...</p>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full p-6 bg-background/80 backdrop-blur-sm rounded-lg shadow-lg border border-red-200">
          <h1 className="text-2xl font-bold text-center text-red-600 mb-4">Error al cargar la factura</h1>
          <p className="text-center text-muted-foreground mb-6">
            {error || 'La factura solicitada no existe o ha sido eliminada.'}
          </p>
          <div className="flex justify-center">
            <a
              href="/"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Volver al inicio
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-background/80 backdrop-blur-sm rounded-lg shadow-lg border border-primary/10 overflow-hidden">
        <InvoiceHeader 
          invoice={invoice}
          onPrint={handlePrint}
        />
        
        <InvoiceContent 
          invoice={invoice}
        />
        
        <InvoiceActions 
          invoice={invoice}
          onPrint={handlePrint}
        />
      </div>
    </div>
  );
};

export default SharedInvoice;
