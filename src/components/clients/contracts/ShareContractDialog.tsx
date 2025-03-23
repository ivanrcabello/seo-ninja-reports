
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Copy, Link, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface ShareContractDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractId: string;
  contractTitle: string;
  onGenerateShareUrl: () => Promise<string>;
}

const ShareContractDialog: React.FC<ShareContractDialogProps> = ({
  open,
  onOpenChange,
  contractId,
  contractTitle,
  onGenerateShareUrl
}) => {
  const [shareUrl, setShareUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Generate share link when dialog opens
  React.useEffect(() => {
    if (open) {
      generateShareLink();
    }
  }, [open]);
  
  const generateShareLink = async () => {
    try {
      setIsGenerating(true);
      
      // Log for debugging
      console.log('Generating share URL for contract:', contractId);
      
      const url = await onGenerateShareUrl();
      console.log('Generated share URL:', url);
      
      setShareUrl(url);
    } catch (error) {
      console.error('Error generating share URL:', error);
      toast.error('Error al generar enlace para compartir');
    } finally {
      setIsGenerating(false);
    }
  };
  
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
    const subject = encodeURIComponent(`Contrato: ${contractTitle}`);
    const body = encodeURIComponent(`Hola,\n\nQuiero compartir contigo este contrato para tu revisión y firma.\n\nPuedes verlo en: ${shareUrl}\n\nSaludos.`);
    
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass">
        <DialogHeader>
          <DialogTitle>Compartir Contrato</DialogTitle>
          <DialogDescription>
            Comparte este contrato mediante un enlace directo para que pueda ser firmado.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="w-full"
                placeholder={isGenerating ? "Generando enlace..." : "Enlace de compartir"}
                disabled={isGenerating}
              />
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleCopyLink} 
              className="transition-all group hover:bg-primary hover:text-primary-foreground"
              disabled={isGenerating || !shareUrl}
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
              disabled={isGenerating || !shareUrl}
            >
              <Link className="h-4 w-4 group-hover:animate-pulse" />
              Copiar enlace
            </Button>
            <Button 
              variant="outline" 
              onClick={handleEmailShare} 
              className="w-full sm:w-auto gap-2 group transition-colors hover:bg-primary hover:text-primary-foreground"
              disabled={isGenerating || !shareUrl}
            >
              <Mail className="h-4 w-4 group-hover:animate-pulse" />
              Compartir por email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareContractDialog;
