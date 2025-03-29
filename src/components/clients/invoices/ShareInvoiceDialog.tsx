
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Clipboard, Copy, ExternalLink } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ShareInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId: string;
  clientId: string;
  title: string;
}

const ShareInvoiceDialog: React.FC<ShareInvoiceDialogProps> = ({
  open,
  onOpenChange,
  invoiceId,
  clientId,
  title
}) => {
  const [isProtected, setIsProtected] = useState(false);
  const [password, setPassword] = useState('');
  const [sharedUrl, setSharedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [clientDetails, setClientDetails] = useState<{ name: string, website: string } | null>(null);

  const baseUrl = window.location.origin;

  // Fetch any existing shared URL and client details when dialog opens
  useEffect(() => {
    if (open && invoiceId) {
      fetchExistingShareDetails();
      fetchClientDetails();
    }
  }, [open, invoiceId]);

  const fetchExistingShareDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('client_invoices')
        .select('shared_url, password')
        .eq('id', invoiceId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSharedUrl(data.shared_url || null);
        setIsProtected(!!data.password);
        if (data.password) {
          setPassword(""); // Don't show the actual password for security
        }
      }
    } catch (error) {
      console.error('Error fetching share details:', error);
      toast.error('Error al cargar los detalles de compartición');
    }
  };

  const fetchClientDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('name, website')
        .eq('id', clientId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setClientDetails(data);
      }
    } catch (error) {
      console.error('Error fetching client details:', error);
    }
  };

  const handleShareInvoice = async () => {
    setIsLoading(true);
    
    try {
      const sharedUrlValue = sharedUrl || crypto.randomUUID();
      
      const { error } = await supabase
        .from('client_invoices')
        .update({
          shared_url: sharedUrlValue,
          password: isProtected ? password : null
        })
        .eq('id', invoiceId);
        
      if (error) throw error;
      
      setSharedUrl(sharedUrlValue);
      toast.success('Enlace de la factura actualizado');
      
      // Also update public_invoices view
      await updatePublicInvoices(sharedUrlValue);
      
    } catch (error) {
      console.error('Error sharing invoice:', error);
      toast.error('Error al compartir la factura');
    } finally {
      setIsLoading(false);
    }
  };
  
  const updatePublicInvoices = async (sharedUrlValue: string) => {
    try {
      if (!clientDetails) return;
      
      // Find if there's already a public invoice with this shared_url
      const { data: existingPublicInvoice, error: checkError } = await supabase
        .from('public_invoices')
        .select('id')
        .eq('shared_url', sharedUrlValue)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingPublicInvoice) {
        // Update existing record
        await supabase
          .from('public_invoices')
          .update({
            client_name: clientDetails.name,
            client_website: clientDetails.website,
            updated_at: new Date().toISOString()
          })
          .eq('shared_url', sharedUrlValue);
      }
      
    } catch (error) {
      console.error('Error updating public invoices:', error);
    }
  };

  const copyLinkToClipboard = () => {
    if (!sharedUrl) return;
    
    const shareLink = `${baseUrl}/invoices/shared/${sharedUrl}`;
    navigator.clipboard.writeText(shareLink);
    toast.success('Enlace copiado al portapapeles');
  };

  const openSharedLink = () => {
    if (!sharedUrl) return;
    
    const shareLink = `${baseUrl}/invoices/shared/${sharedUrl}`;
    window.open(shareLink, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartir Factura</DialogTitle>
          <DialogDescription>
            Compartir factura: {title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="protected"
              checked={isProtected}
              onCheckedChange={setIsProtected}
            />
            <Label htmlFor="protected">Proteger con contraseña</Label>
          </div>

          {isProtected && (
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingrese una contraseña"
              />
            </div>
          )}

          {sharedUrl && (
            <div className="space-y-2">
              <Label>Enlace compartido</Label>
              <div className="flex">
                <Input
                  value={`${baseUrl}/invoices/shared/${sharedUrl}`}
                  readOnly
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="ml-2" 
                  onClick={copyLinkToClipboard}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="ml-2"
                  onClick={openSharedLink}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cerrar
          </Button>
          <Button 
            onClick={handleShareInvoice} 
            disabled={isProtected && !password || isLoading}
          >
            {isLoading ? 'Compartiendo...' : (sharedUrl ? 'Actualizar enlace' : 'Generar enlace')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareInvoiceDialog;
