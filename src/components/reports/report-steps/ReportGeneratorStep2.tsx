
import React, { useState } from 'react';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2 } from 'lucide-react';
import FileUploader from '../FileUploader';

interface ReportGeneratorStep2Props {
  files: File[];
  setFiles: (files: File[]) => void;
  customPrompt: string;
  setCustomPrompt: (prompt: string) => void;
  hasGoogleApiKey: boolean;
  pageSpeedDataFetched: boolean;
  isLoading: boolean;
  previousStep: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

const ReportGeneratorStep2: React.FC<ReportGeneratorStep2Props> = ({
  files,
  setFiles,
  customPrompt,
  setCustomPrompt,
  hasGoogleApiKey,
  pageSpeedDataFetched,
  isLoading,
  previousStep,
  handleSubmit,
}) => {
  const [showPromptDialog, setShowPromptDialog] = useState(false);
  
  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-6 pt-4">
        <div className="space-y-2">
          <Label>Subir Archivos de Apoyo</Label>
          <FileUploader
            onFilesChange={setFiles}
            maxFiles={5}
            acceptedTypes=".pdf,.doc,.docx,.png,.jpg,.jpeg,.csv,.xlsx,.xls"
          />
          <p className="text-xs text-muted-foreground">
            Sube exportaciones de analytics, informes anteriores, capturas de pantalla u otros documentos para mejorar tu análisis
          </p>
        </div>
        
        {hasGoogleApiKey && pageSpeedDataFetched && (
          <div className="p-4 rounded-lg bg-green-50 border border-green-200">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Datos de rendimiento obtenidos</h3>
                <p className="mt-1 text-xs text-green-700">
                  Se han obtenido datos de Google PageSpeed Insights y se incluirán en el informe final, incluyendo métricas de rendimiento para móvil y escritorio.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {hasGoogleApiKey && !pageSpeedDataFetched && (
          <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800">No se obtuvieron datos de rendimiento</h3>
                <p className="mt-1 text-xs text-amber-700">
                  No se pudieron obtener datos de Google PageSpeed Insights. El informe se generará sin esta información.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <Dialog open={showPromptDialog} onOpenChange={setShowPromptDialog}>
          <DialogTrigger asChild>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full flex justify-between items-center"
            >
              <span>Personalizar prompt de generación</span>
              <Wand2 className="h-4 w-4 ml-2" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl glass">
            <DialogHeader>
              <DialogTitle>Personalizar Prompt de Generación</DialogTitle>
              <DialogDescription>
                Personaliza el prompt que se utilizará para generar el informe SEO con la API de OpenAI.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Introduce el prompt personalizado..."
                className="min-h-[300px]"
              />
              <p className="text-xs text-muted-foreground">
                Utiliza [DOMINIO] para referirte al dominio del sitio web que se está analizando.
              </p>
            </div>
            <DialogFooter>
              <Button 
                onClick={() => setShowPromptDialog(false)}
              >
                Guardar Prompt
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={previousStep}
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

export default ReportGeneratorStep2;
