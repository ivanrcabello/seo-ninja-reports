
import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PublicReportErrorProps {
  errorMessage?: string;
  onRetry?: () => void;
  onHome?: () => void;
  retryCount?: number;
}

const PublicReportError: React.FC<PublicReportErrorProps> = ({ 
  errorMessage,
  onRetry,
  onHome,
  retryCount = 0
}) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md text-center p-8">
        <div className="w-24 h-24 rounded-full bg-red-100 mx-auto mb-6 flex items-center justify-center">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Error al cargar el informe</h2>
        {errorMessage ? (
          <p className="text-muted-foreground mb-4">{errorMessage}</p>
        ) : (
          <p className="text-muted-foreground mb-4">
            Se produjo un error al cargar el informe. Por favor, inténtalo de nuevo más tarde.
          </p>
        )}
        
        <div className="flex flex-col md:flex-row gap-3 justify-center mb-6">
          {onRetry && (
            <Button 
              onClick={onRetry} 
              variant="outline" 
              className="flex items-center gap-2"
              disabled={retryCount >= 3}
            >
              <RefreshCw className="h-4 w-4" />
              {retryCount >= 3 ? 'Demasiados intentos' : 'Reintentar'}
            </Button>
          )}
          
          {onHome && (
            <Button 
              onClick={onHome}
              variant="default"
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Volver al inicio
            </Button>
          )}
        </div>
        
        {retryCount > 0 && (
          <p className="text-xs text-muted-foreground">
            Intentos: {retryCount}/3
          </p>
        )}
        
        <p className="text-sm text-muted-foreground mt-4">
          Si el problema persiste, contacta con la persona que compartió este enlace contigo.
        </p>
      </div>
    </div>
  );
};

export default PublicReportError;
