
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check, Link2, Download, Printer } from 'lucide-react';
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
  onGenerateShareUrl?: () => Promise<string>;
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
  onShared,
  onGenerateShareUrl
}) => {
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [password, setPassword] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [sharedUrl, setSharedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPdfPreparing, setIsPdfPreparing] = useState(false);

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
      if (onGenerateShareUrl) {
        console.log('Using custom share URL generator');
        const generatedUrl = await onGenerateShareUrl();
        setSharedUrl(generatedUrl);
        
        if (onShared) {
          onShared(generatedUrl);
        }
        
        toast.success(`${getContentTypeTitle()} compartido exitosamente`);
        setIsSharing(false);
        return;
      }
      
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
  
  const handleDownloadAsPdf = async () => {
    if (!sharedUrl) return;
    
    setIsPdfPreparing(true);
    
    try {
      // Construir URL para vista de impresión
      const printViewUrl = sharedUrl.includes('?') 
        ? `${sharedUrl}&print=true&pdf=true` 
        : `${sharedUrl}?print=true&pdf=true`;
      
      // Abrir ventana para preparar impresión/PDF
      const printWindow = window.open(printViewUrl, '_blank');
      
      if (!printWindow) {
        toast.error('No se pudo abrir la ventana para descargar el PDF. Por favor, permita ventanas emergentes.');
        setIsPdfPreparing(false);
        return;
      }
      
      // Esperar a que la página cargue y luego iniciar la impresión a PDF
      printWindow.addEventListener('load', () => {
        setTimeout(() => {
          try {
            // Iniciar diálogo de impresión con opciones para PDF
            const mediaQueryList = printWindow.matchMedia('print');
            mediaQueryList.addEventListener('change', (mql) => {
              if (!mql.matches && printWindow) {
                // La impresión/PDF ha finalizado o sido cancelada
                console.log('PDF generation completed or canceled');
              }
            }, { once: true });
            
            printWindow.print();
            
            // El navegador mostrará el diálogo para guardar como PDF
            toast.success('Preparando documento para descarga como PDF');
          } catch (err) {
            console.error('Error al generar PDF:', err);
            toast.error('Hubo un problema al generar el PDF');
          } finally {
            setIsPdfPreparing(false);
          }
        }, 1500); // Dar tiempo para que el contenido se cargue completamente
      });
      
      printWindow.addEventListener('error', () => {
        toast.error('Error al cargar la página para el PDF');
        setIsPdfPreparing(false);
      });
    } catch (error) {
      console.error('Error en descarga PDF:', error);
      toast.error('Hubo un problema al generar el PDF');
      setIsPdfPreparing(false);
    }
  };
  
  const handlePreview = () => {
    if (sharedUrl) {
      window.open(sharedUrl, '_blank');
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
              
              <div className="flex flex-wrap gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadAsPdf}
                  className="flex items-center gap-1"
                  disabled={isPdfPreparing}
                >
                  <Download className="h-4 w-4" />
                  {isPdfPreparing ? "Preparando PDF..." : "Descargar como PDF"}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreview}
                  className="flex items-center gap-1"
                >
                  <Printer className="h-4 w-4" />
                  Vista previa
                </Button>
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
