
import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SharedInvoice } from './types';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

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
            {/* Client Information */}
            <div className="space-y-3">
              <h3 className="font-medium text-base">Datos del cliente</h3>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cliente</p>
                <p className="text-lg font-semibold">{invoice.client_name}</p>
                {invoice.client_website && (
                  <p className="text-sm text-muted-foreground">{invoice.client_website}</p>
                )}
                {invoice.client_tax_id && (
                  <p className="text-sm text-muted-foreground">DNI/CIF: {invoice.client_tax_id}</p>
                )}
                {invoice.client_address && (
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{invoice.client_address}</p>
                )}
              </div>
            </div>
            
            {/* Invoice Information */}
            <div className="space-y-3">
              <h3 className="font-medium text-base">Datos de la factura</h3>
              <div>
                {invoice.invoice_number && (
                  <div className="mb-2">
                    <p className="text-sm font-medium text-muted-foreground">Número de factura</p>
                    <p className="font-semibold">{invoice.invoice_number}</p>
                  </div>
                )}
                
                <p className="text-sm font-medium text-muted-foreground mt-2">Fecha de emisión</p>
                <p>{format(new Date(invoice.created_at), 'PPP', { locale: es })}</p>
                
                {invoice.due_date && (
                  <>
                    <p className="text-sm font-medium text-muted-foreground mt-2">Fecha de vencimiento</p>
                    <p>{format(new Date(invoice.due_date), 'PPP', { locale: es })}</p>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Billing entity information */}
          {(invoice.billing_name || invoice.billing_tax_id || invoice.billing_address || invoice.billing_email) && (
            <>
              <Separator />
              <div>
                <h3 className="font-medium text-base mb-2">Datos del emisor</h3>
                {invoice.billing_name && <p className="font-semibold">{invoice.billing_name}</p>}
                {invoice.billing_tax_id && <p className="text-sm">DNI/CIF: {invoice.billing_tax_id}</p>}
                {invoice.billing_address && <p className="text-sm whitespace-pre-line">{invoice.billing_address}</p>}
                {invoice.billing_email && <p className="text-sm">{invoice.billing_email}</p>}
              </div>
            </>
          )}
          
          <Separator />
          
          <div className="pt-2">
            <h3 className="text-lg font-semibold mb-4">{invoice.title}</h3>
            {invoice.description && (
              <p className="mb-4 text-muted-foreground">{invoice.description}</p>
            )}
            
            <div className="bg-muted p-4 rounded-md mb-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Importe total {invoice.includes_vat !== false ? '(IVA incluido)' : ''}</span>
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
      
      {/* Opciones de Pago */}
      <Card>
        <CardHeader>
          <CardTitle>Opciones de Pago</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Para realizar el pago de esta factura, por favor contacta con nosotros a través del formulario de contacto.</p>
          
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
            <Mail className="mr-2 h-4 w-4" /> Contactar para pagar
          </Button>
          
          <div className="mt-6 space-y-2">
            <h4 className="font-medium">Información importante:</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              <li>Para facturación, contacta con nuestro departamento financiero.</li>
              {invoice.due_date ? (
                <li>Fecha de vencimiento: {format(new Date(invoice.due_date), 'PPP', { locale: es })}</li>
              ) : (
                <li>Fecha de vencimiento: No especificada</li>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>
      
      {/* Contact Information Footer - Using fiscal settings instead of hardcoded values */}
      <div className="text-center text-sm text-muted-foreground py-4 border-t">
        <p className="font-medium mb-2">¿Necesitas ayuda?</p>
        <p className="mb-1">{invoice.billing_email || "info@seo-ninja.es"}</p>
        <p className="mb-1">{invoice.billing_phone || "+34 654 633 796"}</p>
        <p>{invoice.billing_address || "C/ Mestre Racional 1, 46005 Valencia"}</p>
      </div>
    </div>
  );
};

export default InvoiceContent;
