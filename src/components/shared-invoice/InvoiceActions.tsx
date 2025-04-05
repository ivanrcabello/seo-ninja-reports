
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import { SharedInvoice } from './types';

interface InvoiceActionsProps {
  invoice: SharedInvoice;
  onPrint: () => void;
}

const InvoiceActions: React.FC<InvoiceActionsProps> = ({ invoice, onPrint }) => {
  // Base64 PDF generation would typically be here for download functionality
  // This is a simplified version that just uses print functionality

  return (
    <div className="flex justify-between items-center p-4 border-t print:hidden">
      <div className="text-sm text-muted-foreground">
        {invoice.status === 'paid' ? (
          <span className="text-green-600 font-medium">✓ Esta factura ha sido pagada</span>
        ) : (
          <span>Estado: {invoice.status === 'pending' ? 'Pendiente de pago' : 
                         invoice.status === 'overdue' ? 'Pago vencido' : 
                         invoice.status === 'cancelled' ? 'Cancelada' : invoice.status}</span>
        )}
      </div>
      <div className="space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onPrint}
        >
          <Printer className="h-4 w-4 mr-2" />
          Imprimir
        </Button>
      </div>
    </div>
  );
};

export default InvoiceActions;
