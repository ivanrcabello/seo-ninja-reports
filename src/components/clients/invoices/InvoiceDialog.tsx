
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
import { CalendarIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import useClients from '@/hooks/useClients';

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
  const { getClient } = useClients();
  const client = getClient(clientId);

  const [title, setTitle] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<'pending' | 'paid' | 'cancelled' | 'overdue'>('pending');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [paymentInstructions, setPaymentInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const [clientTaxId, setClientTaxId] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  
  const [billingName, setBillingName] = useState('');
  const [billingTaxId, setBillingTaxId] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [billingEmail, setBillingEmail] = useState('');
  
  const [includesVat, setIncludesVat] = useState(true);

  const [showClientDetails, setShowClientDetails] = useState(false);
  const [showBillingDetails, setShowBillingDetails] = useState(false);

  useEffect(() => {
    if (open && editingInvoice) {
      setTitle(editingInvoice.title);
      setInvoiceNumber(editingInvoice.invoice_number || '');
      setDescription(editingInvoice.description || '');
      setAmount(editingInvoice.amount.toString());
      setStatus(editingInvoice.status as any);
      setDueDate(editingInvoice.due_date ? new Date(editingInvoice.due_date) : undefined);
      setPaymentInstructions(editingInvoice.payment_instructions || '');
      
      setClientTaxId(editingInvoice.client_tax_id || '');
      setClientAddress(editingInvoice.client_address || '');
      
      setBillingName(editingInvoice.billing_name || '');
      setBillingTaxId(editingInvoice.billing_tax_id || '');
      setBillingAddress(editingInvoice.billing_address || '');
      setBillingEmail(editingInvoice.billing_email || '');
      
      setIncludesVat(editingInvoice.includes_vat !== false);
    } else if (open) {
      setTitle('');
      setInvoiceNumber('');
      setDescription('');
      setAmount('');
      setStatus('pending');
      setDueDate(undefined);
      setPaymentInstructions('');
      
      if (client) {
        setClientAddress(client.address || '');
        setClientTaxId(client.tax_id || '');
      }
      
      setBillingName('');
      setBillingTaxId('');
      setBillingAddress('');
      setBillingEmail('');
      setIncludesVat(true);
    }

    setFormErrors({});
  }, [open, editingInvoice, client]);

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
        invoice_number: invoiceNumber.trim() || null,
        description: description.trim() || null,
        amount: Number(amount),
        status,
        due_date: dueDate ? dueDate.toISOString() : null,
        payment_instructions: paymentInstructions.trim() || null,
        client_id: clientId,
        client_tax_id: clientTaxId.trim() || null,
        client_address: clientAddress.trim() || null,
        billing_name: billingName.trim() || null,
        billing_tax_id: billingTaxId.trim() || null,
        billing_address: billingAddress.trim() || null,
        billing_email: billingEmail.trim() || null,
        includes_vat: includesVat
      };

      if (editingInvoice) {
        await updateInvoice(editingInvoice.id, invoiceData);
      } else {
        await createInvoice(invoiceData as any);
      }

      // Close modal and let parent component know to refresh
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving invoice:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingInvoice ? 'Editar factura' : 'Crear nueva factura'}
          </DialogTitle>
          <DialogDescription>
            {clientName && `Cliente: ${clientName}`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <Label htmlFor="invoice-number">Número de factura</Label>
              <Input 
                id="invoice-number"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="Ej: F-2024-001"
              />
            </div>
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
          
          <div className="border rounded-md shadow-sm">
            <button
              type="button"
              className="w-full px-4 py-2 flex justify-between items-center hover:bg-muted/50 transition-colors"
              onClick={() => setShowClientDetails(!showClientDetails)}
            >
              <h3 className="font-medium">Datos del cliente</h3>
              {showClientDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            
            {showClientDetails && (
              <div className="p-4 space-y-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="client-name">Nombre del cliente</Label>
                  <Input 
                    id="client-name"
                    value={clientName || ''}
                    disabled
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="client-tax-id">DNI/CIF del cliente</Label>
                  <Input 
                    id="client-tax-id"
                    value={clientTaxId}
                    onChange={(e) => setClientTaxId(e.target.value)}
                    placeholder="Ej: B12345678"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="client-address">Dirección del cliente</Label>
                  <Textarea 
                    id="client-address"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    placeholder="Dirección completa del cliente"
                    rows={2}
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="border rounded-md shadow-sm">
            <button
              type="button"
              className="w-full px-4 py-2 flex justify-between items-center hover:bg-muted/50 transition-colors"
              onClick={() => setShowBillingDetails(!showBillingDetails)}
            >
              <h3 className="font-medium">Datos de facturación (emisor)</h3>
              {showBillingDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            
            {showBillingDetails && (
              <div className="p-4 space-y-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="billing-name">Nombre o razón social</Label>
                  <Input 
                    id="billing-name"
                    value={billingName}
                    onChange={(e) => setBillingName(e.target.value)}
                    placeholder="Ej: SEO Local Consultores S.L."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="billing-tax-id">DNI/CIF</Label>
                  <Input 
                    id="billing-tax-id"
                    value={billingTaxId}
                    onChange={(e) => setBillingTaxId(e.target.value)}
                    placeholder="Ej: B12345678"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="billing-email">Correo electrónico</Label>
                  <Input 
                    id="billing-email"
                    type="email"
                    value={billingEmail}
                    onChange={(e) => setBillingEmail(e.target.value)}
                    placeholder="Ej: facturacion@tuempresa.es"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="billing-address">Dirección</Label>
                  <Textarea 
                    id="billing-address"
                    value={billingAddress}
                    onChange={(e) => setBillingAddress(e.target.value)}
                    placeholder="Dirección completa del emisor"
                    rows={2}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Importe (€)</Label>
              <div className="flex items-center gap-2">
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
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="vat-included" 
                    checked={includesVat}
                    onCheckedChange={(checked) => setIncludesVat(checked as boolean)}
                  />
                  <Label htmlFor="vat-included" className="text-sm">
                    IVA incluido
                  </Label>
                </div>
              </div>
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
