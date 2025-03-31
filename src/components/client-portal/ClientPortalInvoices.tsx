
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Calendar, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { clientPortalLogger } from '@/services/clientPortalLoggingService';
import { clientPortalApi } from '@/services/clientPortalApiService';
import { Badge } from '@/components/ui/badge';

interface Invoice {
  id: string;
  title: string;
  amount: number;
  status: string;
  created_at: string;
  due_date?: string;
  shared_url?: string;
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
        
        const data = await clientPortalApi.getInvoices(clientId);
        clientPortalLogger.info(`Successfully fetched ${data.length} invoices`, { count: data.length }, 'ClientPortalInvoices');
        setInvoices(data);
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

  const viewInvoice = (invoice: Invoice) => {
    if (invoice.shared_url) {
      // Open in a new tab with proper URL structure
      window.open(`/shared/invoices/${invoice.shared_url}`, '_blank');
    } else {
      toast.error('Esta factura no tiene un enlace compartido válido');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'pagada':
        return <Badge className="bg-green-500">Pagada</Badge>;
      case 'pending':
      case 'pendiente':
        return <Badge className="bg-yellow-500">Pendiente</Badge>;
      case 'overdue':
      case 'vencida':
        return <Badge className="bg-red-500">Vencida</Badge>;
      case 'cancelled':
      case 'cancelada':
        return <Badge variant="outline">Cancelada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tus Facturas</h2>
      <p className="text-muted-foreground">
        Aquí encontrarás todas tus facturas y podrás ver su estado.
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
                <div 
                  key={invoice.id} 
                  className="flex justify-between items-center p-3 border rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                  onClick={() => viewInvoice(invoice)}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{invoice.title}</h3>
                      {getStatusBadge(invoice.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(invoice.amount)}</span>
                      {invoice.due_date && (
                        <span className="ml-2">
                          <Calendar className="inline h-3 w-3 mr-1" />
                          Vence: {format(new Date(invoice.due_date), 'dd/MM/yyyy')}
                        </span>
                      )}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      viewInvoice(invoice);
                    }}
                    disabled={!invoice.shared_url}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Ver factura
                    <ExternalLink className="h-3 w-3 ml-1" />
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
