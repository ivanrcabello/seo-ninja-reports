
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FileUp, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { uploadSeoReport, parsePdf } from '@/services/seoReport';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface UploadPDFProps {
  clientId: string;
  onUploadSuccess: () => void;
}

const UploadPDF: React.FC<UploadPDFProps> = ({ clientId, onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError(null);
    
    if (!selectedFile) {
      setFile(null);
      return;
    }
    
    if (selectedFile.type !== 'application/pdf') {
      setError('Por favor, selecciona un archivo PDF');
      setFile(null);
      return;
    }
    
    setFile(selectedFile);
  };
  
  const handleUpload = async () => {
    if (!file) {
      setError('Por favor, selecciona un archivo PDF');
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    try {
      // First parse the PDF to extract data
      const parsedData = await parsePdf(file);
      
      if (!parsedData) {
        throw new Error('No se pudieron extraer datos del PDF');
      }
      
      // Then upload the extracted data
      const result = await uploadSeoReport(clientId, parsedData);
      console.log('Upload result:', result);
      toast.success('Informe SEO subido correctamente');
      setFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('pdf-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      
      onUploadSuccess();
    } catch (err: any) {
      console.error('Error uploading PDF:', err);
      setError(err.message || 'Error al subir el informe SEO');
      toast.error('Error al subir el informe SEO');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border">
      <div>
        <h3 className="text-lg font-medium">Subir Informe SEO</h3>
        <p className="text-sm text-muted-foreground">
          Sube un informe de SEMrush en formato PDF para analizarlo automáticamente
        </p>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="pdf-upload">Archivo PDF</Label>
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <input
              id="pdf-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="border border-input bg-background rounded-md px-3 py-2 text-sm w-full file:border-0 file:bg-transparent file:text-sm file:font-medium"
            />
            <p className="text-xs text-muted-foreground mt-1">Tamaño máximo: 10MB</p>
          </div>
          <Button
            onClick={handleUpload}
            disabled={!file || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Subiendo...
              </>
            ) : (
              <>
                <FileUp className="mr-2 h-4 w-4" />
                Subir
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className="text-sm">
        <p className="font-medium">Información extraída automáticamente:</p>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-2 mt-1">
          <li>Dominio, tráfico, palabras clave, backlinks</li>
          <li>Las 20 palabras clave principales con posiciones</li>
          <li>Competidores principales</li>
          <li>Distribución de rankings</li>
          <li>Tipos de backlinks y métricas de enlaces</li>
        </ul>
      </div>
    </div>
  );
};

export default UploadPDF;
