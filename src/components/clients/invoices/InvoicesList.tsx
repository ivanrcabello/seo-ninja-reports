
import React from 'react';
import { ClientInvoice } from '@/types/client.types';
import InvoiceCard from './InvoiceCard';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface InvoicesListProps {
  invoices: ClientInvoice[];
  isLoading: boolean;
  onCreateInvoice: () => void;
  onEditInvoice: (invoice: ClientInvoice) => void;
  onDeleteInvoice: (id: string) => void;
  onViewInvoice: (invoice: ClientInvoice) => void;
}

const InvoicesList: React.FC<InvoicesListProps> = ({
  invoices,
  isLoading,
  onCreateInvoice,
  onEditInvoice,
  onDeleteInvoice,
  onViewInvoice
}) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {[...Array(3)].map((_, index) => (
          <div 
            key={index} 
            className="h-48 border rounded-lg p-6 animate-pulse bg-muted"
          />
        ))}
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-background">
        <h3 className="text-lg font-semibold mb-2">No hay facturas</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Crea una nueva factura para este cliente
        </p>
        <Button onClick={onCreateInvoice}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Nueva factura
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {invoices.map((invoice) => (
        <InvoiceCard
          key={invoice.id}
          invoice={invoice}
          onEdit={() => onEditInvoice(invoice)}
          onDelete={() => onDeleteInvoice(invoice.id)}
          onClick={() => onViewInvoice(invoice)}
        />
      ))}
    </div>
  );
};

export default InvoicesList;
