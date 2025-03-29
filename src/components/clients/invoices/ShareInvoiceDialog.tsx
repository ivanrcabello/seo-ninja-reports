
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Copy, Link, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export interface ShareInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId: string;
  invoiceTitle?: string;
}

const ShareInvoiceDialog: React.FC<ShareInvoiceDialogProps> = ({
  open,
  onOpenChange,
  invoiceId,
  invoiceTitle = "Factura"
}) => {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Reset state when dialog opens or closes
  useEffect(() => {
    if (!open) {
      // Reset state when dialog closes
      setCopied(false);
      return;
    }
    
    // Generate URL when dialog opens
    const generateShareUrl = async () => {
      try {
        setIsLoading(true);
        
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
          
          // Insertamos en public_invoices con type assertion
          const { error: insertError } = await supabase
            .from('public_invoices')
            .insert([{
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
            }] as any);
          
          if (insertError) {
            throw new Error('Error al crear factura pública');
          }
        }
        
        // Construir la URL completa
        const fullUrl = `${window.location.origin}/shared/invoices/${sharedUrl}`;
        setShareUrl(fullUrl);
        toast.success('Enlace generado correctamente');
      } catch (error: any) {
        console.error('Error generating share URL:', error);
        toast.error('Error: ' + (error.message || 'Error al generar enlace'));
      } finally {
        setIsLoading(false);
      }
    };
    
    generateShareUrl();
  }, [open, invoiceId]);
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Enlace copiado al portapapeles');
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      toast.error('No se pudo copiar el enlace');
      console.error('Error copiando al portapapeles:', error);
    }
  };
  
  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Factura: ${invoiceTitle}`);
    const body = encodeURIComponent(`Hola,\n\nQuiero compartir contigo esta factura.\n\nPuedes verla en: ${shareUrl}\n\nSaludos.`);
    
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartir Factura</DialogTitle>
          <DialogDescription>
            Comparte esta factura mediante un enlace directo.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <p>Generando enlace...</p>
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                  <Input
                    value={shareUrl}
                    readOnly
                    className="w-full"
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleCopyLink} 
                  className="transition-all group hover:bg-primary hover:text-primary-foreground"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500 group-hover:text-primary-foreground" />
                  ) : (
                    <Copy className="h-4 w-4 group-hover:text-primary-foreground" />
                  )}
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button 
                  onClick={handleCopyLink} 
                  className="w-full sm:w-auto gap-2 group"
                >
                  <Link className="h-4 w-4 group-hover:animate-pulse" />
                  Copiar enlace
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleEmailShare} 
                  className="w-full sm:w-auto gap-2 group transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <Mail className="h-4 w-4 group-hover:animate-pulse" />
                  Compartir por email
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareInvoiceDialog;
