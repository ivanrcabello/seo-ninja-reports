
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Copy, Link, Mail, Lock, Unlock, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

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
  const [isLoading, setIsLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [passwordProtected, setPasswordProtected] = useState(false);
  const [password, setPassword] = useState('');
  
  // Generate a random password when needed
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
  };
  
  // Generar y obtener el enlace público cuando se abre el diálogo
  useEffect(() => {
    if (!open) return;
    
    const generateShareUrl = async () => {
      try {
        setIsLoading(true);
        
        // Check if the report has an existing password
        const { data: reportData, error: reportError } = await supabase
          .from('reports')
          .select('password')
          .eq('id', reportId)
          .single();
        
        if (reportError) {
          throw new Error(`Error al obtener el informe: ${reportError.message}`);
        }
        
        // Set password state based on existing data
        if (reportData.password) {
          setPasswordProtected(true);
          setPassword(reportData.password);
        } else {
          setPasswordProtected(false);
          setPassword('');
        }
        
        // Primero, verificamos si el informe ya está en la tabla pública
        const { data: existingReport } = await supabase
          .from('public_reports')
          .select('id')
          .eq('id', reportId)
          .single();
        
        if (!existingReport) {
          // Si no existe, copiamos los datos del informe a la tabla pública
          const { data: fullReportData, error: fullReportError } = await supabase
            .from('reports')
            .select('*, clients(name, website)')
            .eq('id', reportId)
            .single();
          
          if (fullReportError) {
            throw new Error(`Error al obtener el informe: ${fullReportError.message}`);
          }
          
          // Insertamos en la tabla pública con type assertion
          const { error: insertError } = await supabase
            .from('public_reports')
            .insert([{
              id: fullReportData.id,
              title: fullReportData.title,
              date: fullReportData.date,
              status: fullReportData.status,
              url: fullReportData.url,
              summary: fullReportData.summary,
              content: fullReportData.content,
              client_name: fullReportData.clients?.name,
              client_website: fullReportData.clients?.website
            }] as any);
          
          if (insertError) {
            throw new Error(`Error al compartir el informe: ${insertError.message}`);
          }
        }
        
        // Construimos la URL pública
        const shareUrl = `${window.location.origin}/shared/reports/${reportId}`;
        setShareUrl(shareUrl);
        
        toast.success('Enlace generado correctamente');
      } catch (error) {
        console.error('Error al generar enlace:', error);
        toast.error('Error al generar enlace para compartir');
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
    const body = encodeURIComponent(`Hola,\n\nQuiero compartir contigo este informe SEO${passwordProtected ? ' (protegido con contraseña)' : ''}.\n\nPuedes verlo en: ${shareUrl}\n\n${passwordProtected ? `Contraseña: ${password}\n\n` : ''}Saludos.`);
    
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };
  
  const handleUpdatePassword = async () => {
    if (!reportId) return;
    
    setIsLoading(true);
    try {
      // Actualizamos la contraseña en la tabla reports
      const passwordValue = passwordProtected ? password : null;
      
      const { error } = await supabase
        .from('reports')
        .update({ password: passwordValue })
        .eq('id', reportId);
        
      if (error) throw new Error('Error al actualizar la contraseña');
      
      toast.success(passwordProtected 
        ? 'Informe protegido con contraseña' 
        : 'Protección de contraseña desactivada');
      
    } catch (err: any) {
      console.error('Error updating password:', err);
      toast.error(err.message || 'Error al actualizar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass">
        <DialogHeader>
          <DialogTitle>Compartir Informe</DialogTitle>
          <DialogDescription>
            Comparte este informe mediante un enlace directo.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="w-8 h-8 rounded-full border-4 border-t-primary border-primary/30 animate-spin"></div>
              <span className="ml-3">Generando enlace...</span>
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
                      El destinatario necesitará esta contraseña para ver el informe
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
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareReportDialog;
