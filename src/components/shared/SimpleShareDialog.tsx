
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check, Link2 } from 'lucide-react';
import { toast } from 'sonner';
import { shareContent, getShareUrl } from '@/utils/shareContent';

interface SimpleShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentId: string;
  contentType: 'report' | 'proposal' | 'invoice' | 'contract';
  title: string;
  data: any;
  clientName?: string;
  clientWebsite?: string;
  onShared?: (sharedUrl: string) => void;
}

const SimpleShareDialog: React.FC<SimpleShareDialogProps> = ({
  open,
  onOpenChange,
  contentId,
  contentType,
  title,
  data,
  clientName,
  clientWebsite,
  onShared
}) => {
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [password, setPassword] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [sharedUrl, setSharedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener el título adecuado según el tipo de contenido
  const getContentTypeTitle = (): string => {
    switch (contentType) {
      case 'report': return 'Informe';
      case 'proposal': return 'Propuesta';
      case 'invoice': return 'Factura';
      case 'contract': return 'Contrato';
      default: return 'Contenido';
    }
  };

  const handleShare = async () => {
    if (!contentId) {
      setError('ID de contenido no válido');
      toast.error('ID de contenido no válido');
      return;
    }

    setIsSharing(true);
    setError(null);

    try {
      const result = await shareContent({
        contentId,
        contentType,
        title,
        data,
        clientName,
        clientWebsite,
        usePassword: isPasswordProtected,
        password: isPasswordProtected ? password : undefined
      });

      if (result.success && result.url) {
        const fullUrl = getShareUrl(contentType, result.url);
        setSharedUrl(fullUrl);
        
        if (onShared) {
          onShared(result.url);
        }

        toast.success(`${getContentTypeTitle()} compartido exitosamente`);
      } else {
        throw new Error(result.error || 'Error desconocido al compartir');
      }
    } catch (error: any) {
      console.error('Error al compartir:', error);
      setError(error.message || 'Error al compartir contenido');
      toast.error(`Error al compartir ${getContentTypeTitle().toLowerCase()}`);
    } finally {
      setIsSharing(false);
    }
  };

  const copyToClipboard = () => {
    if (sharedUrl) {
      navigator.clipboard.writeText(sharedUrl)
        .then(() => {
          setCopied(true);
          toast.success('Enlace copiado al portapapeles');
          
          setTimeout(() => {
            setCopied(false);
          }, 2000);
        })
        .catch(() => {
          toast.error('No se pudo copiar el enlace');
        });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartir {getContentTypeTitle()}</DialogTitle>
        </DialogHeader>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 text-sm mb-4">
            {error}
          </div>
        )}
        
        {!sharedUrl ? (
          <>
            <div className="space-y-4 py-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="password-protection" 
                  checked={isPasswordProtected}
                  onCheckedChange={(checked) => setIsPasswordProtected(!!checked)}
                />
                <Label htmlFor="password-protection">Proteger con contraseña</Label>
              </div>
              
              {isPasswordProtected && (
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="Introduce una contraseña"
                  />
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button 
                onClick={handleShare}
                disabled={isSharing || (isPasswordProtected && !password)}
              >
                {isSharing ? "Compartiendo..." : "Compartir"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="space-y-4 py-2">
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
              
              <div className="text-sm text-muted-foreground">
                {isPasswordProtected
                  ? `Este ${getContentTypeTitle().toLowerCase()} está protegido con contraseña.`
                  : `Este ${getContentTypeTitle().toLowerCase()} es visible para cualquier persona con el enlace.`}
              </div>
            </div>
            
            <DialogFooter>
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

export default SimpleShareDialog;
