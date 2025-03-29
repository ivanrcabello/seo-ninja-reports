
import React from 'react';
import { FileQuestion } from 'lucide-react';

const PublicReportEmpty = () => {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="max-w-md w-full p-6 rounded-lg text-center">
        <FileQuestion className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-bold mb-2">Informe no disponible</h2>
        <p className="text-muted-foreground">
          El informe solicitado no existe o no tiene contenido disponible.
        </p>
      </div>
    </div>
  );
};

export default PublicReportEmpty;
