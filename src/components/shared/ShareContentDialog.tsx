
import React, { useState } from 'react';
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
import { SharedContentType } from '@/types/shared-content';
import { shareContent } from '@/api/shared-content/utils';

interface ShareContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentId: string;
  contentType: SharedContentType;
  contentTitle: string;
  contentData: any;
  contentStatus?: string;
  clientName?: string;
  clientWebsite?: string;
  onShared?: (sharedUrl: string) => void;
}

const ShareContentDialog: React.FC<ShareContentDialogProps> = ({
  open,
  onOpenChange,
  contentId,
  contentType,
  contentTitle,
  contentData,
  contentStatus = 'active',
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

  const shareItem = async () => {
    if (!contentId) return;
    
    try {
      setIsSharing(true);
      
      const sharedUrlId = await shareContent({
        originalId: contentId,
        contentType,
        title: contentTitle,
        description: contentData.description || '',
        content: contentData,
        status: contentStatus,
        clientName,
        clientWebsite,
        isPasswordProtected,
        password: isPasswordProtected ? password : ''
      });
      
      if (sharedUrlId) {
        // Set state and callback
        setSharedUrl(`${window.location.origin}/shared/${contentType}s/${sharedUrlId}`);
        setIsShared(true);
        if (onShared) onShared(sharedUrlId);
        
        toast.success(`${getContentTypeTitle()} compartido exitosamente`);
      } else {
        throw new Error(`No se pudo compartir el ${getContentTypeTitle().toLowerCase()}`);
      }
    } catch (error: any) {
      console.error(`Error sharing ${contentType}:`, error);
      toast.error(`Error al compartir ${getContentTypeTitle().toLowerCase()}`, {
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
          <DialogTitle>Compartir {getContentTypeTitle()}</DialogTitle>
          <DialogDescription>
            Compartir {getContentTypeTitle().toLowerCase()} "{contentTitle}" con el cliente.
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
                onClick={shareItem}
                disabled={isSharing || (isPasswordProtected && !password)}
              >
                {isSharing ? "Compartiendo..." : `Compartir ${getContentTypeTitle().toLowerCase()}`}
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
                ? `Este ${getContentTypeTitle().toLowerCase()} está protegido con contraseña.`
                : `Este ${getContentTypeTitle().toLowerCase()} es visible para cualquier persona con el enlace.`}
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

export default ShareContentDialog;
