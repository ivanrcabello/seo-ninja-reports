
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Loader2, FileText, Globe, ArrowRight, Wand2, AlertCircle } from 'lucide-react';
import FileUploader from './FileUploader';
import BlurredCard from '../ui/BlurredCard';
import useReports from '@/hooks/useReports';
import useClients from '@/hooks/useClients';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ReportGeneratorProps {
  clientId: string;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ clientId }) => {
  const [url, setUrl] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [showPromptDialog, setShowPromptDialog] = useState(false);
  const [customPrompt, setCustomPrompt] = useState(() => {
    return localStorage.getItem('default_seo_prompt') || '';
  });
  const { generateReport } = useReports();
  const { getClient } = useClients();
  const navigate = useNavigate();
  
  const client = getClient(clientId);
  const hasGoogleApiKey = !!localStorage.getItem('google_pagespeed_api_key');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url || files.length === 0) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Generating report for client:', clientId, 'URL:', url);
      const report = await generateReport(clientId, url, files, customPrompt);
      
      console.log('Report generated successfully:', report);
      
      if (report && report.id) {
        toast({
          title: 'Informe creado',
          description: 'Informe creado exitosamente',
        });
        
        // Small delay to ensure the report is fully saved in the database
        setTimeout(() => {
          navigate(`/reports/${report.id}`);
        }, 500);
      } else {
        throw new Error('El informe no tiene un ID válido');
      }
    } catch (error: any) {
      console.error('Error generating report:', error);
      toast({
        title: 'Error',
        description: error.message || 'Error al generar informe',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (url) {
      setStep(2);
    }
  };

  const previousStep = () => {
    setStep(1);
  };

  return (
    <BlurredCard animation="scale" className="w-full max-w-2xl mx-auto">
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold">
            Generar Informe SEO {client ? `para ${client.name}` : ''}
          </CardTitle>
          <CardDescription>
            Introduce los detalles del sitio web y sube archivos de apoyo para generar un informe SEO completo.
          </CardDescription>
        </CardHeader>
        
        {step === 1 ? (
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
                <Alert variant="warning" className="bg-amber-50 border-amber-200">
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
        ) : (
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
              
              {hasGoogleApiKey && (
                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Análisis de rendimiento activado</h3>
                      <p className="mt-1 text-xs text-green-700">
                        Se incluirán datos de Google PageSpeed Insights en el informe final, incluyendo métricas de rendimiento para móvil y escritorio.
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
                disabled={files.length === 0 || isLoading}
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
        )}
      </Card>
    </BlurredCard>
  );
};

export default ReportGenerator;
