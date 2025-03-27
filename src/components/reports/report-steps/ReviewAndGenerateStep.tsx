
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { 
  FileBarChart, Map, Search, Gauge, 
  FileText, Check, AlertCircle, Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useReportGenerator } from '@/context/ReportGeneratorContext';

interface ReviewAndGenerateStepProps {
  previousStep: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
}

const ReviewAndGenerateStep: React.FC<ReviewAndGenerateStepProps> = ({
  previousStep,
  handleSubmit,
  isLoading
}) => {
  const { 
    url,
    crawlData,
    useCrawlData,
    pageSpeedData,
    usePageSpeedData,
    businessProfile,
    useGmbData,
    keywords,
    useKeywordsData,
    files,
    notes
  } = useReportGenerator();

  return (
    <>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Revisar y generar</h2>
          <p className="text-muted-foreground">
            Revisa toda la información antes de generar el informe
          </p>
        </div>
        
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="font-medium">Resumen del informe</h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span>URL del sitio web:</span>
              </div>
              <span className="font-medium">{url}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileBarChart className="h-4 w-4 text-primary" />
                <span>Datos de análisis SEO técnico:</span>
              </div>
              {useCrawlData && crawlData ? (
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  <Check className="h-3 w-3 mr-1" /> Incluido
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-gray-100 text-gray-800">
                  No incluido
                </Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-primary" />
                <span>Datos de rendimiento (PageSpeed):</span>
              </div>
              {usePageSpeedData && pageSpeedData ? (
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  <Check className="h-3 w-3 mr-1" /> Incluido
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-gray-100 text-gray-800">
                  No incluido
                </Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Map className="h-4 w-4 text-primary" />
                <span>Perfil de Google My Business:</span>
              </div>
              {useGmbData && businessProfile ? (
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  <Check className="h-3 w-3 mr-1" /> Incluido
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-gray-100 text-gray-800">
                  No incluido
                </Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-primary" />
                <span>Palabras clave:</span>
              </div>
              {useKeywordsData && keywords.length > 0 ? (
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  <Check className="h-3 w-3 mr-1" /> {keywords.length} palabras clave
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-gray-100 text-gray-800">
                  No incluidas
                </Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span>Documentos adjuntos:</span>
              </div>
              {files.length > 0 ? (
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  <Check className="h-3 w-3 mr-1" /> {files.length} documentos
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-gray-100 text-gray-800">
                  No incluidos
                </Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span>Notas adicionales:</span>
              </div>
              {notes ? (
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  <Check className="h-3 w-3 mr-1" /> Incluidas
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-gray-100 text-gray-800">
                  No incluidas
                </Badge>
              )}
            </div>
          </div>
          
          {(!url || (usePageSpeedData && !pageSpeedData)) && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800">¡Atención!</h4>
                  <ul className="text-sm text-amber-700 mt-1 list-disc pl-5 space-y-1">
                    {!url && (
                      <li>No has proporcionado una URL válida para el sitio web.</li>
                    )}
                    {usePageSpeedData && !pageSpeedData && (
                      <li>Has seleccionado incluir datos de PageSpeed pero no los has obtenido.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={previousStep}>
          Atrás
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={!url || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generando informe...
            </>
          ) : (
            'Generar informe'
          )}
        </Button>
      </CardFooter>
    </>
  );
};

export default ReviewAndGenerateStep;
