
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Globe, FileText, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { fetchPageSpeedData } from '@/services/reportService';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';

interface ReportGeneratorStep1Props {
  url: string;
  setUrl: (url: string) => void;
  hasGoogleApiKey: boolean;
  nextStep: () => void;
  setPageSpeedData: (data: any) => void;
  usePageSpeedData: boolean;
  setUsePageSpeedData: (value: boolean) => void;
}

const ReportGeneratorStep1: React.FC<ReportGeneratorStep1Props> = ({
  url,
  setUrl,
  hasGoogleApiKey,
  nextStep,
  setPageSpeedData,
  usePageSpeedData,
  setUsePageSpeedData,
}) => {
  const [isLoadingPageSpeed, setIsLoadingPageSpeed] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  
  const handleContinue = async () => {
    if (!url) {
      toast.error('Debes proporcionar una URL válida');
      return;
    }

    // Add protocol if missing
    let processedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      processedUrl = 'https://' + url;
      setUrl(processedUrl);
    }

    // If Google API key is available and user wants PageSpeed data, try to fetch it
    if (hasGoogleApiKey && usePageSpeedData) {
      setIsLoadingPageSpeed(true);
      setLoadingMessage('Analizando datos de PageSpeed para desktop...');
      try {
        // We don't have reportId at this point, so we'll just fetch the data
        // and the reportId will be assigned when creating the report
        const pageSpeedResult = await fetchPageSpeedData(processedUrl);
        
        // Mark the pageSpeedData as not saved to db yet
        if (pageSpeedResult) {
          setPageSpeedData({
            ...pageSpeedResult,
            saved: false
          });
          
          toast.success('Datos de PageSpeed obtenidos correctamente');
        } else {
          toast.warning('No se pudieron obtener datos completos de PageSpeed, continuando con datos parciales o sin esta información');
        }
      } catch (error: any) {
        console.error('Error fetching PageSpeed data:', error);
        toast.error('Error al obtener datos de PageSpeed, continuando sin esta información', {
          description: error.message
        });
      } finally {
        setIsLoadingPageSpeed(false);
        setLoadingMessage('');
        nextStep();
      }
    } else {
      // If no Google API key or user doesn't want PageSpeed data, just continue
      nextStep();
    }
  };

  return (
    <>
      <CardContent className="space-y-6 pt-4">
        <div className="space-y-2">
          <Label htmlFor="url">URL del Sitio Web</Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="url"
              type="url"
              placeholder="https://ejemplo.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="pl-10 glass-input"
              required
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Introduce la URL principal que quieres analizar
          </p>
        </div>
        
        <div className="flex items-center justify-between space-x-2">
          <div className="space-y-0.5">
            <Label htmlFor="use-pagespeed">Incluir datos de PageSpeed</Label>
            <p className="text-xs text-muted-foreground">
              Analiza la velocidad y rendimiento de la web
            </p>
          </div>
          <Switch
            id="use-pagespeed"
            checked={usePageSpeedData}
            onCheckedChange={setUsePageSpeedData}
            disabled={!hasGoogleApiKey}
          />
        </div>
        
        {!hasGoogleApiKey && (
          <Alert variant="destructive" className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-700">
              No se ha configurado la API key de Google PageSpeed. Se generará el informe sin datos de rendimiento. Para incluir datos de rendimiento, configura la API key en la sección de Configuración.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex justify-center items-center">
          <span className="h-px flex-1 bg-border"></span>
          <span className="px-3 text-sm text-muted-foreground">Luego</span>
          <span className="h-px flex-1 bg-border"></span>
        </div>
        
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
          <div className="flex items-start space-x-4">
            <div className="bg-primary/10 p-2 rounded-full">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-medium">En los siguientes pasos</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Podrás incluir información del perfil de negocio, palabras clave, 
                informes SEO existentes y subir archivos adicionales para mejorar tu análisis.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end pt-4">
        <Button
          onClick={handleContinue}
          disabled={!url || isLoadingPageSpeed}
          className="group"
        >
          {isLoadingPageSpeed ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {loadingMessage || 'Obteniendo datos de rendimiento...'}
            </>
          ) : (
            <>
              Continuar
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </Button>
      </CardFooter>
    </>
  );
};

export default ReportGeneratorStep1;
