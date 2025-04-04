
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
import { useFiscalSettings } from '@/hooks/useFiscalSettings';

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
  const { fiscalSettings } = useFiscalSettings();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subtotal, setSubtotal] = useState('');
  const [vatRate, setVatRate] = useState('21');
  const [vatAmount, setVatAmount] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<'pending' | 'paid' | 'cancelled' | 'overdue'>('pending');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [paymentInstructions, setPaymentInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Load default VAT rate from fiscal settings when the component mounts
  useEffect(() => {
    if (fiscalSettings?.vat_rate) {
      setVatRate(fiscalSettings.vat_rate.toString());
    }
  }, [fiscalSettings]);

  // Calculate VAT amount and total when subtotal or VAT rate changes
  useEffect(() => {
    if (subtotal && parseFloat(subtotal) > 0 && vatRate) {
      const subtotalValue = parseFloat(subtotal);
      const vatRateValue = parseFloat(vatRate);
      const calculatedVatAmount = (subtotalValue * vatRateValue) / 100;
      const calculatedTotal = subtotalValue + calculatedVatAmount;
      
      setVatAmount(calculatedVatAmount.toFixed(2));
      setAmount(calculatedTotal.toFixed(2));
    }
  }, [subtotal, vatRate]);

  // Calculate subtotal and VAT amount when total changes (backward calculation)
  useEffect(() => {
    if (amount && parseFloat(amount) > 0 && vatRate && !subtotal) {
      const totalValue = parseFloat(amount);
      const vatRateValue = parseFloat(vatRate);
      const calculatedSubtotal = totalValue / (1 + (vatRateValue / 100));
      const calculatedVatAmount = totalValue - calculatedSubtotal;
      
      setSubtotal(calculatedSubtotal.toFixed(2));
      setVatAmount(calculatedVatAmount.toFixed(2));
    }
  }, [amount, vatRate, subtotal]);

  // Reset form when dialog opens/closes or editing invoice changes
  useEffect(() => {
    if (open && editingInvoice) {
      setTitle(editingInvoice.title);
      setDescription(editingInvoice.description || '');
      setSubtotal(editingInvoice.subtotal?.toString() || '');
      setVatRate(editingInvoice.vat_rate?.toString() || fiscalSettings?.vat_rate?.toString() || '21');
      setVatAmount(editingInvoice.vat_amount?.toString() || '');
      setAmount(editingInvoice.amount.toString());
      setStatus(editingInvoice.status as any);
      setDueDate(editingInvoice.due_date ? new Date(editingInvoice.due_date) : undefined);
      setPaymentInstructions(editingInvoice.payment_instructions || '');
    } else if (open) {
      // Clear form for new invoice
      setTitle('');
      setDescription('');
      setSubtotal('');
      setVatAmount('');
      setAmount('');
      setStatus('pending');
      setDueDate(undefined);
      setPaymentInstructions('');
      // Set default VAT rate from settings
      setVatRate(fiscalSettings?.vat_rate?.toString() || '21');
    }

    // Clear errors
    setFormErrors({});
  }, [open, editingInvoice, fiscalSettings]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!title.trim()) {
      errors.title = 'El título es obligatorio';
    }

    // Check if either subtotal or amount is provided
    if ((!subtotal || isNaN(Number(subtotal)) || Number(subtotal) <= 0) && 
        (!amount || isNaN(Number(amount)) || Number(amount) <= 0)) {
      errors.subtotal = 'El importe sin IVA o el importe total debe ser un número positivo';
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
        subtotal: subtotal ? Number(subtotal) : null,
        vat_rate: vatRate ? Number(vatRate) : fiscalSettings?.vat_rate || 21,
        vat_amount: vatAmount ? Number(vatAmount) : null,
        amount: Number(amount),
        status,
        due_date: dueDate ? dueDate.toISOString() : null,
        payment_instructions: paymentInstructions.trim() || null,
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subtotal">Importe sin IVA (€)</Label>
              <Input 
                id="subtotal"
                type="number"
                step="0.01"
                min="0"
                value={subtotal}
                onChange={(e) => {
                  setSubtotal(e.target.value);
                  // Clear amount to recalculate based on subtotal
                  if (e.target.value) setAmount('');
                }}
                placeholder="0.00"
                className={formErrors.subtotal ? 'border-destructive' : ''}
              />
              {formErrors.subtotal && (
                <p className="text-sm text-destructive">{formErrors.subtotal}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="vat-rate">Tipo de IVA (%)</Label>
              <Input 
                id="vat-rate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={vatRate}
                onChange={(e) => setVatRate(e.target.value)}
                placeholder="21"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Importe total con IVA (€)</Label>
              <Input 
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  // Clear subtotal to recalculate based on total
                  if (e.target.value) setSubtotal('');
                }}
                placeholder="0.00"
              />
            </div>
          </div>
          
          {vatAmount && (
            <div className="bg-muted p-3 rounded text-sm">
              <span className="font-medium">IVA ({vatRate}%):</span> {parseFloat(vatAmount).toFixed(2)}€
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-instructions">Instrucciones de pago (opcional)</Label>
            <Textarea 
              id="payment-instructions"
              value={paymentInstructions}
              onChange={(e) => setPaymentInstructions(e.target.value)}
              placeholder="Ej: Transferencia a la cuenta ES12 1234 5678 9012 3456 7890"
              rows={3}
            />
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
