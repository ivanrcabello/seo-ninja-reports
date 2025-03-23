
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ClientInvoice } from '@/types/client.types';
import { useClientInvoices } from '@/hooks/useClientInvoices';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface InvoiceDialogProps {
  clientId: string;
  clientName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingInvoice: ClientInvoice | null;
}

const InvoiceDialog: React.FC<InvoiceDialogProps> = ({
  clientId,
  clientName,
  open,
  onOpenChange,
  editingInvoice
}) => {
  const { createInvoice, updateInvoice } = useClientInvoices(clientId);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<'pending' | 'paid' | 'cancelled' | 'overdue'>('pending');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Reset form when dialog opens/closes or editing invoice changes
  useEffect(() => {
    if (open && editingInvoice) {
      setTitle(editingInvoice.title);
      setDescription(editingInvoice.description || '');
      setAmount(editingInvoice.amount.toString());
      setStatus(editingInvoice.status as any);
      setDueDate(editingInvoice.due_date ? new Date(editingInvoice.due_date) : undefined);
    } else if (open) {
      // Clear form for new invoice
      setTitle('');
      setDescription('');
      setAmount('');
      setStatus('pending');
      setDueDate(undefined);
    }

    // Clear errors
    setFormErrors({});
  }, [open, editingInvoice]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!title.trim()) {
      errors.title = 'El título es obligatorio';
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      errors.amount = 'El importe debe ser un número positivo';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const invoiceData = {
        title,
        description: description.trim() || null,
        amount: Number(amount),
        status,
        due_date: dueDate ? dueDate.toISOString() : null,
        client_id: clientId
      };

      if (editingInvoice) {
        await updateInvoice(editingInvoice.id, invoiceData);
      } else {
        await createInvoice(invoiceData as any);
      }

      onOpenChange(false);
    } catch (error) {
      console.error('Error saving invoice:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {editingInvoice ? 'Editar factura' : 'Crear nueva factura'}
          </DialogTitle>
          <DialogDescription>
            {clientName && `Cliente: ${clientName}`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título de la factura</Label>
            <Input 
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Servicios SEO - Junio 2024"
              className={formErrors.title ? 'border-destructive' : ''}
            />
            {formErrors.title && (
              <p className="text-sm text-destructive">{formErrors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Textarea 
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalles adicionales sobre la factura"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Importe (€)</Label>
              <Input 
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className={formErrors.amount ? 'border-destructive' : ''}
              />
              {formErrors.amount && (
                <p className="text-sm text-destructive">{formErrors.amount}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="paid">Pagada</SelectItem>
                  <SelectItem value="cancelled">Cancelada</SelectItem>
                  <SelectItem value="overdue">Vencida</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="due-date">Fecha de vencimiento (opcional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="due-date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, 'PPP', { locale: es }) : "Seleccionar fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-auto p-0 z-50 bg-background" 
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={(date) => {
                    console.log("Date selected:", date);
                    setDueDate(date);
                  }}
                  initialFocus
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : editingInvoice ? 'Actualizar' : 'Crear factura'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDialog;
