
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SharedInvoice } from './types';
import { supabase } from '@/integrations/supabase/client';

interface InvoiceContentProps {
  invoice: SharedInvoice;
}

interface FiscalSettings {
  company_name: string;
  tax_id: string;
  address: string;
  postal_code: string;
  city: string;
  province: string;
  country: string;
  phone: string;
  email: string;
  website: string;
}

const InvoiceContent: React.FC<InvoiceContentProps> = ({ invoice }) => {
  const [fiscalSettings, setFiscalSettings] = useState<FiscalSettings | null>(null);
  
  useEffect(() => {
    const fetchFiscalSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('fiscal_settings')
          .select('*')
          .eq('id', 1)
          .single();
          
        if (error) throw error;
        
        setFiscalSettings(data as FiscalSettings);
      } catch (err) {
        console.error('Error loading fiscal settings:', err);
      }
    };
    
    fetchFiscalSettings();
  }, []);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Factura {invoice.invoice_number || ''}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              {fiscalSettings && (
                <div className="border-b pb-4 mb-4">
                  <h3 className="font-bold text-lg mb-2">Datos del Emisor</h3>
                  <p className="font-semibold">{fiscalSettings.company_name}</p>
                  <p>CIF/NIF: {fiscalSettings.tax_id}</p>
                  <p>{fiscalSettings.address}</p>
                  <p>{fiscalSettings.postal_code} {fiscalSettings.city}</p>
                  <p>{fiscalSettings.province}, {fiscalSettings.country}</p>
                  {fiscalSettings.phone && <p>Teléfono: {fiscalSettings.phone}</p>}
                  {fiscalSettings.email && <p>Email: {fiscalSettings.email}</p>}
                  {fiscalSettings.website && <p>Web: {fiscalSettings.website}</p>}
                </div>
              )}
              
              <h3 className="font-bold text-lg mb-2">Cliente</h3>
              <p className="font-semibold">{invoice.client_name}</p>
              {invoice.client_website && (
                <p>{invoice.client_website}</p>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="border rounded-md p-4 bg-muted/50">
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-sm font-medium text-muted-foreground">Nº de Factura</p>
                  <p className="text-sm text-right">{invoice.invoice_number || '-'}</p>
                  
                  <p className="text-sm font-medium text-muted-foreground">Fecha de emisión</p>
                  <p className="text-sm text-right">{format(new Date(invoice.created_at), 'dd/MM/yyyy', { locale: es })}</p>
                  
                  {invoice.due_date && (
                    <>
                      <p className="text-sm font-medium text-muted-foreground">Fecha de vencimiento</p>
                      <p className="text-sm text-right">{format(new Date(invoice.due_date), 'dd/MM/yyyy', { locale: es })}</p>
                    </>
                  )}
                  
                  <p className="text-sm font-medium text-muted-foreground">Estado</p>
                  <p className="text-sm text-right">
                    <span className={`px-2 py-0.5 rounded-full text-xs inline-block
                      ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 
                        invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        invoice.status === 'overdue' ? 'bg-red-100 text-red-800' : 
                        'bg-gray-100 text-gray-800'}`}
                    >
                      {invoice.status === 'paid' ? 'Pagada' : 
                        invoice.status === 'pending' ? 'Pendiente' : 
                        invoice.status === 'overdue' ? 'Vencida' : 
                        invoice.status === 'cancelled' ? 'Cancelada' : 
                        invoice.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <h3 className="text-lg font-semibold mb-4">{invoice.title}</h3>
            {invoice.description && (
              <p className="mb-4 text-muted-foreground">{invoice.description}</p>
            )}
            
            <div className="border rounded-md mb-4 overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left">Concepto</th>
                    <th className="px-4 py-3 text-right">Importe</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="px-4 py-3">{invoice.title}</td>
                    <td className="px-4 py-3 text-right">
                      {invoice.subtotal 
                        ? invoice.subtotal.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
                        : (invoice.amount * 0.8264).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                    </td>
                  </tr>
                </tbody>
                <tfoot className="bg-muted/50">
                  <tr className="border-t">
                    <td className="px-4 py-3 font-medium">Base imponible</td>
                    <td className="px-4 py-3 text-right">
                      {invoice.subtotal 
                        ? invoice.subtotal.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
                        : (invoice.amount * 0.8264).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">
                      IVA ({invoice.vat_rate || 21}%)
                    </td>
                    <td className="px-4 py-3 text-right">
                      {invoice.vat_amount 
                        ? invoice.vat_amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
                        : (invoice.amount * 0.1736).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-3 font-bold">Total</td>
                    <td className="px-4 py-3 text-right font-bold">
                      {invoice.amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                    </td>
                  </tr>
                </tfoot>
              </table>
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
