
import React, { useCallback, useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ClientInvoice } from '@/types/client.types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MoreHorizontal, Edit2, Trash2, ExternalLink, Eye } from 'lucide-react';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Close the menu if user clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);
  
  const handleCardClick = useCallback((e: React.MouseEvent) => {
    // Don't trigger card click if clicking on the menu area
    if ((e.target as HTMLElement).closest('.dropdown-area')) {
      e.stopPropagation();
      return;
    }
    onClick();
  }, [onClick]);

  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    onEdit();
  }, [onEdit]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    onDelete();
  }, [onDelete]);

  const handleViewInvoice = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    onClick();
  }, [onClick]);

  const handleExternalLink = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (invoice.shared_url) {
      window.open(`/shared/invoices/${invoice.shared_url}`, '_blank');
    }
  }, [invoice.shared_url]);
  
  const toggleMenu = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(prev => !prev);
  }, []);
  
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleCardClick}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1 flex-1">
            <h3 className="font-medium text-lg line-clamp-1">{title}</h3>
            <p className="text-2xl font-bold">{amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
          </div>
          <div className="dropdown-area relative" ref={menuRef}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={toggleMenu}
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Abrir menú</span>
            </Button>
            
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-white border rounded-md shadow-lg z-50">
                <div className="py-1">
                  <button
                    className="w-full text-left px-4 py-2 text-sm flex items-center hover:bg-gray-100"
                    onClick={handleViewInvoice}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Ver factura
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm flex items-center hover:bg-gray-100"
                    onClick={handleEdit}
                  >
                    <Edit2 className="mr-2 h-4 w-4" />
                    Editar
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm flex items-center text-red-600 hover:bg-gray-100"
                    onClick={handleDelete}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                  </button>
                </div>
              </div>
            )}
          </div>
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
          <div className="dropdown-area">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8"
              onClick={handleExternalLink}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Ver enlace
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default InvoiceCard;
