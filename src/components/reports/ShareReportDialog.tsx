
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Copy, Link, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface ShareReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportId: string;
  reportTitle: string;
}

const ShareReportDialog: React.FC<ShareReportDialogProps> = ({
  open,
  onOpenChange,
  reportId,
  reportTitle
}) => {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [password, setPassword] = useState('');
  
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
        
        // Check if report is password protected
        const { data: protectionData, error: protectionError } = await supabase.rpc(
          'check_report_password_protection',
          { report_id_param: reportId }
        );
        
        if (protectionError) throw new Error('Error checking password protection');
        
        setIsPasswordProtected(protectionData);
        
        // Construct the URL
        const fullUrl = `${window.location.origin}/shared/reports/${reportId}`;
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
  }, [open, reportId]);
  
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
    const subject = encodeURIComponent(`Informe SEO: ${reportTitle}`);
    const body = encodeURIComponent(`Hola,\n\nQuiero compartir contigo este informe SEO.\n\nPuedes verlo en: ${shareUrl}\n\nSaludos.`);
    
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };
  
  const handlePasswordChange = async () => {
    if (!reportId) return;
    
    try {
      setIsLoading(true);
      
      if (isPasswordProtected && !password) {
        // Remove password
        const { error } = await supabase
          .from('reports')
          .update({ password: null })
          .eq('id', reportId);
        
        if (error) throw new Error('Error al eliminar la contraseña');
        
        setIsPasswordProtected(false);
        toast.success('Protección por contraseña eliminada');
      } 
      else if (password) {
        // Set password
        const { error } = await supabase
          .from('reports')
          .update({ password })
          .eq('id', reportId);
        
        if (error) throw new Error('Error al establecer la contraseña');
        
        setIsPasswordProtected(true);
        toast.success('Protección por contraseña establecida');
      }
    } catch (error: any) {
      console.error('Error changing password protection:', error);
      toast.error('Error: ' + (error.message || 'Error al cambiar la protección'));
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartir Informe</DialogTitle>
          <DialogDescription>
            Comparte este informe mediante un enlace directo.
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
              
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Checkbox 
                    id="password-protected" 
                    checked={isPasswordProtected} 
                    onCheckedChange={(checked) => setIsPasswordProtected(checked === true)}
                  />
                  <Label htmlFor="password-protected">Proteger con contraseña</Label>
                </div>
                
                {isPasswordProtected && (
                  <div className="flex items-center space-x-2">
                    <Input 
                      type="password" 
                      placeholder="Introduzca una contraseña" 
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={handlePasswordChange}
                      disabled={isLoading}
                    >
                      <Lock className="h-4 w-4" />
                    </Button>
                  </div>
                )}
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

export default ShareReportDialog;
