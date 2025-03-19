
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Globe, FileText, ArrowRight, AlertCircle } from 'lucide-react';

interface ReportGeneratorStep1Props {
  url: string;
  setUrl: (url: string) => void;
  hasGoogleApiKey: boolean;
  nextStep: () => void;
}

const ReportGeneratorStep1: React.FC<ReportGeneratorStep1Props> = ({
  url,
  setUrl,
  hasGoogleApiKey,
  nextStep,
}) => {
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
              <h3 className="text-sm font-medium">Subir Archivos de Apoyo</h3>
              <p className="text-xs text-muted-foreground mt-1">
                En el siguiente paso, podrás subir archivos como exportaciones de analytics, informes anteriores, 
                capturas de pantalla y otros documentos para mejorar tu análisis SEO.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end pt-4">
        <Button
          onClick={nextStep}
          disabled={!url}
          className="group"
        >
          Continuar
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </CardFooter>
    </>
  );
};

export default ReportGeneratorStep1;
