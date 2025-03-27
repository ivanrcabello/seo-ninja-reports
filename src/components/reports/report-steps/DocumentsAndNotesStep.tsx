
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CardContent, CardFooter } from '@/components/ui/card';
import { FileUp, X, FileText } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useReportGenerator } from '@/context/ReportGeneratorContext';

interface DocumentsAndNotesStepProps {
  nextStep: () => void;
  previousStep: () => void;
}

const DocumentsAndNotesStep: React.FC<DocumentsAndNotesStepProps> = ({
  nextStep,
  previousStep
}) => {
  const { 
    files, setFiles,
    notes, setNotes,
    customPrompt, setCustomPrompt,
  } = useReportGenerator();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
    }
  };
  
  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };
  
  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Documentos y notas</h2>
          <p className="text-muted-foreground">
            Sube documentos relevantes y añade notas o instrucciones específicas
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Documentos adicionales</Label>
            <div className="border-2 border-dashed rounded-lg p-6 hover:bg-muted/30 transition-colors cursor-pointer text-center" onClick={() => fileInputRef.current?.click()}>
              <input
                type="file"
                ref={fileInputRef}
                multiple
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls"
              />
              <FileUp className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm font-medium">Arrastra y suelta archivos o haz clic aquí</p>
              <p className="text-xs text-muted-foreground mt-1">
                PDF, DOCX, XLSX, CSV, TXT (máx 10MB)
              </p>
            </div>
            
            {files.length > 0 && (
              <div className="border rounded-md p-2 mt-4">
                <ScrollArea className="h-[150px] w-full">
                  <div className="space-y-2 p-2">
                    {files.map((file, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-2 bg-muted/30 rounded"
                      >
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium truncate max-w-[200px]">
                              {file.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveFile(index)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notas o contexto adicional</Label>
            <Textarea
              id="notes"
              placeholder="Añade cualquier nota o contexto que pueda ser útil para generar el informe..."
              rows={5}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Estas notas se utilizarán para proporcionar contexto adicional y mejorar el informe.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="custom-prompt">Personalización del informe (opcional)</Label>
            <Textarea
              id="custom-prompt"
              placeholder="Instrucciones específicas para personalizar el informe..."
              rows={3}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Personaliza las instrucciones para la generación del informe (opcional).
            </p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={previousStep}>
          Atrás
        </Button>
        <Button onClick={nextStep}>
          Continuar
        </Button>
      </CardFooter>
    </>
  );
};

export default DocumentsAndNotesStep;
