
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUp, Upload, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { parseSemrushPdf, createSeoReport } from '@/services/seoReportService';

interface UploadPDFProps {
  clientId: string;
  onUploadSuccess: () => void;
}

const UploadPDF: React.FC<UploadPDFProps> = ({ clientId, onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [processingProgress, setProcessingProgress] = useState<number>(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      console.log('File selected:', file.name, 'Size:', (file.size / 1024).toFixed(2), 'KB, Type:', file.type);
      
      if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
        console.error('Invalid file format:', file.type);
        toast.error('Formato no válido', {
          description: 'Por favor, sube un archivo PDF'
        });
        return;
      }
      
      setSelectedFile(file);
      toast.info('Archivo seleccionado', {
        description: `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`
      });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Ningún archivo seleccionado', {
        description: 'Por favor, selecciona un archivo PDF para subir'
      });
      return;
    }

    if (!clientId) {
      console.error('No client ID provided');
      toast.error('Error de configuración', {
        description: 'ID de cliente no especificado'
      });
      return;
    }

    setIsUploading(true);
    setProcessingProgress(10);
    console.log('Starting PDF upload and processing for client:', clientId);
    
    try {
      setProcessingStatus('Leyendo archivo PDF...');
      console.log('Processing PDF file:', selectedFile.name);
      toast.info('Procesando informe', {
        description: 'Extrayendo datos del PDF...'
      });
      
      setProcessingProgress(30);
      // Parse the PDF
      const parsedData = await parseSemrushPdf(selectedFile);
      setProcessingProgress(60);
      
      if (!parsedData) {
        console.error('Failed to parse PDF, no data returned');
        toast.error('Error al procesar el informe', {
          description: 'No se pudieron extraer datos del PDF'
        });
        setIsUploading(false);
        setProcessingStatus('');
        setProcessingProgress(0);
        return;
      }

      setProcessingStatus(`Datos extraídos para: ${parsedData.domain}. Guardando informe...`);
      console.log('Parsed data successfully:', parsedData);
      toast.info('Guardando informe', {
        description: `Creando informe para ${parsedData.domain}...`
      });
      
      setProcessingProgress(80);
      // Create a new SEO report
      const result = await createSeoReport(clientId, parsedData);
      setProcessingProgress(100);
      
      if (result) {
        console.log('SEO report created successfully:', result);
        toast.success('Informe guardado correctamente', {
          description: `Se ha creado un nuevo informe para ${parsedData.domain}`
        });
        setSelectedFile(null);
        setProcessingStatus('');
        onUploadSuccess();
      } else {
        console.error('Failed to create SEO report, no result returned');
        toast.error('Error al guardar informe', {
          description: 'No se pudo guardar el informe en la base de datos'
        });
        setProcessingStatus('Error al guardar el informe');
      }
    } catch (error) {
      console.error('Error uploading/processing PDF:', error);
      toast.error('Error al procesar el PDF', {
        description: 'Ocurrió un error al procesar el archivo'
      });
      setProcessingStatus('Error en el procesamiento');
    } finally {
      setIsUploading(false);
      setProcessingProgress(0);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Subir Informe Semrush</CardTitle>
        <CardDescription>
          Sube un PDF de Semrush para analizar los datos SEO de este cliente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-primary/50 transition-colors">
            <input
              type="file"
              id="pdf-upload"
              className="hidden"
              accept="application/pdf,.pdf"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <label
              htmlFor="pdf-upload"
              className={`cursor-pointer flex flex-col items-center justify-center gap-2 ${isUploading ? 'opacity-50' : ''}`}
            >
              {selectedFile ? (
                <FileText className="h-10 w-10 text-primary" />
              ) : (
                <FileUp className="h-10 w-10 text-muted-foreground" />
              )}
              <div className="text-sm text-muted-foreground">
                {selectedFile ? selectedFile.name : 'Haz clic para seleccionar un PDF de Semrush'}
              </div>
              {selectedFile && (
                <div className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </div>
              )}
            </label>
          </div>
          
          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                Subir y Procesar PDF
                <Upload className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          
          {processingStatus && (
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center justify-between mb-1">
                <span>Estado: {processingStatus}</span>
                {isUploading && <span>{processingProgress}%</span>}
              </div>
              {isUploading && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div 
                    className="bg-primary h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${processingProgress}%` }}
                  ></div>
                </div>
              )}
            </div>
          )}
          
          <div className="text-xs text-muted-foreground mt-2">
            ID de Cliente: {clientId}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadPDF;
