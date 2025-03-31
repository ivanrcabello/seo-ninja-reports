
import React, { useEffect, useState } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PublicReportLoadingProps {
  timeout?: number; // Tiempo en milisegundos antes de mostrar mensaje de timeout
  onRetry?: () => void;
}

const PublicReportLoading: React.FC<PublicReportLoadingProps> = ({ 
  timeout = 20000,
  onRetry
}) => {
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);
  const [loadingTime, setLoadingTime] = useState(0);
  
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setLoadingTime(Math.floor(elapsed / 1000));
      
      if (elapsed > timeout) {
        setShowTimeoutMessage(true);
        clearInterval(interval);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timeout]);
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md text-center p-8">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">Cargando informe...</h2>
        <p className="text-muted-foreground">
          Por favor espera mientras obtenemos los datos del informe.
          {loadingTime > 0 && !showTimeoutMessage && (
            <span className="block mt-2 text-sm">
              Tiempo transcurrido: {loadingTime} segundos
            </span>
          )}
        </p>
        
        {showTimeoutMessage && (
          <div className="mt-6 p-4 border border-amber-200 bg-amber-50 text-amber-800 rounded-md">
            <p className="font-medium">La carga está tardando más de lo esperado</p>
            <p className="text-sm mt-2">
              Esto puede deberse a:
            </p>
            <ul className="text-sm mt-1 list-disc list-inside">
              <li>Conexión a internet lenta</li>
              <li>El servidor está ocupado</li>
              <li>El informe es muy extenso</li>
            </ul>
            
            {onRetry ? (
              <Button 
                onClick={onRetry}
                variant="outline" 
                size="sm"
                className="mt-4 bg-white border-amber-300 text-amber-800 hover:bg-amber-100"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reintentar cargar el informe
              </Button>
            ) : (
              <p className="text-sm mt-4">
                Puedes intentar recargar la página o volver más tarde.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicReportLoading;
