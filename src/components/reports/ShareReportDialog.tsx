
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Copy, RefreshCw, Check } from 'lucide-react';
import { toast } from 'sonner';
import useReports from '@/hooks/useReports';
import { supabase } from '@/integrations/supabase/client';

export interface ShareReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportId: string | null;
}

const ShareReportDialog: React.FC<ShareReportDialogProps> = ({ 
  open, 
  onOpenChange,
  reportId
}) => {
  const [shareUrl, setShareUrl] = useState('');
  const [protectWithPassword, setProtectWithPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [hasSharedUrl, setHasSharedUrl] = useState(false);
  const { getReport } = useReports();
  
  const report = reportId ? getReport(reportId) : null;
  
  useEffect(() => {
    if (open && reportId) {
      // Check if report already has a shared URL
      const checkExistingSharedUrl = async () => {
        try {
          if (!reportId) return;
          
          const { data, error } = await supabase
            .from('shared_content')
            .select('id, password_protected')
            .eq('content_id', reportId)
            .eq('content_type', 'report')
            .single();
          
          if (error) {
            console.error('Error checking shared URL:', error);
            setHasSharedUrl(false);
            setShareUrl('');
            return;
          }
          
          if (data) {
            const url = `${window.location.origin}/shared/report/${data.id}`;
            setShareUrl(url);
            setHasSharedUrl(true);
            setProtectWithPassword(data.password_protected);
          } else {
            setHasSharedUrl(false);
            setShareUrl('');
          }
        } catch (error) {
          console.error('Error in checkExistingSharedUrl:', error);
        }
      };
      
      checkExistingSharedUrl();
    }
  }, [open, reportId]);
  
  const generateShareUrl = async () => {
    if (!reportId || !report) return;
    
    setIsGenerating(true);
    
    try {
      // First, check if there's already a shared URL
      const { data: existingData, error: existingError } = await supabase
        .from('shared_content')
        .select('id')
        .eq('content_id', reportId)
        .eq('content_type', 'report')
        .single();
      
      if (existingError && existingError.code !== 'PGRST116') {
        // Error other than "not found"
        console.error('Error checking existing shared URL:', existingError);
        throw new Error('Error al verificar URL compartida existente');
      }
      
      let sharedId;
      
      if (existingData) {
        // Update existing shared URL
        const { data: updateData, error: updateError } = await supabase
          .from('shared_content')
          .update({
            password_protected: protectWithPassword,
            password: protectWithPassword ? password : null,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData.id)
          .select('id')
          .single();
        
        if (updateError) {
          console.error('Error updating shared URL:', updateError);
          throw new Error('Error al actualizar URL compartida');
        }
        
        sharedId = updateData.id;
      } else {
        // Create new shared URL
        const { data: insertData, error: insertError } = await supabase
          .from('shared_content')
          .insert({
            content_id: reportId,
            content_type: 'report',
            password_protected: protectWithPassword,
            password: protectWithPassword ? password : null
          })
          .select('id')
          .single();
        
        if (insertError) {
          console.error('Error creating shared URL:', insertError);
          throw new Error('Error al crear URL compartida');
        }
        
        sharedId = insertData.id;
      }
      
      // Generate the full URL
      const url = `${window.location.origin}/shared/report/${sharedId}`;
      setShareUrl(url);
      setHasSharedUrl(true);
      
      toast.success('URL de compartir generada');
    } catch (error) {
      console.error('Error generating share URL:', error);
      toast.error('Error al generar URL para compartir');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const copyToClipboard = () => {
    if (!shareUrl) return;
    
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setIsCopied(true);
        toast.success('URL copiada al portapapeles');
        
        // Reset copied state after 3 seconds
        setTimeout(() => {
          setIsCopied(false);
        }, 3000);
      })
      .catch((error) => {
        console.error('Error copying to clipboard:', error);
        toast.error('Error al copiar al portapapeles');
      });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartir Informe</DialogTitle>
          <DialogDescription>
            Genere un enlace para compartir este informe con cualquier persona, incluso sin acceso a la plataforma.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {hasSharedUrl ? (
            <div className="space-y-2">
              <Label htmlFor="shareUrl">Enlace para compartir</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="shareUrl"
                  value={shareUrl}
                  readOnly
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  size="icon" 
                  variant="outline" 
                  onClick={copyToClipboard}
                  disabled={isCopied}
                >
                  {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="protectWithPassword" 
                  checked={protectWithPassword} 
                  onCheckedChange={(checked) => setProtectWithPassword(checked as boolean)}
                />
                <Label htmlFor="protectWithPassword">Proteger con contraseña</Label>
              </div>
              
              {protectWithPassword && (
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Introduzca una contraseña"
                  />
                </div>
              )}
            </div>
          )}
        </div>
        
        <DialogFooter className="sm:justify-between">
          {hasSharedUrl && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={generateShareUrl}
              disabled={isGenerating || (protectWithPassword && !password)}
              className="mr-auto"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Regenerando...
                </>
              ) : (
                'Regenerar enlace'
              )}
            </Button>
          )}
          
          {!hasSharedUrl && (
            <Button 
              type="button" 
              onClick={generateShareUrl}
              disabled={isGenerating || (protectWithPassword && !password)}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generando...
                </>
              ) : (
                'Generar enlace'
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareReportDialog;
