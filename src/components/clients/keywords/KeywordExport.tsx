
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Keyword } from '@/types/report.types';
import { Download, ClipboardCopy, FileJson, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';

interface KeywordExportProps {
  keywords: Keyword[];
  clientName: string;
}

const KeywordExport: React.FC<KeywordExportProps> = ({ keywords, clientName }) => {
  const [format, setFormat] = useState<'csv' | 'json' | 'text'>('csv');
  
  const formatDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };
  
  const generateFileName = () => {
    const sanitizedClientName = clientName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const date = formatDate();
    
    switch (format) {
      case 'csv':
        return `keywords-${sanitizedClientName}-${date}.csv`;
      case 'json':
        return `keywords-${sanitizedClientName}-${date}.json`;
      case 'text':
        return `keywords-${sanitizedClientName}-${date}.txt`;
    }
  };
  
  const generateContent = () => {
    switch (format) {
      case 'csv':
        const csvHeader = 'keyword,search_volume,difficulty\n';
        const csvRows = keywords.map(kw => 
          `"${kw.keyword}",${kw.searchVolume || ''},${kw.difficulty || ''}`
        ).join('\n');
        return csvHeader + csvRows;
        
      case 'json':
        const jsonContent = keywords.map(kw => ({
          keyword: kw.keyword,
          searchVolume: kw.searchVolume,
          difficulty: kw.difficulty
        }));
        return JSON.stringify(jsonContent, null, 2);
        
      case 'text':
        return keywords.map(kw => {
          let line = kw.keyword;
          if (kw.searchVolume) line += ` (${kw.searchVolume} búsquedas)`;
          if (kw.difficulty) line += ` [Dificultad: ${kw.difficulty}/100]`;
          return line;
        }).join('\n');
    }
  };
  
  const downloadFile = () => {
    const content = generateContent();
    const fileName = generateFileName();
    const blob = new Blob([content], { type: getContentType() });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`Archivo "${fileName}" descargado`);
  };
  
  const copyToClipboard = async () => {
    const content = generateContent();
    
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Contenido copiado al portapapeles');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error('Error al copiar al portapapeles');
    }
  };
  
  const getContentType = () => {
    switch (format) {
      case 'csv': return 'text/csv';
      case 'json': return 'application/json';
      case 'text': return 'text/plain';
    }
  };
  
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-medium">Exportar Palabras Clave</h3>
        <p className="text-sm text-muted-foreground">
          Exporta las {keywords.length} palabras clave en diferentes formatos
        </p>
      </div>
      
      <div className="space-y-2">
        <Label>Formato de exportación</Label>
        <RadioGroup 
          value={format} 
          onValueChange={(value) => setFormat(value as 'csv' | 'json' | 'text')}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="csv" id="csv" />
            <Label htmlFor="csv" className="flex items-center">
              <FileSpreadsheet className="h-4 w-4 mr-1" />
              CSV
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="json" id="json" />
            <Label htmlFor="json" className="flex items-center">
              <FileJson className="h-4 w-4 mr-1" />
              JSON
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="text" id="text" />
            <Label htmlFor="text" className="flex items-center">
              <FileSpreadsheet className="h-4 w-4 mr-1" />
              Texto plano
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-2">
        <Label>Vista previa</Label>
        <pre className="p-4 bg-muted/30 rounded-md text-xs max-h-[200px] overflow-auto">
          {generateContent().substring(0, 500)}
          {generateContent().length > 500 ? '...' : ''}
        </pre>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={copyToClipboard}>
          <ClipboardCopy className="h-4 w-4 mr-2" />
          Copiar
        </Button>
        <Button onClick={downloadFile}>
          <Download className="h-4 w-4 mr-2" />
          Descargar
        </Button>
      </div>
    </div>
  );
};

export default KeywordExport;
