
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Client } from '@/types/client.types';
import { startCrawl } from '@/services/seoCrawlerService';
import { toast } from 'sonner';
import { Loader2, Plus, Trash } from 'lucide-react';

interface CrawlerDialogProps {
  client: Client;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const CrawlerDialog: React.FC<CrawlerDialogProps> = ({ 
  client, 
  open, 
  onOpenChange,
  onSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState(client.website);
  const [maxPages, setMaxPages] = useState(100);
  const [followExternalLinks, setFollowExternalLinks] = useState(false);
  const [excludePatterns, setExcludePatterns] = useState<string[]>([]);
  const [includePatterns, setIncludePatterns] = useState<string[]>([]);
  const [newPattern, setNewPattern] = useState('');
  const [patternType, setPatternType] = useState<'include' | 'exclude'>('exclude');

  const addPattern = () => {
    if (!newPattern.trim()) return;
    
    if (patternType === 'exclude') {
      setExcludePatterns([...excludePatterns, newPattern.trim()]);
    } else {
      setIncludePatterns([...includePatterns, newPattern.trim()]);
    }
    
    setNewPattern('');
  };

  const removePattern = (pattern: string, type: 'include' | 'exclude') => {
    if (type === 'exclude') {
      setExcludePatterns(excludePatterns.filter(p => p !== pattern));
    } else {
      setIncludePatterns(includePatterns.filter(p => p !== pattern));
    }
  };

  const handleStartCrawl = async () => {
    try {
      setIsLoading(true);
      
      await startCrawl({
        url,
        clientId: client.id,
        maxPages,
        excludePatterns,
        includePatterns,
        followExternalLinks
      });
      
      onOpenChange(false);
      if (onSuccess) onSuccess();
      
    } catch (error: any) {
      toast.error(error.message || 'Error al iniciar el análisis');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-xl lg:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Iniciar Análisis SEO Técnico</DialogTitle>
          <DialogDescription>
            Analizar el sitio web {client.name} en busca de problemas técnicos SEO
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL a analizar</Label>
            <Input 
              id="url" 
              value={url} 
              onChange={e => setUrl(e.target.value)} 
              placeholder="https://ejemplo.com"
            />
            <p className="text-sm text-muted-foreground">
              URL completa desde donde comenzará el análisis
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maxPages">Número máximo de páginas</Label>
            <Input 
              id="maxPages" 
              type="number" 
              value={maxPages} 
              onChange={e => setMaxPages(parseInt(e.target.value) || 100)} 
              min={1}
              max={500}
            />
            <p className="text-sm text-muted-foreground">
              Límite de páginas a analizar (máximo recomendado: 500)
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="followExternalLinks" 
              checked={followExternalLinks} 
              onCheckedChange={setFollowExternalLinks} 
            />
            <Label htmlFor="followExternalLinks">Seguir enlaces externos</Label>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <Label>Patrones de inclusión/exclusión</Label>
            
            <div className="flex gap-2">
              <Input 
                value={newPattern} 
                onChange={e => setNewPattern(e.target.value)} 
                placeholder="Ejemplo: /blog/, /wp-admin/, etc."
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addPattern();
                  }
                }}
              />
              
              <div className="flex items-center space-x-2 min-w-[120px]">
                <Checkbox 
                  id="patternType" 
                  checked={patternType === 'exclude'} 
                  onCheckedChange={(checked) => setPatternType(checked ? 'exclude' : 'include')} 
                />
                <Label htmlFor="patternType">Excluir</Label>
              </div>
              
              <Button type="button" size="icon" onClick={addPattern}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Patrones de exclusión:</h4>
              {excludePatterns.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {excludePatterns.map((pattern, index) => (
                    <div key={index} className="flex items-center bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm">
                      <span>{pattern}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5 ml-1 hover:bg-destructive/20" 
                        onClick={() => removePattern(pattern, 'exclude')}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No hay patrones de exclusión</p>
              )}
              
              <h4 className="text-sm font-medium">Patrones de inclusión:</h4>
              {includePatterns.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {includePatterns.map((pattern, index) => (
                    <div key={index} className="flex items-center bg-primary/20 text-primary-foreground rounded-full px-3 py-1 text-sm">
                      <span>{pattern}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5 ml-1 hover:bg-destructive/20" 
                        onClick={() => removePattern(pattern, 'include')}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No hay patrones de inclusión</p>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleStartCrawl} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analizando...
              </>
            ) : 'Iniciar Análisis'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CrawlerDialog;
