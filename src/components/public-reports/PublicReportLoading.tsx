
import React from 'react';
import { Loader2 } from 'lucide-react';

const PublicReportLoading: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex flex-col items-center justify-center text-center p-12">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <h2 className="text-xl font-medium mb-2">Cargando informe...</h2>
        <p className="text-muted-foreground">
          El informe está siendo cargado. Por favor, espera un momento.
        </p>
      </div>
    </div>
  );
};

export default PublicReportLoading;
