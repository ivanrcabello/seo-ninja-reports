
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calendar, Download, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { SharedInvoice } from './types';

interface InvoiceViewerProps {
  invoice: SharedInvoice;
  onPrint?: () => void;
}

const InvoiceViewer: React.FC<InvoiceViewerProps> = ({ invoice, onPrint }) => {
  // Format the price as a currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  // Format the date
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'No especificada';
    return format(new Date(dateString), 'PPP', { locale: es });
  };

  // Get status information
  const getStatusInfo = (status: string): { label: string; className: string } => {
    switch (status) {
      case 'paid':
        return { label: 'Pagada', className: 'bg-green-100 text-green-800' };
      case 'overdue':
        return { label: 'Vencida', className: 'bg-red-100 text-red-800' };
      case 'cancelled':
        return { label: 'Cancelada', className: 'bg-gray-100 text-gray-800' };
      case 'pending':
      default:
        return { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-800' };
    }
  };

  const statusInfo = getStatusInfo(invoice.status);

  return (
    <div className="w-full max-w-4xl mx-auto print:shadow-none">
      <Card className="shadow-md print:shadow-none print:border-none">
        <CardHeader className="bg-muted/30 print:bg-transparent border-b flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <div>
            <h2 className="text-2xl font-bold">{invoice.title}</h2>
            <div className="text-sm text-muted-foreground">
              Cliente: {invoice.client_name}
              {invoice.client_website && (
                <span> • <a href={invoice.client_website.startsWith('http') ? invoice.client_website : `https://${invoice.client_website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{invoice.client_website}</a></span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end">
            <Badge className={`${statusInfo.className} px-3 py-1 print:bg-transparent print:border print:border-current`}>
              {statusInfo.label}
            </Badge>
            <div className="text-sm text-muted-foreground mt-1">
              <Calendar className="inline h-3 w-3 mr-1" /> 
              Emitida: {formatDate(invoice.created_at)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          {/* Invoice details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Descripción</h3>
              <p className="whitespace-pre-line">{invoice.description || '—'}</p>
            </div>
            <div className="space-y-3">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Fecha de vencimiento</h3>
                <p>{formatDate(invoice.due_date)}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Estado de pago</h3>
                <Badge variant="outline" className={statusInfo.className.replace('bg-', 'text-')}>
                  {statusInfo.label}
                </Badge>
              </div>
              
              {invoice.status === 'paid' && invoice.payment_date && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Fecha de pago</h3>
                  <p>{formatDate(invoice.payment_date)}</p>
                </div>
              )}
            </div>
          </div>
          
          <Separator />
          
          {/* Payment instructions */}
          {invoice.payment_instructions && (
            <div>
              <h3 className="font-medium mb-2">Instrucciones de pago</h3>
              <div className="bg-muted/30 p-4 rounded-md whitespace-pre-line">
                {invoice.payment_instructions}
              </div>
            </div>
          )}
          
          {/* Payment method */}
          {invoice.payment_method && (
            <div>
              <h3 className="font-medium mb-2">Método de pago</h3>
              <p>{invoice.payment_method}</p>
            </div>
          )}
          
          <Separator />
          
          {/* Total amount */}
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Importe total</h3>
            <div className="text-2xl font-bold">{formatCurrency(invoice.amount)}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceViewer;
