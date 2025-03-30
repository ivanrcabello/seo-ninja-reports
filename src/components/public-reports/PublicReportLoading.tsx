
import React from 'react';
import { Loader2 } from 'lucide-react';

const PublicReportLoading: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md text-center p-8">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">Cargando informe...</h2>
        <p className="text-muted-foreground">
          Por favor espera mientras obtenemos los datos del informe.
        </p>
      </div>
    </div>
  );
};

export default PublicReportLoading;
