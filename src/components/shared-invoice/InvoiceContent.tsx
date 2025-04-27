
import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SharedInvoice } from './types';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

interface InvoiceContentProps {
  invoice: SharedInvoice;
}

const InvoiceContent: React.FC<InvoiceContentProps> = ({ invoice }) => {
  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-none">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-1">Factura: {invoice.title}</h2>
          {invoice.client_name && (
            <p className="text-muted-foreground mb-4">{invoice.client_name}</p>
          )}
          
          <div className="bg-muted/30 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold mb-6">Detalles de la Factura</h3>
            
            <div className="grid gap-8 sm:grid-cols-2">
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
                
                {invoice.invoice_number && (
                  <p className="font-medium">
                    Número: <span className="font-semibold">{invoice.invoice_number}</span>
                  </p>
                )}
                
                <p className="font-medium">
                  Fecha de emisión: <span>{format(new Date(invoice.created_at), 'd MMMM yyyy', { locale: es })}</span>
                </p>
                
                {invoice.due_date && (
                  <p className="font-medium">
                    Fecha de vencimiento: <span>{format(new Date(invoice.due_date), 'd MMMM yyyy', { locale: es })}</span>
                  </p>
                )}
              </div>
            </div>
            
            {/* Concepto y detalles */}
            <div className="mt-8">
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
                        {invoice.amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                      </td>
                      <td className="text-right p-3 border-b">
                        {invoice.amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="bg-muted/20">
                      <td colSpan={2} className="p-3"></td>
                      <td className="text-right p-3 font-medium">Subtotal</td>
                      <td className="text-right p-3 font-semibold">
                        {(invoice.includes_vat !== false
                          ? (invoice.amount / 1.21).toFixed(2)
                          : invoice.amount
                        ).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                      </td>
                    </tr>
                    {invoice.includes_vat !== false && (
                      <tr className="bg-muted/20">
                        <td colSpan={2} className="p-3"></td>
                        <td className="text-right p-3 font-medium">IVA 21%</td>
                        <td className="text-right p-3 font-semibold">
                          {((invoice.amount / 1.21) * 0.21).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                        </td>
                      </tr>
                    )}
                    <tr className="bg-muted/40">
                      <td colSpan={2} className="p-3"></td>
                      <td className="text-right p-3 font-semibold">Total {invoice.includes_vat !== false ? '(IVA incluido)' : ''}</td>
                      <td className="text-right p-3 font-bold text-lg">
                        {invoice.amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
          
          {/* Información del emisor */}
          {(invoice.billing_name || invoice.billing_tax_id || invoice.billing_address) && (
            <div className="mb-6">
              <h4 className="text-muted-foreground font-medium mb-2">Datos del emisor</h4>
              <div className="space-y-1">
                {invoice.billing_name && <p className="font-semibold">{invoice.billing_name}</p>}
                {invoice.billing_tax_id && <p className="text-sm">NIF/CIF: {invoice.billing_tax_id}</p>}
                {invoice.billing_address && <p className="text-sm whitespace-pre-line">{invoice.billing_address}</p>}
              </div>
            </div>
          )}
          
          {/* Estado de pago */}
          {invoice.status === 'paid' && (
            <div className="bg-green-50 border border-green-100 p-4 rounded-md mb-6">
              <h4 className="font-medium text-green-800 mb-1">Información de pago</h4>
              <p className="text-sm text-green-700">
                Esta factura fue pagada el {invoice.payment_date && format(new Date(invoice.payment_date), 'd MMMM yyyy', { locale: es })}
                {invoice.payment_method && ` mediante ${invoice.payment_method}`}.
              </p>
            </div>
          )}
          
          {/* Instrucciones de pago */}
          {invoice.payment_instructions && (
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-md mb-6">
              <h4 className="font-medium text-blue-800 mb-1">Instrucciones de pago</h4>
              <p className="text-blue-700 whitespace-pre-line">{invoice.payment_instructions}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Opciones de Pago */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4">Opciones de Pago</h3>
          
          <p className="mb-4">Para realizar el pago de esta factura, por favor contacta con nosotros a través del formulario de contacto.</p>
          
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
            <Mail className="mr-2 h-4 w-4" /> Contactar para pagar
          </Button>
          
          <div className="mt-6 space-y-2">
            <h4 className="font-medium">Información importante:</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              <li>Para facturación, contacta con nuestro departamento financiero.</li>
              {invoice.due_date ? (
                <li>Fecha de vencimiento: {format(new Date(invoice.due_date), 'd MMMM yyyy', { locale: es })}</li>
              ) : (
                <li>Fecha de vencimiento: No especificada</li>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>
      
      {/* Footer con información de contacto */}
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
