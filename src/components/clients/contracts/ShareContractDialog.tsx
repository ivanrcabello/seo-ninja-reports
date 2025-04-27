
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Copy, Check, Share2 } from 'lucide-react';
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
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const isMounted = useRef(true);
  
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  useEffect(() => {
    if (!open) {
      setIsCopied(false);
    }
    
    return () => {
      if (!open) {
        setShareUrl('');
        setIsLoading(false);
        setIsCopied(false);
      }
    };
  }, [open]);
  
  const handleGenerateUrl = async () => {
    if (!isMounted.current) return;
    
    setIsLoading(true);
    try {
      const shareId = await onGenerateShareUrl();
      if (!shareId) {
        throw new Error('Failed to generate share URL');
      }
      
      // Fix: Create the share URL correctly without duplicating the origin
      // Only use the origin once and append the path
      const fullShareUrl = `${window.location.origin}/shared/contracts/${shareId}`;
      console.log('Full share URL:', fullShareUrl);
      
      if (isMounted.current) {
        setShareUrl(fullShareUrl);
      }
    } catch (err: any) {
      console.error('Error generating share URL:', err);
      toast.error('Error al generar enlace para compartir');
      throw err;
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };
  
  const handleCopyToClipboard = () => {
    if (!shareUrl || !isMounted.current) return;
    
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        if (isMounted.current) {
          setIsCopied(true);
          toast.success('Enlace copiado al portapapeles');
          setTimeout(() => {
            if (isMounted.current) {
              setIsCopied(false);
            }
          }, 2000);
        }
      })
      .catch(err => {
        console.error('Error copying to clipboard:', err);
        if (isMounted.current) {
          toast.error('No se pudo copiar el enlace');
        }
      });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartir Contrato</DialogTitle>
          <DialogDescription>
            Genera un enlace para compartir este contrato con tu cliente.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          <p className="text-sm text-muted-foreground">
            <strong>Contrato:</strong> {contractTitle}
          </p>
          
          {!shareUrl ? (
            <Button 
              onClick={handleGenerateUrl} 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generando enlace...
                </>
              ) : (
                <>
                  <Share2 className="mr-2 h-4 w-4" />
                  Generar enlace para compartir
                </>
              )}
            </Button>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Input
                  value={shareUrl}
                  readOnly
                  className="flex-1"
                />
                <Button 
                  size="icon" 
                  variant="outline" 
                  onClick={handleCopyToClipboard}
                  className="shrink-0"
                >
                  {isCopied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Cualquier persona con este enlace podrá ver y firmar el contrato.
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter className="sm:justify-end">
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareContractDialog;
