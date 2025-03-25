
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { startCrawl } from '@/services/seo-crawler';
import { toast } from 'sonner';

interface CrawlerDialogProps {
  clientId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const CrawlerDialog: React.FC<CrawlerDialogProps> = ({
  clientId,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };
  
  const handleStartCrawl = async () => {
    if (!url.trim()) {
      toast.error('Por favor, introduce una URL válida');
      return;
    }
    
    // Add http:// prefix if missing
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
      console.log(`Added https:// prefix to URL: ${normalizedUrl}`);
    }
    
    console.log(`Starting crawl with normalized URL: ${normalizedUrl}`);
    
    setIsLoading(true);
    
    try {
      console.log(`Starting crawl for normalized URL: ${normalizedUrl}`);
      const result = await startCrawl(clientId, normalizedUrl);
      
      console.log('Edge function response:', result);
      
      if (result.success) {
        toast.success('Análisis SEO iniciado correctamente');
        onOpenChange(false);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        console.error('Edge function returned error:', result.message);
        toast.error(`Error: ${result.message}`);
      }
    } catch (error: any) {
      console.error('Error invoking edge function:', error);
      console.error('Error starting crawl:', error);
      console.error('Error al iniciar análisis:', error);
      toast.error('Error al iniciar análisis SEO' + (error.message ? `: ${error.message}` : ''));
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nuevo análisis SEO</DialogTitle>
          <DialogDescription>
            Introduce la URL del sitio web que quieres analizar. Asegúrate de incluir el protocolo (http:// o https://).
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right">
              URL
            </Label>
            <div className="col-span-3">
              <Input
                id="url"
                placeholder="https://www.ejemplo.com"
                value={url}
                onChange={handleUrlChange}
                className="w-full"
              />
              {!url.startsWith('http://') && !url.startsWith('https://') && url.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  Se añadirá automáticamente 'https://' al inicio si no lo incluyes
                </p>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleStartCrawl} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analizando...
              </>
            ) : (
              'Iniciar análisis'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CrawlerDialog;
