
import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Printer, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SharedInvoice } from './types';

interface InvoiceHeaderProps {
  invoice: SharedInvoice;
  onPrint?: () => void;
}

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({ invoice, onPrint }) => {
  const navigate = useNavigate();
  
  const handleBackToHome = () => {
    navigate('/');
  };
  
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'paid':
        return { label: 'Pagada', className: 'bg-green-100 text-green-800 border-green-200' };
      case 'overdue':
        return { label: 'Vencida', className: 'bg-red-100 text-red-800 border-red-200' };
      case 'cancelled':
        return { label: 'Cancelada', className: 'bg-gray-100 text-gray-800 border-gray-200' };
      case 'pending':
      default:
        return { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    }
  };

  const statusInfo = getStatusInfo(invoice.status);
  
  return (
    <div className="bg-white border-b print:border-none">
      <div className="container mx-auto p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex items-center space-x-4 print:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackToHome}
            className="flex items-center gap-1 print:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver</span>
          </Button>
        </div>
        
        <div className="hidden print:block">
          <h1 className="text-2xl font-bold">Factura</h1>
        </div>

        <div className="mt-4 sm:mt-0 flex items-center gap-2">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.className}`}>
            {statusInfo.label}
          </div>
          
          {onPrint && (
            <Button
              variant="outline"
              size="sm"
              onClick={onPrint}
              className="flex items-center gap-1 print:hidden"
            >
              <Printer className="h-4 w-4" />
              <span>Imprimir</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceHeader;
