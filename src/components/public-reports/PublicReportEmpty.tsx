
import React from 'react';
import { FileQuestion } from 'lucide-react';

const PublicReportEmpty: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex flex-col items-center justify-center text-center p-12">
        <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-medium mb-2">Informe vacío</h2>
        <p className="text-muted-foreground">
          Este informe no tiene contenido o está en proceso de creación.
        </p>
      </div>
    </div>
  );
};

export default PublicReportEmpty;
