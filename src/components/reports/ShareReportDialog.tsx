
import React, { useState, useEffect } from 'react';
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

interface ShareReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportId: string; // Keep supporting reportId for backwards compatibility
  reportTitle: string;
  report?: {
    id: string;
    title: string;
    clientId?: string;
    summary?: string;
    url?: string;
  };
  clientName?: string;
  clientWebsite?: string;
  onShared?: (sharedUrl: string) => void;
}

const ShareReportDialog: React.FC<ShareReportDialogProps> = ({
  open,
  onOpenChange,
  reportId,
  reportTitle,
  report,
  clientName = '',
  clientWebsite = '',
  onShared
}) => {
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [password, setPassword] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [sharedUrl, setSharedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Use either the provided report.id or the reportId prop
  const effectiveReportId = report?.id || reportId;
  const effectiveReportTitle = report?.title || reportTitle;

  useEffect(() => {
    // Reset state when dialog opens
    if (open) {
      setIsShared(false);
      setSharedUrl(null);
      setCopied(false);
    }
  }, [open]);

  const shareReport = async () => {
    if (!effectiveReportId) return;
    
    try {
      setIsSharing(true);
      
      // First check if the report is already shared
      const { data: existingShared, error: checkError } = await supabase
        .from('shared_content')
        .select('shared_url')
        .eq('original_id', effectiveReportId)
        .eq('content_type', 'report')
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
        
        // Get full report data
        const { data: reportData, error: reportError } = await supabase
          .from('reports')
          .select('*')
          .eq('id', effectiveReportId)
          .single();
          
        if (reportError) throw reportError;
        
        // Insert into shared_content
        const { error: insertError } = await supabase
          .from('shared_content')
          .insert({
            original_id: effectiveReportId,
            content_type: 'report',
            title: effectiveReportTitle,
            description: report?.summary || '',
            content: reportData.content || {},
            status: reportData.status,
            shared_url: sharedUrlId,
            password: isPasswordProtected ? password : null,
            client_name: clientName,
            client_website: clientWebsite
          });
          
        if (insertError) throw insertError;
      }
      
      // Set state and callback
      setSharedUrl(`${window.location.origin}/shared/reports/${sharedUrlId}`);
      setIsShared(true);
      if (onShared) onShared(sharedUrlId);
      
      // Also update the report with the shared_url
      await supabase
        .from('reports')
        .update({ shared_url: sharedUrlId })
        .eq('id', effectiveReportId);
      
    } catch (error: any) {
      console.error('Error sharing report:', error);
      toast.error('Error al compartir el informe', {
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
          <DialogTitle>Compartir Informe</DialogTitle>
          <DialogDescription>
            Compartir el informe "{effectiveReportTitle}" con el cliente.
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
                onClick={shareReport}
                disabled={isSharing || (isPasswordProtected && !password)}
              >
                {isSharing ? "Compartiendo..." : "Compartir informe"}
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
                ? "Este informe está protegido con contraseña."
                : "Este informe es visible para cualquier persona con el enlace."}
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

export default ShareReportDialog;
