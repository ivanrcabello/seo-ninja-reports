
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotFoundStateProps {
  clientId: string;
  error: string | null;
  onBack?: () => void;
}

const NotFoundState: React.FC<NotFoundStateProps> = ({ clientId, error, onBack }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <h2 className="text-xl font-semibold mb-4">Análisis no encontrado</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        {error || "No se encontró el análisis solicitado. Es posible que haya sido eliminado o no exista."}
      </p>
      {onBack && (
        <Button 
          variant="outline" 
          onClick={onBack}
          className="mt-2"
        >
          Volver a la lista de análisis
        </Button>
      )}
    </div>
  );
};

export default NotFoundState;
