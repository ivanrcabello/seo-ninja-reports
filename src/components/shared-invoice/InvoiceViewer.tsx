
import React from 'react';
import { SharedInvoice } from '@/types/shared-content';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FileText, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface InvoiceViewerProps {
  invoice: SharedInvoice;
}

const InvoiceViewer: React.FC<InvoiceViewerProps> = ({ invoice }) => {
  const { content } = invoice;
  
  // Extract invoice details from content
  const invoiceData = typeof content === 'string' ? JSON.parse(content) : content;
  
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      return format(new Date(dateStr), 'PPP', { locale: es });
    } catch (e) {
      return dateStr;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'overdue':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Pagada';
      case 'pending': return 'Pendiente';
      case 'cancelled': return 'Cancelada';
      case 'overdue': return 'Vencida';
      default: return status;
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6" />
              {invoice.title}
            </h1>
            <div className="text-sm text-muted-foreground mt-1">
              <p>Fecha: {formatDate(invoice.created_at)}</p>
              {invoiceData?.due_date && (
                <p>Vencimiento: {formatDate(invoiceData.due_date)}</p>
              )}
            </div>
          </div>
          
          <div className="mt-4 sm:mt-0">
            <Badge className={`${getStatusBadgeClass(invoice.status)} px-3 py-1`}>
              {getStatusLabel(invoice.status)}
            </Badge>
          </div>
        </div>
        
        <div className="bg-muted/20 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Detalles de la factura</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Cliente:</p>
              <p className="font-medium">{invoice.client_name}</p>
              
              {invoice.client_website && (
                <a
                  href={invoice.client_website.startsWith('http') ? invoice.client_website : `https://${invoice.client_website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm flex items-center gap-1 text-blue-600 hover:underline mt-1"
                >
                  {invoice.client_website}
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Importe:</p>
              <p className="text-2xl font-bold">
                {(invoiceData?.amount || 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </p>
            </div>
          </div>
          
          {invoiceData?.description && (
            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-1">Descripción:</p>
              <p>{invoiceData.description}</p>
            </div>
          )}
          
          {invoiceData?.payment_instructions && (
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 p-4 rounded">
              <p className="font-medium text-blue-800 dark:text-blue-300 mb-1">Instrucciones de pago:</p>
              <p className="text-blue-700 dark:text-blue-400 whitespace-pre-line">{invoiceData.payment_instructions}</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <Button variant="outline" onClick={handlePrintInvoice} className="mr-2">
            Imprimir factura
          </Button>
        </div>
        
        <div className="mt-8 text-sm text-muted-foreground text-center">
          <p>Esta factura fue generada digitalmente y no requiere firma física.</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceViewer;
