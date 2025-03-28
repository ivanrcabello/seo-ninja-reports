
import React, { useState } from 'react';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { fetchPageSpeedData } from '@/services/api/pageSpeedService';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce';

interface ReportGeneratorStep1Props {
  url: string;
  setUrl: (url: string) => void;
  hasGoogleApiKey: boolean;
  nextStep: () => void;
  setPageSpeedData: (data: any) => void;
  usePageSpeedData: boolean;
  setUsePageSpeedData: (use: boolean) => void;
}

const ReportGeneratorStep1: React.FC<ReportGeneratorStep1Props> = ({
  url,
  setUrl,
  hasGoogleApiKey,
  nextStep,
  setPageSpeedData,
  usePageSpeedData,
  setUsePageSpeedData
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [inputUrl, setInputUrl] = useState(url);
  const debouncedUrl = useDebounce(inputUrl, 300);

  // Validate and normalize URL
  const normalizeUrl = (input: string): string => {
    try {
      if (!input) return '';
      
      // Check if it's a valid domain without protocol
      if (/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(input)) {
        return `https://${input}`;
      }
      
      // If it has protocol but no path, make sure it ends with /
      if (/^https?:\/\/[^\/]+$/.test(input)) {
        return `${input}/`;
      }
      
      // If it's already a valid URL, return as is
      if (/^https?:\/\//.test(input)) {
        return input;
      }
      
      // Add protocol if missing
      return `https://${input}`;
    } catch (e) {
      return input;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputUrl) {
      toast.error('Debes proporcionar una URL válida');
      return;
    }
    
    // Normalize URL
    const normalizedUrl = normalizeUrl(inputUrl);
    setUrl(normalizedUrl);
    
    if (hasGoogleApiKey && usePageSpeedData) {
      setIsLoading(true);
      try {
        const data = await fetchPageSpeedData(normalizedUrl);
        if (data) {
          setPageSpeedData(data);
          toast.success('Datos de PageSpeed obtenidos correctamente');
        } else {
          setPageSpeedData(null);
          toast.error('No se pudieron obtener datos de PageSpeed, se continuará sin ellos');
        }
      } catch (error) {
        console.error('Error fetching PageSpeed data:', error);
        setPageSpeedData(null);
        toast.error('Error al obtener datos de PageSpeed, se continuará sin ellos');
      } finally {
        setIsLoading(false);
      }
    }
    
    nextStep();
  };

  return (
    <>
      <CardContent className="space-y-6 pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL del sitio web a auditar</Label>
            <Input
              id="url"
              placeholder="https://example.com"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              {debouncedUrl ? `Se analizará: ${normalizeUrl(debouncedUrl)}` : 'Introduce la URL del sitio web a auditar'}
            </p>
          </div>
          
          {hasGoogleApiKey && (
            <div className="flex items-center space-x-2">
              <Switch
                id="pagespeed"
                checked={usePageSpeedData}
                onCheckedChange={setUsePageSpeedData}
              />
              <Label htmlFor="pagespeed" className="cursor-pointer">
                Incluir análisis de rendimiento web (Google PageSpeed)
              </Label>
            </div>
          )}
          
          {!hasGoogleApiKey && (
            <div className="bg-yellow-50 text-yellow-800 p-3 rounded-md text-sm">
              <p className="font-medium">No has configurado una API key de Google PageSpeed</p>
              <p>Para incluir datos de rendimiento web, configura una API key en la sección de Configuración.</p>
            </div>
          )}
          
          <div className="bg-blue-50 text-blue-800 p-3 rounded-md text-sm">
            <p className="font-medium">Paso 1: Auditoría SEO Técnica</p>
            <p>Analizaremos en detalle aspectos técnicos como la velocidad de carga, estructura HTML, encabezados, meta tags y otros factores clave para el SEO.</p>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!inputUrl || isLoading}
          className="w-full sm:w-auto"
        >
          {isLoading ? 'Analizando sitio...' : 'Iniciar auditoría técnica'}
        </Button>
      </CardFooter>
    </>
  );
};

export default ReportGeneratorStep1;
