
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUp, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { parseSemrushPdf, createSeoReport } from '@/services/seoReportService';

interface UploadPDFProps {
  clientId: string;
  onUploadSuccess: () => void;
}

const UploadPDF: React.FC<UploadPDFProps> = ({ clientId, onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
        toast.error('Formato no válido', {
          description: 'Por favor, sube un archivo PDF'
        });
        return;
      }
      console.log('File selected:', file.name);
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Ningún archivo seleccionado', {
        description: 'Por favor, selecciona un archivo PDF para subir'
      });
      return;
    }

    setIsUploading(true);
    try {
      console.log('Processing PDF file:', selectedFile.name);
      toast.info('Procesando informe', {
        description: 'Extrayendo datos del PDF...'
      });
      
      // Parse the PDF
      const parsedData = await parseSemrushPdf(selectedFile);
      
      if (!parsedData) {
        toast.error('Error al procesar el informe', {
          description: 'No se pudieron extraer datos del PDF'
        });
        return;
      }

      console.log('Parsed data:', parsedData);
      toast.info('Guardando informe', {
        description: `Creando informe para ${parsedData.domain}...`
      });

      // Create a new SEO report
      const result = await createSeoReport(clientId, parsedData);
      
      if (result) {
        console.log('SEO report created successfully:', result);
        toast.success('Informe guardado correctamente', {
          description: `Se ha creado un nuevo informe para ${parsedData.domain}`
        });
        setSelectedFile(null);
        onUploadSuccess();
      } else {
        toast.error('Error al guardar informe', {
          description: 'No se pudo guardar el informe en la base de datos'
        });
      }
    } catch (error) {
      console.error('Error uploading/processing PDF:', error);
      toast.error('Error al procesar el PDF', {
        description: 'Ocurrió un error al procesar el archivo'
      });
    } finally {
      setIsUploading(false);
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
              accept="application/pdf"
              onChange={handleFileChange}
            />
            <label
              htmlFor="pdf-upload"
              className="cursor-pointer flex flex-col items-center justify-center gap-2"
            >
              <FileUp className="h-10 w-10 text-muted-foreground" />
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
            {isUploading ? 'Procesando...' : 'Subir y Procesar PDF'}
            <Upload className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadPDF;
