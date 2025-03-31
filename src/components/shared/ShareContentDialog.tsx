
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
import { SharedContentType } from '@/types/shared-content';
import { supabase } from '@/integrations/supabase/client';
import { uuid } from '@supabase/supabase-js/dist/module/lib/helpers';

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
  const [error, setError] = useState<string | null>(null);

  // Limpiar el estado cuando se abre/cierra el diálogo
  useEffect(() => {
    if (!open) {
      // Si el diálogo se cierra, resetear estados sólo si no se ha compartido
      if (!isShared) {
        setIsPasswordProtected(false);
        setPassword('');
        setError(null);
      }
    }
  }, [open, isShared]);

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

  const validateContentId = (): boolean => {
    if (!contentId || typeof contentId !== 'string' || contentId.trim() === '') {
      setError(`Error: ID de ${getContentTypeTitle().toLowerCase()} no válido`);
      toast.error(`Error: ID de ${getContentTypeTitle().toLowerCase()} no válido`);
      return false;
    }
    return true;
  };

  const shareItem = async () => {
    // Validar primero que el contentId sea válido
    if (!validateContentId()) return;
    
    try {
      setIsSharing(true);
      setError(null);
      
      console.log(`Compartiendo ${contentType} con ID: ${contentId}`);
      
      // Crear UUID para la URL compartida
      const sharedUrlId = uuid();
      
      // Preparar datos para insertar
      const insertData = {
        original_id: contentId,
        content_type: contentType,
        title: contentTitle || `${getContentTypeTitle()} sin título`,
        description: contentData?.description || '',
        content: contentData || {},
        status: contentStatus,
        shared_url: sharedUrlId,
        password: isPasswordProtected ? password : null,
        client_name: clientName || '',
        client_website: clientWebsite || ''
      };

      console.log('Datos a insertar:', insertData);
      
      // Insertar en shared_content
      const { data, error } = await supabase
        .from('shared_content')
        .insert(insertData)
        .select();
      
      if (error) {
        console.error('Error de Supabase al compartir:', error);
        throw new Error(`Error al compartir: ${error.message}`);
      }
      
      console.log('Respuesta de inserción:', data);
      
      // Actualizar tabla específica según el tipo de contenido
      if (contentType === 'report') {
        const { error: updateError } = await supabase
          .from('reports')
          .update({ shared_url: sharedUrlId })
          .eq('id', contentId);
          
        if (updateError) {
          console.warn('No se pudo actualizar la tabla de informes:', updateError);
        }
      }
      
      // Construir la URL completa para compartir
      const fullSharedUrl = `${window.location.origin}/shared/${contentType}s/${sharedUrlId}`;
      setSharedUrl(fullSharedUrl);
      setIsShared(true);
      
      // Llamar al callback si existe
      if (onShared) {
        onShared(sharedUrlId);
      }
      
      toast.success(`${getContentTypeTitle()} compartido exitosamente`);
    } catch (error: any) {
      console.error(`Error al compartir ${contentType}:`, error);
      setError(error.message || `Error al compartir ${getContentTypeTitle().toLowerCase()}`);
      toast.error(`Error al compartir ${getContentTypeTitle().toLowerCase()}`, {
        description: error.message || "Ocurrió un error inesperado"
      });
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
        .catch((err) => {
          console.error('Error al copiar:', err);
          toast.error('No se pudo copiar el enlace');
        });
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
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 text-sm mb-4">
            {error}
          </div>
        )}
        
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
