
import React, { useState } from 'react';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { startCrawl } from '@/services/seo-crawler/api';
import { Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface CrawlerDialogProps {
  clientId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const CrawlerDialog = ({ 
  clientId, 
  open, 
  onOpenChange,
  onSuccess 
}: CrawlerDialogProps) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [followExternalLinks, setFollowExternalLinks] = useState(false);
  const [maxDepth, setMaxDepth] = useState(3);
  const [maxPages, setMaxPages] = useState(50);
  const [crawlSpeed, setCrawlSpeed] = useState('medium');
  
  const speedOptions = {
    slow: { delay: 2000, concurrency: 1 },
    medium: { delay: 1000, concurrency: 2 },
    fast: { delay: 500, concurrency: 4 }
  };
  
  const handleStartCrawl = async () => {
    if (!url.trim()) {
      toast.error('Por favor, introduce una URL válida');
      return;
    }
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setUrl(`https://${url}`);
    }
    
    try {
      setIsLoading(true);
      
      // Get crawl options based on selected speed
      const speedSetting = speedOptions[crawlSpeed as keyof typeof speedOptions];
      
      const options = {
        follow_external_links: followExternalLinks,
        max_depth: maxDepth,
        delay: speedSetting.delay,
        concurrency: speedSetting.concurrency,
        max_pages: maxPages
      };
      
      await startCrawl(clientId, url, options);
      
      toast.success('Análisis iniciado correctamente');
      onOpenChange(false);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error starting crawl:', error);
      toast.error('Error al iniciar el análisis');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nuevo análisis SEO técnico</DialogTitle>
          <DialogDescription>
            Introduce la URL del sitio web que quieres analizar.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="url">URL del sitio web</Label>
            <Input
              id="url"
              type="text"
              placeholder="https://ejemplo.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="max-pages">Número máximo de páginas a analizar: {maxPages}</Label>
            <Slider
              id="max-pages"
              min={10}
              max={200}
              step={10}
              value={[maxPages]}
              onValueChange={(value) => setMaxPages(value[0])}
            />
            <span className="text-xs text-muted-foreground">
              Recomendado: 50 páginas para sitios pequeños, 100-200 para sitios grandes
            </span>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="max-depth">Profundidad máxima: {maxDepth}</Label>
            <Slider
              id="max-depth"
              min={1}
              max={10}
              step={1}
              value={[maxDepth]}
              onValueChange={(value) => setMaxDepth(value[0])}
            />
            <span className="text-xs text-muted-foreground">
              Define cuántos niveles de links seguirá el crawler desde la página inicial
            </span>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="crawl-speed">Velocidad de análisis</Label>
            <Select 
              value={crawlSpeed} 
              onValueChange={setCrawlSpeed}
            >
              <SelectTrigger id="crawl-speed">
                <SelectValue placeholder="Selecciona la velocidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="slow">Lenta (menos carga en el servidor)</SelectItem>
                <SelectItem value="medium">Media (recomendado)</SelectItem>
                <SelectItem value="fast">Rápida (más carga en el servidor)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id="follow-external" 
              checked={followExternalLinks}
              onCheckedChange={(checked) => setFollowExternalLinks(checked as boolean)}
            />
            <Label htmlFor="follow-external" className="cursor-pointer">
              Seguir enlaces externos
            </Label>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={handleStartCrawl} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Iniciando...
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
