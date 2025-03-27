
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Gauge, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { fetchPageSpeedData } from '@/services/api/pagespeed/fetchPageSpeedData';
import { useReportGenerator } from '@/context/ReportGeneratorContext';

interface UrlAndSpeedStepProps {
  nextStep: () => void;
  previousStep: () => void;
  hasGoogleApiKey: boolean;
}

const UrlAndSpeedStep: React.FC<UrlAndSpeedStepProps> = ({
  nextStep,
  previousStep,
  hasGoogleApiKey
}) => {
  const { 
    url, setUrl,
    usePageSpeedData, setUsePageSpeedData,
    pageSpeedData, setPageSpeedData
  } = useReportGenerator();
  
  const [isLoadingPageSpeed, setIsLoadingPageSpeed] = useState(false);
  
  const handleFetchPageSpeed = async () => {
    if (!url) {
      toast.error('Introduce una URL válida primero');
      return;
    }
    
    if (!hasGoogleApiKey) {
      toast.error('No hay una API key de Google PageSpeed configurada');
      return;
    }
    
    try {
      setIsLoadingPageSpeed(true);
      const data = await fetchPageSpeedData(url);
      setPageSpeedData(data);
      
      if (data) {
        toast.success('Datos de PageSpeed obtenidos correctamente');
      } else {
        toast.error('No se pudieron obtener datos de PageSpeed');
      }
    } catch (error) {
      console.error('Error fetching PageSpeed data:', error);
      toast.error('Error al obtener datos de PageSpeed');
    } finally {
      setIsLoadingPageSpeed(false);
    }
  };
  
  const handleContinue = () => {
    if (!url) {
      toast.error('Debes proporcionar una URL válida');
      return;
    }
    
    // If user wants PageSpeed data but we don't have it and we have an API key
    if (usePageSpeedData && !pageSpeedData && hasGoogleApiKey) {
      toast.info('Obteniendo datos de PageSpeed antes de continuar...', {
        duration: 2000
      });
      
      handleFetchPageSpeed()
        .then(() => {
          nextStep();
        })
        .catch(() => {
          // Still continue even if PageSpeed fails
          nextStep();
        });
    } else {
      nextStep();
    }
  };

  return (
    <>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">URL del sitio web y velocidad</h2>
          <p className="text-muted-foreground">
            Configura la URL del sitio web y obtén datos de rendimiento
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL del sitio web</Label>
            <Input
              id="url"
              placeholder="https://ejemplo.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Introduce la URL completa incluyendo https://
            </p>
          </div>
          
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-start gap-3">
              <Gauge className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-medium">Datos de PageSpeed</h3>
                <p className="text-sm text-muted-foreground">
                  Obtén métricas de rendimiento del sitio web para incluir en el informe
                </p>
              </div>
            </div>
            
            {!hasGoogleApiKey && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>API Key no configurada</AlertTitle>
                <AlertDescription>
                  No hay una API key de Google PageSpeed configurada. Puedes añadirla en la sección de Configuración.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="use-pagespeed" 
                  checked={usePageSpeedData}
                  onCheckedChange={(checked) => setUsePageSpeedData(checked)}
                  disabled={!hasGoogleApiKey}
                />
                <Label htmlFor="use-pagespeed">
                  Incluir datos de rendimiento en el informe
                </Label>
              </div>
              
              {usePageSpeedData && (
                <Button 
                  variant="outline" 
                  onClick={handleFetchPageSpeed}
                  disabled={!url || !hasGoogleApiKey || isLoadingPageSpeed}
                >
                  {isLoadingPageSpeed ? (
                    <>
                      <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
                      Obteniendo datos...
                    </>
                  ) : pageSpeedData ? (
                    'Actualizar datos de PageSpeed'
                  ) : (
                    'Obtener datos de PageSpeed'
                  )}
                </Button>
              )}
              
              {pageSpeedData && (
                <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-md">
                  <div>
                    <span className="text-muted-foreground">Rendimiento desktop:</span>{' '}
                    <span className="font-medium">{Math.round((pageSpeedData.desktop?.performance || 0) * 100)}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Rendimiento mobile:</span>{' '}
                    <span className="font-medium">{Math.round((pageSpeedData.mobile?.performance || 0) * 100)}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={previousStep}>
          Atrás
        </Button>
        <Button onClick={handleContinue}>
          Continuar
        </Button>
      </CardFooter>
    </>
  );
};

export default UrlAndSpeedStep;
