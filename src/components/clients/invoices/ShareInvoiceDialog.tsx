
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Link2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { uuid } from '@supabase/supabase-js/dist/module/lib/helpers';
import { supabase } from '@/integrations/supabase/client';

interface ShareInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId: string;
  invoiceTitle: string;
  clientName?: string;  // Make clientName optional
  clientWebsite?: string;
  onShared?: (sharedUrl: string) => void;
}

const ShareInvoiceDialog: React.FC<ShareInvoiceDialogProps> = ({
  open,
  onOpenChange,
  invoiceId,
  invoiceTitle,
  clientName = '',  // Provide a default value
  clientWebsite = '',
  onShared
}) => {
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [password, setPassword] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [sharedUrl, setSharedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const shareInvoice = async () => {
    if (!invoiceId) return;
    
    try {
      setIsSharing(true);
      
      // First check if the invoice is already shared
      const { data: existingShared, error: checkError } = await supabase
        .from('shared_content')
        .select('shared_url')
        .eq('original_id', invoiceId)
        .eq('content_type', 'invoice')
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      let sharedUrlId: string;
      
      if (existingShared) {
        // Update existing shared record
        sharedUrlId = existingShared.shared_url;
        
        const { error: updateError } = await supabase
          .from('shared_content')
          .update({
            password: isPasswordProtected ? password : null,
            updated_at: new Date().toISOString()
          })
          .eq('shared_url', sharedUrlId);
          
        if (updateError) throw updateError;
      } else {
        // Create new shared record
        sharedUrlId = uuid();
        
        // Get invoice data
        const { data: invoice, error: invoiceError } = await supabase
          .from('client_invoices')
          .select('*')
          .eq('id', invoiceId)
          .single();
          
        if (invoiceError) throw invoiceError;
        
        // Insert into shared_content
        const { error: insertError } = await supabase
          .from('shared_content')
          .insert({
            original_id: invoiceId,
            content_type: 'invoice',
            title: invoiceTitle,
            description: invoice.description || '',
            content: invoice,
            status: invoice.status,
            shared_url: sharedUrlId,
            password: isPasswordProtected ? password : null,
            client_name: clientName,
            client_website: clientWebsite
          });
          
        if (insertError) throw insertError;
      }
      
      // Set state and callback
      setSharedUrl(`${window.location.origin}/shared/invoices/${sharedUrlId}`);
      setIsShared(true);
      if (onShared) onShared(sharedUrlId);
      
    } catch (error: any) {
      console.error('Error sharing invoice:', error);
      toast.error('Error al compartir la factura', {
        description: error.message
      });
    } finally {
      setIsSharing(false);
    }
  };

  const copyToClipboard = () => {
    if (sharedUrl) {
      navigator.clipboard.writeText(sharedUrl);
      setCopied(true);
      toast.success('Enlace copiado al portapapeles');
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartir Factura</DialogTitle>
          <DialogDescription>
            Compartir la factura "{invoiceTitle}" con el cliente.
          </DialogDescription>
        </DialogHeader>
        
        {!isShared ? (
          <>
            <div className="flex items-center space-x-2 pt-4">
              <Checkbox 
                id="password-protection" 
                checked={isPasswordProtected}
                onCheckedChange={(checked) => setIsPasswordProtected(!!checked)}
              />
              <Label htmlFor="password-protection">Proteger con contraseña</Label>
            </div>
            
            {isPasswordProtected && (
              <div className="space-y-2 pt-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input 
                  id="password" 
                  type="text" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="Ingresa una contraseña"
                />
              </div>
            )}
            
            <DialogFooter className="pt-4">
              <Button 
                onClick={shareInvoice}
                disabled={isSharing || (isPasswordProtected && !password)}
              >
                {isSharing ? "Compartiendo..." : "Compartir factura"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="flex items-center space-x-2 pt-4">
              <div className="border border-input bg-background rounded-md px-3 py-2 text-sm w-full flex items-center justify-between">
                <div className="truncate mr-2">
                  <Link2 className="h-4 w-4 inline mr-2 text-muted-foreground" />
                  {sharedUrl}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={copyToClipboard}
                  disabled={copied}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="pt-2 text-sm text-muted-foreground">
              {isPasswordProtected
                ? "Esta factura está protegida con contraseña."
                : "Esta factura es visible para cualquier persona con el enlace."}
            </div>
            
            <DialogFooter className="pt-4">
              <Button onClick={() => onOpenChange(false)}>
                Cerrar
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShareInvoiceDialog;
