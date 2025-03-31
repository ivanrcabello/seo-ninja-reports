
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Copy, Link, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
  
  // Generar y obtener el enlace público cuando se abre el diálogo
  useEffect(() => {
    if (!open) return;
    
    const generateShareUrl = async () => {
      try {
        setIsLoading(true);
        
        // Primero, verificamos si el informe ya está en la tabla pública
        const { data: existingReport } = await supabase
          .from('public_reports')
          .select('id')
          .eq('id', reportId)
          .single();
        
        if (!existingReport) {
          // Si no existe, copiamos los datos del informe a la tabla pública
          const { data: reportData, error: reportError } = await supabase
            .from('reports')
            .select('*, clients(name, website)')
            .eq('id', reportId)
            .single();
          
          if (reportError) {
            console.error('Error al obtener el informe:', reportError);
            throw new Error(`Error al obtener el informe: ${reportError.message}`);
          }
          
          if (!reportData) {
            throw new Error('No se encontraron datos del informe');
          }
          
          // Insertamos en la tabla pública
          const { error: insertError } = await supabase
            .from('public_reports')
            .insert({
              id: reportData.id,
              title: reportData.title,
              date: reportData.date,
              status: reportData.status,
              url: reportData.url,
              summary: reportData.summary,
              content: reportData.content,
              client_name: reportData.clients?.name,
              client_website: reportData.clients?.website
            });
          
          if (insertError) {
            console.error('Error al insertar en public_reports:', insertError);
            throw new Error(`Error al compartir el informe: ${insertError.message}`);
          }
        }
        
        // Construimos la URL pública
        const shareUrl = `${window.location.origin}/shared/reports/${reportId}`;
        setShareUrl(shareUrl);
        
        toast.success('Enlace generado correctamente');
      } catch (error: any) {
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
    const body = encodeURIComponent(`Hola,\n\nQuiero compartir contigo este informe SEO.\n\nPuedes verlo en: ${shareUrl}\n\nSaludos.`);
    
    window.open(`mailto:?subject=${subject}&body=${body}`);
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
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareReportDialog;
