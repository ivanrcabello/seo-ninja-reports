
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, AlertCircle } from 'lucide-react';

interface ShareInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId: string;
  invoiceTitle: string;
  onGenerateShareUrl: () => Promise<string>;
}

const ShareInvoiceDialog: React.FC<ShareInvoiceDialogProps> = ({
  open,
  onOpenChange,
  invoiceId,
  invoiceTitle,
  onGenerateShareUrl
}) => {
  const [shareUrl, setShareUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    const generateLink = async () => {
      if (!open) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const urlId = await onGenerateShareUrl();
        const baseUrl = window.location.origin;
        const fullUrl = `${baseUrl}/shared/invoices/${urlId}`;
        setShareUrl(fullUrl);
      } catch (err: any) {
        console.error('Error generating share URL:', err);
        setError(err.message || 'Error al generar enlace');
      } finally {
        setIsLoading(false);
      }
    };
    
    generateLink();
  }, [open, onGenerateShareUrl]);
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartir factura</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          <p className="text-sm">
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
          )}
          
          <div className="text-sm text-muted-foreground">
            <h4 className="font-medium text-foreground">Información importante:</h4>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Cualquier persona con este enlace podrá ver la factura</li>
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
