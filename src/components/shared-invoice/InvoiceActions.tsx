
import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer, Download } from 'lucide-react';
import { SharedInvoice } from './types';

interface InvoiceActionsProps {
  invoice: SharedInvoice;
  onPrint?: () => void;
}

const InvoiceActions: React.FC<InvoiceActionsProps> = ({ invoice, onPrint }) => {
  const handleDownloadPdf = () => {
    // Esta funcionalidad requeriría una implementación más compleja
    // Por ahora simplemente mostramos una alerta
    alert('Funcionalidad de descarga como PDF en desarrollo');
  };
  
  return (
    <div className="bg-white border-t print:hidden p-4 sm:p-6">
      <div className="container mx-auto flex flex-wrap gap-4 justify-center">
        {onPrint && (
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={onPrint}
          >
            <Printer className="h-4 w-4" />
            <span>Imprimir factura</span>
          </Button>
        )}
        
        <Button 
          variant="outline"
          className="flex items-center gap-2"
          onClick={handleDownloadPdf}
        >
          <Download className="h-4 w-4" />
          <span>Descargar como PDF</span>
        </Button>
      </div>
    </div>
  );
};

export default InvoiceActions;
