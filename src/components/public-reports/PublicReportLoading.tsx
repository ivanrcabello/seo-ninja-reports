
import React from 'react';

const PublicReportLoading: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <h2 className="text-xl font-medium">Cargando informe...</h2>
        <p className="text-muted-foreground text-center">
          Por favor espera mientras cargamos la información del informe.
        </p>
      </div>
    </div>
  );
};

export default PublicReportLoading;
