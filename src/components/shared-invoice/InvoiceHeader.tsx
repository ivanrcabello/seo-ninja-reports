
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SharedInvoice } from './types';

interface InvoiceHeaderProps {
  invoice: SharedInvoice;
  onPrint: () => void;
}

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({ invoice, onPrint }) => {
  const navigate = useNavigate();

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
    <div className="flex flex-col gap-4 sm:gap-0 sm:flex-row justify-between items-start sm:items-center py-4 border-b mb-8">
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="mb-2 -ml-4"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <h1 className="text-2xl font-bold">Factura: {invoice.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {invoice.client_name} • <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(invoice.status)}`}>
            {getStatusLabel(invoice.status)}
          </span>
          {invoice.invoice_number && <span className="ml-2">• Nº: {invoice.invoice_number}</span>}
        </p>
      </div>
      <div className="w-full sm:w-auto">
        <Button 
          variant="outline" 
          className="w-full sm:w-auto gap-2"
          onClick={onPrint}
        >
          <Printer className="h-4 w-4" />
          Imprimir factura
        </Button>
      </div>
    </div>
  );
};

export default InvoiceHeader;
