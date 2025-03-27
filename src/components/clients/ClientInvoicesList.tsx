
import React from 'react';
import { Client } from '@/types/client.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import BlurredCard from '@/components/ui/BlurredCard';
import { FileText, PlusCircle, Receipt } from 'lucide-react';
import { useClientInvoices } from '@/hooks/useClientInvoices';
import { format } from 'date-fns';

interface ClientInvoicesListProps {
  client: Client;
}

const ClientInvoicesList: React.FC<ClientInvoicesListProps> = ({ client }) => {
  const { 
    invoices,
    isLoading,
    fetchInvoices,
    createInvoice
  } = useClientInvoices(client.id);

  React.useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleCreateInvoice = () => {
    // This would typically open a dialog to create a new invoice
    console.log('Create invoice for', client.name);
  };

  return (
    <BlurredCard>
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <CardTitle className="text-xl">Facturas</CardTitle>
          <CardDescription>
            {isLoading ? 'Cargando...' : `${invoices?.length || 0} facturas para ${client.name}`}
          </CardDescription>
        </div>
        <Button onClick={handleCreateInvoice} className="mt-4 sm:mt-0">
          <PlusCircle className="h-4 w-4 mr-1.5" /> Nueva Factura
        </Button>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse">Cargando facturas...</div>
          </div>
        ) : invoices && invoices.length > 0 ? (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div 
                key={invoice.id}
                className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-medium">{invoice.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {invoice.description || 'Sin descripción'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-base font-medium">
                      {invoice.amount.toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'EUR'
                      })}
                    </div>
                    <div className={`px-2 py-1 text-xs rounded-full ${
                      invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                      invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {invoice.status === 'pending' ? 'Pendiente' :
                       invoice.status === 'paid' ? 'Pagada' :
                       invoice.status === 'overdue' ? 'Vencida' : 'Cancelada'}
                    </div>
                    {invoice.due_date && (
                      <div className="text-xs text-muted-foreground">
                        Vence: {format(new Date(invoice.due_date), 'dd/MM/yyyy')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No hay facturas aún</h3>
            <p className="text-muted-foreground mb-6">
              Crea tu primera factura para {client.name}
            </p>
            <Button onClick={handleCreateInvoice}>
              <PlusCircle className="h-4 w-4 mr-1.5" /> Nueva Factura
            </Button>
          </div>
        )}
      </CardContent>
    </BlurredCard>
  );
};

export default ClientInvoicesList;
