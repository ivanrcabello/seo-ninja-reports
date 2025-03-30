
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface PublicReportErrorProps {
  errorMessage?: string;
}

const PublicReportError: React.FC<PublicReportErrorProps> = ({ errorMessage }) => {
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
        <p className="text-sm text-muted-foreground">
          Si el problema persiste, contacta con la persona que compartió este enlace contigo.
        </p>
      </div>
    </div>
  );
};

export default PublicReportError;
