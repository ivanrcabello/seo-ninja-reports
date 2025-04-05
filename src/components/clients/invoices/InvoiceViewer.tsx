import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ClientInvoice } from '@/types/client.types';
import { FileText, Printer, Share, CreditCard } from 'lucide-react';
import { useClientInvoices } from '@/hooks/useClientInvoices';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import ShareInvoiceDialog from './ShareInvoiceDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface InvoiceViewerProps {
  invoice: ClientInvoice;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientName?: string;
}

const InvoiceViewer: React.FC<InvoiceViewerProps> = ({
  invoice,
  open,
  onOpenChange,
  clientName
}) => {
  const { markAsPaid } = useClientInvoices();
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Clean up component state when closing
  React.useEffect(() => {
    if (!open) {
      console.log("InvoiceViewer closing, resetting dialog states");
      setIsShareDialogOpen(false);
      setPaymentMethod('');
    }
  }, [open]);

  const handlePrintInvoice = useCallback(() => {
    console.log("Printing invoice with ID:", invoice.id);
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      console.error('Failed to open print window');
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Factura: ${invoice.title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            .invoice-header { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .invoice-details { margin-bottom: 30px; }
            .invoice-table { width: 100%; border-collapse: collapse; }
            .invoice-table th, .invoice-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .invoice-table tr:nth-child(even) { background-color: #f2f2f2; }
            .invoice-total { margin-top: 30px; text-align: right; }
            .footer { margin-top: 60px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="invoice-header">
            <div>
              <h2>FACTURA</h2>
              <p>Fecha: ${format(new Date(invoice.created_at), 'PPP', { locale: es })}</p>
              ${invoice.due_date ? `<p>Vencimiento: ${format(new Date(invoice.due_date), 'PPP', { locale: es })}</p>` : ''}
            </div>
            <div>
              <h3>Estado: ${invoice.status === 'paid' ? 'PAGADA' : 
                        invoice.status === 'pending' ? 'PENDIENTE' : 
                        invoice.status === 'overdue' ? 'VENCIDA' : 
                        invoice.status === 'cancelled' ? 'CANCELADA' : invoice.status}</h3>
              ${invoice.payment_date ? `<p>Fecha de pago: ${format(new Date(invoice.payment_date), 'PPP', { locale: es })}</p>` : ''}
              ${invoice.payment_method ? `<p>Método de pago: ${invoice.payment_method}</p>` : ''}
            </div>
          </div>
          
          <div class="invoice-details">
            <h3>Cliente</h3>
            <p>${clientName || 'Cliente'}</p>
          </div>
          
          <h3>${invoice.title}</h3>
          ${invoice.description ? `<p>${invoice.description}</p>` : ''}
          
          <table class="invoice-table">
            <thead>
              <tr>
                <th>Concepto</th>
                <th>Importe</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${invoice.title}</td>
                <td>${invoice.amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</td>
              </tr>
            </tbody>
          </table>
          
          <div class="invoice-total">
            <h3>Total: ${invoice.amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</h3>
          </div>
          
          <div class="footer">
            <p>Gracias por confiar en nuestros servicios</p>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Wait for content to load before printing
    setTimeout(() => {
      printWindow.print();
    }, 300);
  }, [invoice, clientName]);

  const handleOpenShareDialog = useCallback(() => {
    console.log("Opening share dialog");
    setIsShareDialogOpen(true);
  }, []);

  const handleMarkAsPaid = useCallback(async () => {
    if (!paymentMethod) {
      toast.error('Por favor selecciona un método de pago');
      return;
    }

    setIsProcessingPayment(true);
    try {
      await markAsPaid(invoice.id, paymentMethod);
      onOpenChange(false);
    } catch (error) {
      console.error('Error marking invoice as paid:', error);
    } finally {
      setIsProcessingPayment(false);
    }
  }, [invoice.id, paymentMethod, markAsPaid, onOpenChange]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'overdue':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Pagada';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelada';
      case 'overdue':
        return 'Vencida';
      default:
        return status;
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {invoice.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="text-sm text-muted-foreground">
            <p>Creada: {format(new Date(invoice.created_at), 'PPP', { locale: es })}</p>
            {invoice.due_date && (
              <p>Vencimiento: {format(new Date(invoice.due_date), 'PPP', { locale: es })}</p>
            )}
            <p className="mt-2">
              Estado: <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(invoice.status)}`}>
                {getStatusLabel(invoice.status)}
              </span>
            </p>
          </div>
          
          <div className="bg-white border rounded-md p-6">
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-bold">Factura a nombre de: {clientName}</h3>
              
              {invoice.description && (
                <div>
                  <p className="text-sm text-muted-foreground">Descripción:</p>
                  <p>{invoice.description}</p>
                </div>
              )}
              
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">Importe total:</p>
                <p className="text-3xl font-bold">
                  {invoice.amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                </p>
              </div>
              
              {invoice.payment_instructions && (
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-md">
                  <p className="font-medium text-blue-800 mb-2">Instrucciones de pago:</p>
                  <p className="text-blue-700 whitespace-pre-line">{invoice.payment_instructions}</p>
                </div>
              )}
              
              {invoice.payment_method && (
                <div>
                  <p className="text-sm text-muted-foreground">Método de pago:</p>
                  <p>{invoice.payment_method}</p>
                </div>
              )}
              
              {invoice.payment_date && (
                <div>
                  <p className="text-sm text-muted-foreground">Fecha de pago:</p>
                  <p>{format(new Date(invoice.payment_date), 'PPP', { locale: es })}</p>
                </div>
              )}
            </div>
          </div>
          
          {invoice.status === 'pending' && (
            <div className="flex flex-col gap-4 p-4 border rounded-md bg-muted/20">
              <h4 className="font-medium">Registrar pago</h4>
              <div className="flex flex-wrap gap-4 items-end">
                <div className="w-full sm:w-auto flex-1">
                  <Select
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Método de pago" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transferencia">Transferencia bancaria</SelectItem>
                      <SelectItem value="tarjeta">Tarjeta de crédito</SelectItem>
                      <SelectItem value="efectivo">Efectivo</SelectItem>
                      <SelectItem value="bizum">Bizum</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleMarkAsPaid}
                  disabled={!paymentMethod || isProcessingPayment}
                  className="gap-2"
                >
                  <CreditCard className="h-4 w-4" />
                  {isProcessingPayment ? 'Procesando...' : 'Marcar como pagada'}
                </Button>
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap justify-between items-center gap-4 mt-4">
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={handlePrintInvoice}
                className="gap-2"
              >
                <Printer className="h-4 w-4" />
                Imprimir
              </Button>
              <Button
                variant="outline"
                onClick={handleOpenShareDialog}
                className="gap-2"
              >
                <Share className="h-4 w-4" />
                Compartir
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {isShareDialogOpen && (
        <ShareInvoiceDialog
          open={isShareDialogOpen}
          onOpenChange={setIsShareDialogOpen}
          invoiceId={invoice.id}
          invoiceTitle={invoice.title}
          clientName={clientName || 'Cliente'}
          clientWebsite={invoice.client_website}
        />
      )}
    </>
  );
};

export default InvoiceViewer;
