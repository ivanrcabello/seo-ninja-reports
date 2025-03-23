
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, RefreshCw } from 'lucide-react';

interface InvoicesHeaderProps {
  onCreateInvoice: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const InvoicesHeader: React.FC<InvoicesHeaderProps> = ({ 
  onCreateInvoice, 
  onRefresh, 
  isRefreshing 
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Facturas</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Gestiona y comparte facturas con tus clientes
        </p>
      </div>
      <div className="flex space-x-2 w-full sm:w-auto">
        <Button
          variant="outline"
          className="w-1/2 sm:w-auto"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
        <Button 
          className="w-1/2 sm:w-auto"
          size="sm"
          onClick={onCreateInvoice}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Nueva factura
        </Button>
      </div>
    </div>
  );
};

export default InvoicesHeader;
