import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { clientPortalLogger } from '@/services/clientPortalLoggingService';

interface Invoice {
  id: string;
  title: string;
  amount: number;
  status: string;
  due_date?: string;
  created_at: string;
}

interface ClientPortalInvoicesProps {
  clientId: string;
}

const ClientPortalInvoices: React.FC<ClientPortalInvoicesProps> = ({ clientId }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        clientPortalLogger.info('Fetching invoices for client', { clientId }, 'ClientPortalInvoices');
        
        // Fetch the client token from localStorage
        const sessionString = localStorage.getItem('clientPortalSession');
        if (!sessionString) {
          throw new Error('No active session found');
        }
        
        const session = JSON.parse(sessionString);
        const clientToken = session.token;
        
        // Using the headers object directly in the RPC call
        const { data, error } = await supabase.rpc(
          'get_client_portal_invoices',
          { client_id_param: clientId },
          { headers: { 'x-client-token': clientToken } }
        );

        if (error) {
          clientPortalLogger.error('Error fetching invoices', error, 'ClientPortalInvoices');
          console.error('Error fetching invoices:', error);
          throw error;
        }
        
        clientPortalLogger.info(`Successfully fetched ${data?.length || 0} invoices`, { count: data?.length }, 'ClientPortalInvoices');
        console.log('Invoices data:', data);
        setInvoices(data || []);
      } catch (err: any) {
        console.error('Error fetching invoices:', err);
        clientPortalLogger.error('Error fetching invoices', err, 'ClientPortalInvoices');
        toast.error('Error al cargar las facturas');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [clientId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Pagada</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pendiente</Badge>;
      case 'overdue':
        return <Badge className="bg-red-500">Vencida</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-500">Cancelada</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const viewInvoice = (id: string) => {
    // Open invoice in new tab or modal
    window.open(`/invoices/${id}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tus Facturas</h2>
      <p className="text-muted-foreground">
        Revisa tus facturas y su estado de pago.
      </p>
      
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : invoices.length > 0 ? (
            <div className="space-y-4">
              {invoices.map(invoice => (
                <div key={invoice.id} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div>
                    <h3 className="font-medium">{invoice.title}</h3>
                    <div className="flex space-x-3 text-sm text-muted-foreground">
                      <span>{formatCurrency(invoice.amount)}</span>
                      <span>•</span>
                      <span>{getStatusBadge(invoice.status)}</span>
                      {invoice.due_date && (
                        <>
                          <span>•</span>
                          <span>Vence: {format(new Date(invoice.due_date), 'dd/MM/yyyy')}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => viewInvoice(invoice.id)}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Ver factura
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No hay facturas disponibles en este momento.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientPortalInvoices;
