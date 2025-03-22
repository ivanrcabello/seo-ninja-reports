
import React from 'react';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, AlertCircle, FileText, Globe, Building2, KeyRound, BarChart } from 'lucide-react';
import { SeoReport } from '@/types/seo-reporting.types';

interface ReportGeneratorStep5Props {
  url: string;
  usePageSpeedData: boolean;
  useGmbData: boolean;
  useKeywordsData: boolean;
  selectedSeoReport: SeoReport | null;
  filesCount: number;
  isLoading: boolean;
  previousStep: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

const ReportGeneratorStep5: React.FC<ReportGeneratorStep5Props> = ({
  url,
  usePageSpeedData,
  useGmbData,
  useKeywordsData,
  selectedSeoReport,
  filesCount,
  isLoading,
  previousStep,
  handleSubmit,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6 flex items-center justify-center">
        <div className="flex items-center justify-center space-x-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            1
          </div>
          <div className="h-0.5 w-10 bg-primary"></div>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            2
          </div>
          <div className="h-0.5 w-10 bg-primary"></div>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            3
          </div>
          <div className="h-0.5 w-10 bg-primary"></div>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            4
          </div>
          <div className="h-0.5 w-10 bg-primary"></div>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            5
          </div>
        </div>
      </div>
      
      <CardContent className="space-y-6 pt-4">
        <div>
          <h3 className="text-xl font-medium mb-4">Resumen de datos para el informe</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Revisa la información que se utilizará para generar el informe SEO
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-secondary/20 rounded-md">
              <Globe className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">URL del sitio web</h4>
                <p className="text-sm">{url}</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-3">
              <div className={`flex items-start gap-3 p-3 rounded-md ${usePageSpeedData ? 'bg-green-50' : 'bg-muted'}`}>
                <BarChart className={`h-5 w-5 ${usePageSpeedData ? 'text-green-600' : 'text-muted-foreground'} mt-0.5`} />
                <div>
                  <div className="flex items-center">
                    <h4 className="font-medium">Datos de PageSpeed</h4>
                    {usePageSpeedData ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600 ml-2" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-muted-foreground ml-2" />
                    )}
                  </div>
                  <p className="text-xs">
                    {usePageSpeedData 
                      ? 'Se incluirán datos de rendimiento web' 
                      : 'No se incluirán datos de rendimiento'}
                  </p>
                </div>
              </div>
              
              <div className={`flex items-start gap-3 p-3 rounded-md ${useGmbData ? 'bg-green-50' : 'bg-muted'}`}>
                <Building2 className={`h-5 w-5 ${useGmbData ? 'text-green-600' : 'text-muted-foreground'} mt-0.5`} />
                <div>
                  <div className="flex items-center">
                    <h4 className="font-medium">Datos de GMB</h4>
                    {useGmbData ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600 ml-2" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-muted-foreground ml-2" />
                    )}
                  </div>
                  <p className="text-xs">
                    {useGmbData 
                      ? 'Se incluirá análisis de perfil de negocio' 
                      : 'No se incluirá análisis de perfil de negocio'}
                  </p>
                </div>
              </div>
              
              <div className={`flex items-start gap-3 p-3 rounded-md ${useKeywordsData ? 'bg-green-50' : 'bg-muted'}`}>
                <KeyRound className={`h-5 w-5 ${useKeywordsData ? 'text-green-600' : 'text-muted-foreground'} mt-0.5`} />
                <div>
                  <div className="flex items-center">
                    <h4 className="font-medium">Palabras clave</h4>
                    {useKeywordsData ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600 ml-2" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-muted-foreground ml-2" />
                    )}
                  </div>
                  <p className="text-xs">
                    {useKeywordsData 
                      ? 'Se incluirá análisis de palabras clave' 
                      : 'No se incluirá análisis de palabras clave'}
                  </p>
                </div>
              </div>
              
              <div className={`flex items-start gap-3 p-3 rounded-md ${selectedSeoReport ? 'bg-green-50' : 'bg-muted'}`}>
                <BarChart className={`h-5 w-5 ${selectedSeoReport ? 'text-green-600' : 'text-muted-foreground'} mt-0.5`} />
                <div>
                  <div className="flex items-center">
                    <h4 className="font-medium">Informe SEO</h4>
                    {selectedSeoReport ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600 ml-2" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-muted-foreground ml-2" />
                    )}
                  </div>
                  <p className="text-xs">
                    {selectedSeoReport 
                      ? `Se incluirán datos del informe: ${selectedSeoReport.domain}` 
                      : 'No se incluirán datos de informes SEO existentes'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className={`flex items-start gap-3 p-3 rounded-md ${filesCount > 0 ? 'bg-green-50' : 'bg-muted'}`}>
              <FileText className={`h-5 w-5 ${filesCount > 0 ? 'text-green-600' : 'text-muted-foreground'} mt-0.5`} />
              <div>
                <div className="flex items-center">
                  <h4 className="font-medium">Archivos adjuntos</h4>
                  {filesCount > 0 ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600 ml-2" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-muted-foreground ml-2" />
                  )}
                </div>
                <p className="text-xs">
                  {filesCount > 0 
                    ? `Se incluirán ${filesCount} archivos adjuntos` 
                    : 'No se incluirán archivos adjuntos'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
          <p className="text-sm">
            El sistema generará un informe completo utilizando los datos seleccionados. 
            Este proceso puede tardar unos minutos dependiendo de la cantidad de datos a procesar.
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={previousStep}
          disabled={isLoading}
        >
          Atrás
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generando...
            </>
          ) : (
            'Generar Informe'
          )}
        </Button>
      </CardFooter>
    </form>
  );
};

export default ReportGeneratorStep5;
