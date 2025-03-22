
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Copy, Link, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface ShareProposalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proposalId: string;
  proposalTitle: string;
  onGenerateShareUrl: () => Promise<string>;
}

const ShareProposalDialog: React.FC<ShareProposalDialogProps> = ({
  open,
  onOpenChange,
  proposalId,
  proposalTitle,
  onGenerateShareUrl
}) => {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Reset state when dialog opens or closes
  useEffect(() => {
    if (!open) {
      // Reset state when dialog closes
      setShareUrl('');
      setCopied(false);
      setIsLoading(false);
    } else if (open && !shareUrl) {
      // Generate URL when dialog opens
      setIsLoading(true);
      onGenerateShareUrl()
        .then(url => {
          console.log('Successfully generated URL:', url);
          setShareUrl(url);
        })
        .catch(error => {
          toast.error('Error al generar enlace');
          console.error('Error generating share URL:', error);
          // Close dialog on error
          onOpenChange(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [open, onGenerateShareUrl, shareUrl, onOpenChange]);
  
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
    const subject = encodeURIComponent(`Propuesta: ${proposalTitle}`);
    const body = encodeURIComponent(`Hola,\n\nQuiero compartir contigo esta propuesta.\n\nPuedes verla en: ${shareUrl}\n\nSaludos.`);
    
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };
  
  // Explicit handle for dialog close
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      // Allow a small delay before actually closing
      setTimeout(() => {
        onOpenChange(false);
      }, 100);
    } else {
      onOpenChange(true);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartir Propuesta</DialogTitle>
          <DialogDescription>
            Comparte esta propuesta mediante un enlace directo.
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

export default ShareProposalDialog;
