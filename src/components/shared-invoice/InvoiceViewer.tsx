
import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { SharedInvoice } from './types';
import { useInvoiceData } from './useInvoiceData';

interface InvoiceViewerProps {
  invoice: SharedInvoice;
  onPrint?: () => void;
}

const InvoiceViewer: React.FC<InvoiceViewerProps> = ({ invoice }) => {
  const { formatCurrency, includesVat } = useInvoiceData(invoice);

  return (
    <div className="w-full max-w-4xl mx-auto print:shadow-none">
      <div className="bg-white border rounded-lg shadow-sm p-6 print:shadow-none print:border-none">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold">Factura: {invoice.title}</h2>
            {invoice.invoice_number && (
              <p className="text-sm text-muted-foreground">Nº: {invoice.invoice_number}</p>
            )}
          </div>
          
          <div className="mt-2 sm:mt-0">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
              invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {
                invoice.status === 'paid' ? 'Pagada' :
                invoice.status === 'pending' ? 'Pendiente' :
                invoice.status === 'overdue' ? 'Vencida' :
                'Cancelada'
              }
            </div>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 mb-8">
          {/* Datos del cliente */}
          <div className="space-y-2">
            <h4 className="text-muted-foreground font-medium">Datos del cliente</h4>
            <p className="font-semibold text-lg">{invoice.client_name}</p>
            {invoice.client_website && (
              <p className="text-sm text-blue-600">
                <a href={invoice.client_website.startsWith('http') ? invoice.client_website : `https://${invoice.client_website}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline">
                  {invoice.client_website}
                </a>
              </p>
            )}
            {invoice.client_tax_id && (
              <p className="text-sm">NIF/CIF: {invoice.client_tax_id}</p>
            )}
            {invoice.client_address && (
              <p className="text-sm whitespace-pre-line">{invoice.client_address}</p>
            )}
          </div>
          
          {/* Datos de la factura */}
          <div className="space-y-2">
            <h4 className="text-muted-foreground font-medium">Datos de la factura</h4>
            
            <p className="font-medium">
              Fecha de emisión: <span>{format(new Date(invoice.created_at), 'd MMMM yyyy', { locale: es })}</span>
            </p>
            
            {invoice.due_date && (
              <p className="font-medium">
                Fecha de vencimiento: <span>{format(new Date(invoice.due_date), 'd MMMM yyyy', { locale: es })}</span>
              </p>
            )}
            
            {invoice.status === 'paid' && invoice.payment_date && (
              <p className="font-medium">
                Fecha de pago: <span>{format(new Date(invoice.payment_date), 'd MMMM yyyy', { locale: es })}</span>
              </p>
            )}
            
            {invoice.status === 'paid' && invoice.payment_method && (
              <p className="font-medium">
                Método de pago: <span>{invoice.payment_method}</span>
              </p>
            )}
          </div>
        </div>
        
        {/* Información del emisor */}
        {(invoice.billing_name || invoice.billing_tax_id || invoice.billing_address) && (
          <div className="mb-8">
            <h4 className="text-muted-foreground font-medium mb-2">Datos del emisor</h4>
            <div className="space-y-1">
              {invoice.billing_name && <p className="font-semibold">{invoice.billing_name}</p>}
              {invoice.billing_tax_id && <p className="text-sm">NIF/CIF: {invoice.billing_tax_id}</p>}
              {invoice.billing_address && <p className="text-sm whitespace-pre-line">{invoice.billing_address}</p>}
            </div>
          </div>
        )}
        
        {/* Concepto y detalles */}
        <div className="mb-8">
          <h4 className="text-muted-foreground font-medium mb-2">{invoice.description ? 'Descripción' : 'Concepto'}</h4>
          <div className="border rounded-md overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-3 border-b">Concepto</th>
                  <th className="text-right p-3 border-b">Cantidad</th>
                  <th className="text-right p-3 border-b">Precio</th>
                  <th className="text-right p-3 border-b">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border-b">
                    {invoice.description || invoice.title}
                  </td>
                  <td className="text-right p-3 border-b">1</td>
                  <td className="text-right p-3 border-b">
                    {formatCurrency(invoice.amount)}
                  </td>
                  <td className="text-right p-3 border-b">
                    {formatCurrency(invoice.amount)}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="bg-muted/20">
                  <td colSpan={2} className="p-3"></td>
                  <td className="text-right p-3 font-medium">Subtotal</td>
                  <td className="text-right p-3 font-semibold">
                    {includesVat
                      ? formatCurrency(invoice.amount / 1.21)
                      : formatCurrency(invoice.amount)
                    }
                  </td>
                </tr>
                {includesVat && (
                  <tr className="bg-muted/20">
                    <td colSpan={2} className="p-3"></td>
                    <td className="text-right p-3 font-medium">IVA 21%</td>
                    <td className="text-right p-3 font-semibold">
                      {formatCurrency((invoice.amount / 1.21) * 0.21)}
                    </td>
                  </tr>
                )}
                <tr className="bg-muted/40">
                  <td colSpan={2} className="p-3"></td>
                  <td className="text-right p-3 font-semibold">Total {includesVat ? '(IVA incluido)' : ''}</td>
                  <td className="text-right p-3 font-bold text-lg">
                    {formatCurrency(invoice.amount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        
        {/* Instrucciones de pago */}
        {invoice.payment_instructions && (
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-md mb-6">
            <h4 className="font-medium text-blue-800 mb-1">Instrucciones de pago</h4>
            <p className="text-blue-700 whitespace-pre-line">{invoice.payment_instructions}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceViewer;
