
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface PublicReportErrorProps {
  errorMessage: string;
}

const PublicReportError: React.FC<PublicReportErrorProps> = ({ errorMessage }) => {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="bg-destructive/10 text-destructive max-w-md w-full p-6 rounded-lg shadow-md text-center">
        <AlertCircle className="h-12 w-12 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Error al cargar el informe</h2>
        <p>{errorMessage || 'Ha ocurrido un error al intentar cargar el informe.'}</p>
      </div>
    </div>
  );
};

export default PublicReportError;
