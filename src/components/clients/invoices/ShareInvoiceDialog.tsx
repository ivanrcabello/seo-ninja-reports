import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Copy, Link, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { ClientInvoice } from '@/types/client.types';
import { useClientInvoices } from '@/hooks/useClientInvoices';
import { supabase } from '@/integrations/supabase/client';

interface ShareInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId: string;
  invoiceTitle: string;
  clientName: string;
  clientWebsite?: string;
}

const ShareInvoiceDialog: React.FC<ShareInvoiceDialogProps> = ({
  open,
  onOpenChange,
  invoiceId,
  invoiceTitle,
  clientName,
  clientWebsite
}) => {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { generateShareUrl } = useClientInvoices();
  
  useEffect(() => {
    if (!open) {
      setCopied(false);
      return;
    }
    
    const createShareUrl = async () => {
      try {
        setIsLoading(true);
        
        const { data: invoiceData, error: invoiceError } = await supabase
          .from('client_invoices')
          .select('*')
          .eq('id', invoiceId)
          .single();
        
        if (invoiceError) {
          throw new Error('Error al obtener la factura');
        }
        
        let sharedUrl = invoiceData.shared_url;
        
        if (!sharedUrl) {
          sharedUrl = await generateShareUrl(invoiceId);
          if (!sharedUrl) {
            throw new Error('Error al generar enlace compartido');
          }
        }
        
        const { data: existingContent } = await supabase
          .from('shared_content')
          .select('id')
          .eq('shared_url', sharedUrl)
          .eq('content_type', 'invoice')
          .single();
        
        if (!existingContent) {
          const content = {
            amount: invoiceData.amount,
            status: invoiceData.status,
            payment_method: invoiceData.payment_method,
            payment_date: invoiceData.payment_date,
            payment_instructions: invoiceData.payment_instructions,
            client_address: invoiceData.client_address,
            client_tax_id: invoiceData.client_tax_id,
            billing_name: invoiceData.billing_name,
            billing_tax_id: invoiceData.billing_tax_id,
            billing_address: invoiceData.billing_address,
            billing_email: invoiceData.billing_email,
            includes_vat: invoiceData.includes_vat,
            due_date: invoiceData.due_date,
            invoice_number: invoiceData.invoice_number
          };
          
          const { error: insertError } = await supabase
            .from('shared_content')
            .insert({
              original_id: invoiceData.id,
              content_type: 'invoice',
              title: invoiceData.title,
              description: invoiceData.description,
              content: content,
              shared_url: sharedUrl,
              client_name: clientName,
              client_website: clientWebsite,
              status: invoiceData.status
            });
          
          if (insertError) {
            console.error('Error creating shared content:', insertError);
            throw new Error('Error al crear factura pública');
          }
        }
        
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
    
    createShareUrl();
  }, [open, invoiceId, generateShareUrl, clientName, clientWebsite]);
  
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
    const body = encodeURIComponent(`Hola,\n\nTe comparto esta factura.\n\nPuedes verla en: ${shareUrl}\n\nSaludos.`);
    
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
