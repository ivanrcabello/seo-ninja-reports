
import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { InvoiceHeader, InvoiceContent, InvoiceActions, useInvoiceData } from '@/components/shared-invoice';

const SharedInvoice = () => {
  const { id } = useParams<{ id: string }>();
  const { invoice, isLoading, error } = useInvoiceData(id || '');

  const handlePrint = useCallback(() => {
    if (!invoice) return;
    
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
              <p>Fecha: ${new Date(invoice.created_at).toLocaleDateString('es-ES')}</p>
              ${invoice.due_date ? `<p>Vencimiento: ${new Date(invoice.due_date).toLocaleDateString('es-ES')}</p>` : ''}
            </div>
            <div>
              <h3>Estado: ${invoice.status === 'paid' ? 'PAGADA' : 
                        invoice.status === 'pending' ? 'PENDIENTE' : 
                        invoice.status === 'overdue' ? 'VENCIDA' : 
                        invoice.status === 'cancelled' ? 'CANCELADA' : invoice.status}</h3>
              ${invoice.payment_date ? `<p>Fecha de pago: ${new Date(invoice.payment_date).toLocaleDateString('es-ES')}</p>` : ''}
              ${invoice.payment_method ? `<p>Método de pago: ${invoice.payment_method}</p>` : ''}
            </div>
          </div>
          
          <div class="invoice-details">
            <h3>Cliente</h3>
            <p>${invoice.client_name}</p>
            ${invoice.client_website ? `<p>${invoice.client_website}</p>` : ''}
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
  }, [invoice]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando factura...</p>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-2">Factura no encontrada</h1>
          <p className="text-muted-foreground mb-4">
            {error || "No se pudo encontrar la factura solicitada. El enlace podría haber caducado o ser incorrecto."}
          </p>
          <a 
            href="/"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Volver a la página principal
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <InvoiceHeader invoice={invoice} onPrint={handlePrint} />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <InvoiceContent invoice={invoice} />
          </div>
          <div>
            <InvoiceActions invoice={invoice} onPrint={handlePrint} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedInvoice;
