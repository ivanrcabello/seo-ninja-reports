
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface PublicReportErrorProps {
  errorMessage: string;
}

const PublicReportError: React.FC<PublicReportErrorProps> = ({ errorMessage }) => {
  return (
    <div className="min-h-[50vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-background/90 backdrop-blur-sm rounded-lg shadow-lg border border-red-200 p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-red-600">Error al cargar el informe</h1>
          <p className="text-muted-foreground">{errorMessage}</p>
          <div className="pt-4">
            <a
              href="/"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Volver al inicio
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicReportError;
