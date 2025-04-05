
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import { SharedInvoice } from './types';

interface InvoiceActionsProps {
  invoice: SharedInvoice;
  onPrint: () => void;
}

const InvoiceActions: React.FC<InvoiceActionsProps> = ({ invoice, onPrint }) => {
  // Function to get status display text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Esta factura ha sido pagada';
      case 'pending':
        return 'Pendiente de pago';
      case 'overdue':
        return 'Pago vencido';
      case 'cancelled':
        return 'Cancelada';
      default:
        return `Estado: ${status}`;
    }
  };

  return (
    <div className="flex justify-between items-center p-4 border-t print:hidden">
      <div className="text-sm text-muted-foreground">
        {invoice.status === 'paid' ? (
          <span className="text-green-600 font-medium">✓ {getStatusText(invoice.status)}</span>
        ) : (
          <span>{getStatusText(invoice.status)}</span>
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
