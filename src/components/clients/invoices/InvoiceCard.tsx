
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ClientInvoice } from '@/types/client.types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MoreHorizontal, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface InvoiceCardProps {
  invoice: ClientInvoice;
  onEdit: () => void;
  onDelete: () => void;
  onClick: () => void;
}

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

const InvoiceCard: React.FC<InvoiceCardProps> = ({ 
  invoice, 
  onEdit, 
  onDelete,
  onClick 
}) => {
  const { title, amount, status, created_at, due_date } = invoice;
  
  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={(e) => {
        // Prevent click when clicking dropdown menu
        if (!(e.target as HTMLElement).closest('.dropdown-trigger')) {
          onClick();
        }
      }}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-medium text-lg line-clamp-1">{title}</h3>
            <p className="text-2xl font-bold">{amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 dropdown-trigger"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                <Edit2 className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="mt-4 flex flex-col gap-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Fecha:</span>
            <span>{format(new Date(created_at), 'PPP', { locale: es })}</span>
          </div>
          
          {due_date && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Vencimiento:</span>
              <span>{format(new Date(due_date), 'PPP', { locale: es })}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="px-6 py-4 border-t flex justify-between items-center bg-muted/30">
        <div className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(status)}`}>
          {getStatusLabel(status)}
        </div>
        
        {invoice.shared_url && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8"
            onClick={(e) => { e.stopPropagation(); window.open(`/shared/invoices/${invoice.shared_url}`, '_blank'); }}
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Ver enlace
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default InvoiceCard;
