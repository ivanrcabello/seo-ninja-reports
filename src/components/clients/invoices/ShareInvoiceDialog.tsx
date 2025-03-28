
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ShareInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId: string;
  invoiceTitle: string;
}

const ShareInvoiceDialog: React.FC<ShareInvoiceDialogProps> = ({
  open,
  onOpenChange,
  invoiceId,
  invoiceTitle
}) => {
  const [shareUrl, setShareUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    const generateLink = async () => {
      if (!open) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Verificar si la factura ya tiene un shared_url
        const { data: invoiceData, error: invoiceError } = await supabase
          .from('client_invoices')
          .select('shared_url, client_id, clients(name, website)')
          .eq('id', invoiceId)
          .single();
        
        if (invoiceError) {
          throw new Error('Error al obtener la factura');
        }
        
        let sharedUrl = invoiceData.shared_url;
        
        // Si no tiene shared_url, generamos uno
        if (!sharedUrl) {
          const { data: updatedInvoice, error: updateError } = await supabase
            .from('client_invoices')
            .update({ shared_url: crypto.randomUUID() })
            .eq('id', invoiceId)
            .select('shared_url')
            .single();
          
          if (updateError) {
            throw new Error('Error al generar enlace compartido');
          }
          
          sharedUrl = updatedInvoice.shared_url;
        }
        
        // Verificar si ya existe en public_invoices
        const { data: existingPublic } = await supabase
          .from('public_invoices')
          .select('id')
          .eq('shared_url', sharedUrl)
          .single();
        
        // Si no existe en public_invoices, lo creamos
        if (!existingPublic) {
          // Obtenemos todos los datos de la factura
          const { data: fullInvoice, error: fullInvoiceError } = await supabase
            .from('client_invoices')
            .select('*')
            .eq('id', invoiceId)
            .single();
          
          if (fullInvoiceError) {
            throw new Error('Error al obtener datos completos de la factura');
          }
          
          // Insertamos en public_invoices
          const { error: insertError } = await supabase
            .from('public_invoices')
            .insert({
              id: fullInvoice.id,
              title: fullInvoice.title,
              description: fullInvoice.description,
              amount: fullInvoice.amount,
              status: fullInvoice.status,
              due_date: fullInvoice.due_date,
              payment_method: fullInvoice.payment_method,
              payment_date: fullInvoice.payment_date,
              payment_instructions: fullInvoice.payment_instructions,
              shared_url: sharedUrl,
              created_at: fullInvoice.created_at,
              updated_at: fullInvoice.updated_at,
              client_name: invoiceData.clients?.name,
              client_website: invoiceData.clients?.website
            });
          
          if (insertError) {
            throw new Error('Error al crear factura pública');
          }
        }
        
        // Construir la URL completa
        const fullUrl = `${window.location.origin}/shared/invoices/${sharedUrl}`;
        setShareUrl(fullUrl);
      } catch (err: any) {
        console.error('Error generating share URL:', err);
        setError(err.message || 'Error al generar enlace');
        toast.error('Error: ' + (err.message || 'Error al generar enlace'));
      } finally {
        setIsLoading(false);
      }
    };
    
    generateLink();
  }, [open, invoiceId]);
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Enlace copiado al portapapeles');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
      toast.error('No se pudo copiar el enlace');
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartir factura</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          <p className="text-sm">
            Comparte esta factura con tu cliente utilizando este enlace único:
          </p>
          
          {isLoading ? (
            <div className="h-10 animate-pulse bg-muted rounded-md"></div>
          ) : error ? (
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="flex-1"
              />
              <Button 
                size="sm" 
                onClick={handleCopyLink}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
          
          <div className="text-sm text-muted-foreground">
            <h4 className="font-medium text-foreground">Información importante:</h4>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Cualquier persona con este enlace podrá ver la factura</li>
              <li>El enlace no expira automáticamente</li>
              <li>Puedes revocar el acceso generando un nuevo enlace</li>
            </ul>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>Cerrar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareInvoiceDialog;
