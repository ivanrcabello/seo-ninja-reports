
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, FileUp, ClipboardCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Keyword } from '@/types/report.types';

interface KeywordImportProps {
  onImport: (keywords: Omit<Keyword, 'id' | 'reportId' | 'createdAt'>[]) => Promise<boolean>;
}

const KeywordImport: React.FC<KeywordImportProps> = ({ onImport }) => {
  const [importText, setImportText] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [format, setFormat] = useState<'csv' | 'list'>('list');
  
  const parseKeywords = (): Omit<Keyword, 'id' | 'reportId' | 'createdAt'>[] => {
    if (!importText.trim()) return [];
    
    if (format === 'list') {
      // Simple list format: one keyword per line
      return importText.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(keyword => ({ keyword }));
    } else {
      // CSV format: keyword,search_volume,difficulty
      return importText.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => {
          const parts = line.split(',').map(part => part.trim());
          const keyword = parts[0];
          const searchVolume = parts[1] ? parseInt(parts[1]) : undefined;
          const difficulty = parts[2] ? parseInt(parts[2]) : undefined;
          
          return {
            keyword,
            searchVolume: isNaN(searchVolume as number) ? undefined : searchVolume,
            difficulty: isNaN(difficulty as number) ? undefined : difficulty
          };
        })
        .filter(k => k.keyword && k.keyword.length > 0);
    }
  };
  
  const handleImport = async () => {
    const keywords = parseKeywords();
    
    if (keywords.length === 0) {
      toast.error('No se encontraron palabras clave para importar');
      return;
    }
    
    setIsImporting(true);
    try {
      await onImport(keywords);
      setImportText('');
    } catch (error) {
      console.error('Error importing keywords:', error);
      toast.error('Error al importar palabras clave');
    } finally {
      setIsImporting(false);
    }
  };
  
  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setImportText(clipboardText);
      toast.success('Texto pegado del portapapeles');
    } catch (error) {
      console.error('Error accessing clipboard:', error);
      toast.error('No se pudo acceder al portapapeles');
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-base font-medium">Importar Palabras Clave</h3>
          <p className="text-sm text-muted-foreground">
            Pega tus palabras clave para importarlas en lote
          </p>
        </div>
        <div className="flex items-center space-x-1 rounded-md border p-1">
          <Button
            variant={format === 'list' ? "default" : "ghost"}
            size="sm"
            onClick={() => setFormat('list')}
          >
            Lista
          </Button>
          <Button
            variant={format === 'csv' ? "default" : "ghost"}
            size="sm"
            onClick={() => setFormat('csv')}
          >
            CSV
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="import-text">
          {format === 'list' 
            ? 'Pega una palabra clave por línea' 
            : 'Formato: palabra clave,volumen de búsqueda,dificultad'}
        </Label>
        <div className="relative">
          <Textarea
            id="import-text"
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder={format === 'list' 
              ? "marketing digital\nposicionamiento seo\ndiseño web" 
              : "marketing digital,1000,80\nposicionamiento seo,800,65\ndiseño web,500,40"}
            className="min-h-[200px]"
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2"
            onClick={handlePaste}
          >
            <ClipboardCheck className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button
          onClick={handleImport}
          disabled={!importText.trim() || isImporting}
        >
          {isImporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Importando...
            </>
          ) : (
            <>
              <FileUp className="mr-2 h-4 w-4" />
              Importar ({parseKeywords().length} palabras)
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default KeywordImport;
