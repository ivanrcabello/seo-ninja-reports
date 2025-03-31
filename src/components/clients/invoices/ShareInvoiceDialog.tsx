import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, AlertCircle, Lock, Unlock, RefreshCw, Mail, Link } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

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
  const [passwordProtected, setPasswordProtected] = useState(false);
  const [password, setPassword] = useState('');
  
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
  };
  
  useEffect(() => {
    const generateLink = async () => {
      if (!open) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const { data: invoiceData, error: invoiceError } = await supabase
          .from('client_invoices')
          .select('shared_url, client_id, clients(name, website), password')
          .eq('id', invoiceId)
          .single();
        
        if (invoiceError) {
          throw new Error('Error al obtener la factura');
        }
        
        let sharedUrl = invoiceData.shared_url;
        
        if (invoiceData.password) {
          setPasswordProtected(true);
          setPassword(invoiceData.password);
        } else {
          setPasswordProtected(false);
          setPassword('');
        }
        
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
        
        const { data: existingContent } = await supabase
          .from('shared_content')
          .select('id')
          .eq('shared_url', sharedUrl)
          .eq('content_type', 'invoice')
          .single();
        
        if (!existingContent) {
          const { data: fullInvoice, error: fullInvoiceError } = await supabase
            .from('client_invoices')
            .select('*')
            .eq('id', invoiceId)
            .single();
          
          if (fullInvoiceError) {
            throw new Error('Error al obtener datos completos de la factura');
          }
          
          const content = {
            amount: fullInvoice.amount,
            due_date: fullInvoice.due_date,
            payment_method: fullInvoice.payment_method,
            payment_date: fullInvoice.payment_date,
            payment_instructions: fullInvoice.payment_instructions
          };
          
          const { error: insertError } = await supabase
            .from('shared_content')
            .insert([{
              original_id: fullInvoice.id,
              content_type: 'invoice',
              title: fullInvoice.title,
              description: fullInvoice.description,
              content: content,
              password: fullInvoice.password,
              status: fullInvoice.status,
              shared_url: sharedUrl,
              client_name: invoiceData.clients?.name,
              client_website: invoiceData.clients?.website
            }]);
          
          if (insertError) {
            throw new Error('Error al crear factura pública');
          }
        }
        
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
  
  const handleUpdatePassword = async () => {
    if (!invoiceId) return;
    
    setIsLoading(true);
    try {
      const passwordValue = passwordProtected ? password : null;
      
      const { error } = await supabase
        .from('client_invoices')
        .update({ password: passwordValue })
        .eq('id', invoiceId);
        
      if (error) throw new Error('Error al actualizar la contraseña');
      
      toast.success(passwordProtected 
        ? 'Enlace protegido con contraseña' 
        : 'Protección de contraseña desactivada');
      
    } catch (err: any) {
      console.error('Error updating password:', err);
      toast.error(err.message || 'Error al actualizar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Factura: ${invoiceTitle}`);
    const body = encodeURIComponent(`Hola,\n\nComparto contigo esta factura${passwordProtected ? ' (protegida con contraseña)' : ''}.\n\nPuedes verla en: ${shareUrl}\n\n${passwordProtected ? `Contraseña: ${password}\n\n` : ''}Saludos.`);
    
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartir factura</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          <p className="text-sm text-muted-foreground">
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
            <>
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
              
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button 
                  onClick={handleCopyLink} 
                  className="w-full sm:w-auto gap-2 group"
                  variant="outline"
                >
                  <Link className="h-4 w-4 group-hover:animate-pulse" />
                  Copiar enlace
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleEmailShare} 
                  className="w-full sm:w-auto gap-2 group transition-colors"
                >
                  <Mail className="h-4 w-4 group-hover:animate-pulse" />
                  Compartir por email
                </Button>
              </div>
            </>
          )}
          
          <div className="border-t border-border pt-4 mt-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="password-protection"
                  checked={passwordProtected}
                  onCheckedChange={setPasswordProtected}
                />
                <Label htmlFor="password-protection" className="flex items-center gap-1">
                  {passwordProtected ? (
                    <Lock className="h-4 w-4 text-amber-500" />
                  ) : (
                    <Unlock className="h-4 w-4 text-muted-foreground" />
                  )}
                  Proteger con contraseña
                </Label>
              </div>
            </div>
            
            {passwordProtected && (
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Introduce una contraseña"
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={generateRandomPassword}
                    title="Generar contraseña aleatoria"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  El cliente necesitará esta contraseña para ver la factura
                </p>
              </div>
            )}
            
            <Button 
              className="mt-4 w-full"
              onClick={handleUpdatePassword}
              disabled={isLoading || (passwordProtected && !password)}
            >
              {passwordProtected ? 'Actualizar protección' : 'Quitar protección'}
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground mt-4">
            <h4 className="font-medium text-foreground">Información importante:</h4>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Cualquier persona con este enlace podrá ver la factura{passwordProtected ? ' (requiere contraseña)' : ''}</li>
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
