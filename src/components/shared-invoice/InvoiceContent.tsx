
import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SharedInvoice } from './types';

interface InvoiceContentProps {
  invoice: SharedInvoice;
}

const InvoiceContent: React.FC<InvoiceContentProps> = ({ invoice }) => {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Detalles de la Factura</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cliente</p>
              <p className="text-lg font-semibold">{invoice.client_name}</p>
              {invoice.client_website && (
                <p className="text-sm text-muted-foreground">{invoice.client_website}</p>
              )}
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Fecha de emisión</p>
              <p>{format(new Date(invoice.created_at), 'PPP', { locale: es })}</p>
              
              {invoice.due_date && (
                <>
                  <p className="text-sm font-medium text-muted-foreground mt-2">Fecha de vencimiento</p>
                  <p>{format(new Date(invoice.due_date), 'PPP', { locale: es })}</p>
                </>
              )}
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <h3 className="text-lg font-semibold mb-4">{invoice.title}</h3>
            {invoice.description && (
              <p className="mb-4 text-muted-foreground">{invoice.description}</p>
            )}
            
            <div className="bg-muted p-4 rounded-md mb-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Importe total</span>
                <span className="text-2xl font-bold">
                  {invoice.amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                </span>
              </div>
            </div>
            
            {invoice.payment_instructions && (
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-md mb-4">
                <h4 className="font-medium text-blue-800 mb-2">Instrucciones de pago</h4>
                <p className="text-blue-700 whitespace-pre-line">{invoice.payment_instructions}</p>
              </div>
            )}
            
            {invoice.status === 'paid' && (
              <div className="bg-green-50 border border-green-100 p-4 rounded-md">
                <h4 className="font-medium text-green-800 mb-2">Información de pago</h4>
                <p className="text-sm text-green-700">
                  Esta factura fue pagada el {invoice.payment_date && format(new Date(invoice.payment_date), 'PPP', { locale: es })}
                  {invoice.payment_method && ` mediante ${invoice.payment_method}`}.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceContent;
