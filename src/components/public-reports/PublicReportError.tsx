
import React from 'react';
import { XCircle } from 'lucide-react';

interface PublicReportErrorProps {
  errorMessage: string;
}

const PublicReportError: React.FC<PublicReportErrorProps> = ({ errorMessage }) => {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex flex-col items-center justify-center text-center p-12">
        <XCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-medium mb-2">No se pudo cargar el informe</h2>
        <p className="text-muted-foreground mb-6">
          {errorMessage}
        </p>
        <a
          href="/"
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
        >
          Volver al inicio
        </a>
      </div>
    </div>
  );
};

export default PublicReportError;
