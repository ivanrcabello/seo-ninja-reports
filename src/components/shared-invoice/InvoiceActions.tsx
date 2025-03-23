
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail, FileText, Building, Calendar } from 'lucide-react';
import { SharedInvoice } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface InvoiceActionsProps {
  invoice: SharedInvoice;
  onPrint: () => void;
}

const InvoiceActions: React.FC<InvoiceActionsProps> = ({ invoice, onPrint }) => {
  const isPaid = invoice.status === 'paid';
  
  const handleContactClick = () => {
    window.location.href = '/contacto';
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{isPaid ? 'Factura Pagada' : 'Opciones de Pago'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isPaid ? (
          <div className="text-center p-4 bg-green-50 rounded-md">
            <p className="text-green-800">Esta factura ya ha sido pagada. ¡Gracias por tu confianza!</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Para realizar el pago de esta factura, por favor contacta con nosotros a través del formulario de contacto.
            </p>
            
            <div className="grid grid-cols-1 gap-2">
              <Button className="w-full" onClick={handleContactClick}>
                <Mail className="h-4 w-4 mr-2" />
                Contactar para pagar
              </Button>
              <Button variant="outline" className="w-full" onClick={onPrint}>
                <FileText className="h-4 w-4 mr-2" />
                Descargar factura
              </Button>
            </div>
            
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Información importante:</p>
              <div className="flex items-start gap-2">
                <Building className="h-4 w-4 mt-0.5 text-muted-foreground/70" />
                <p>Para facturación, contacta con nuestro departamento financiero.</p>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground/70" />
                <p>Fecha de vencimiento: {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('es-ES') : 'No especificada'}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvoiceActions;
