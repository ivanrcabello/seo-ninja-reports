
import React from 'react';
import { FileX, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PublicReportEmptyProps {
  onBack?: () => void;
  onRetry?: () => void;
}

const PublicReportEmpty: React.FC<PublicReportEmptyProps> = ({ onBack, onRetry }) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md text-center p-8">
        <div className="w-24 h-24 rounded-full bg-gray-100 mx-auto mb-6 flex items-center justify-center">
          <FileX className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Informe no encontrado</h2>
        <p className="text-muted-foreground mb-4">
          El informe que estás buscando no existe o ha sido eliminado.
        </p>
        
        <div className="flex flex-col md:flex-row gap-3 justify-center mb-6">
          {onRetry && (
            <Button 
              onClick={onRetry} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reintentar
            </Button>
          )}
          
          {onBack && (
            <Button 
              onClick={onBack} 
              variant="default" 
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Volver al inicio
            </Button>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground">
          Si crees que esto es un error, contacta con la persona que compartió este enlace contigo.
        </p>
      </div>
    </div>
  );
};

export default PublicReportEmpty;
