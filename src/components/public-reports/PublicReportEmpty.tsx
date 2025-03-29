
import React from 'react';
import { FileX } from 'lucide-react';

const PublicReportEmpty: React.FC = () => {
  return (
    <div className="min-h-[50vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-background/90 backdrop-blur-sm rounded-lg shadow-lg border border-muted p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
            <FileX className="h-6 w-6 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Informe vacío</h1>
          <p className="text-muted-foreground">
            Este informe no contiene datos. Por favor, contacta con el administrador para obtener más información.
          </p>
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

export default PublicReportEmpty;
