
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { CrawlResult } from '@/services/seo-crawler/types';
import { FileBarChart, AlertCircle } from 'lucide-react';
import { CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { useReportGenerator } from '@/context/ReportGeneratorContext';

interface CrawlDataStepProps {
  nextStep: () => void;
  crawlId?: string;
  crawlData?: CrawlResult;
  useCrawlData: boolean;
}

const CrawlDataStep: React.FC<CrawlDataStepProps> = ({
  nextStep,
  crawlId,
  crawlData,
  useCrawlData
}) => {
  const { setUseCrawlData } = useReportGenerator();

  const handleContinue = () => {
    if (crawlId && !crawlData) {
      toast.error('No se pudo cargar la información del análisis SEO');
      return;
    }
    
    nextStep();
  };

  return (
    <>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Información del Análisis SEO</h2>
          <p className="text-muted-foreground">
            Utiliza los datos del análisis SEO técnico para mejorar tu informe
          </p>
        </div>
        
        {crawlId && crawlData ? (
          <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 space-y-4">
            <div className="flex items-start gap-3">
              <FileBarChart className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-medium">Análisis SEO disponible</h3>
                <p className="text-sm text-muted-foreground">
                  Se utilizarán datos de este análisis para enriquecer el informe
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">URL:</span>{' '}
                <span className="font-medium break-all">{crawlData.url}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Páginas analizadas:</span>{' '}
                <span className="font-medium">{crawlData.pages_crawled} de {crawlData.total_pages}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Problemas encontrados:</span>{' '}
                <span className="font-medium">{crawlData.total_issues || 0}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Estado:</span>{' '}
                <span className="font-medium capitalize">{crawlData.status}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Switch 
                id="use-crawl-data" 
                checked={useCrawlData}
                onCheckedChange={(checked) => setUseCrawlData(checked)}
              />
              <Label htmlFor="use-crawl-data">
                Incluir datos del análisis SEO técnico en el informe
              </Label>
            </div>
          </div>
        ) : (
          <div className="bg-muted/50 border rounded-lg p-4 space-y-2">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-muted-foreground mt-1" />
              <div>
                <h3 className="font-medium">No hay análisis SEO disponible</h3>
                <p className="text-sm text-muted-foreground">
                  No se ha seleccionado ningún análisis SEO técnico para este informe.
                  Puedes continuar sin estos datos, pero te recomendamos realizar un
                  análisis técnico para mejorar la calidad del informe.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="ghost" disabled>
          Atrás
        </Button>
        <Button onClick={handleContinue}>
          Continuar
        </Button>
      </CardFooter>
    </>
  );
};

export default CrawlDataStep;
