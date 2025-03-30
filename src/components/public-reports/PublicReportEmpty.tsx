
import React from 'react';
import { FileX } from 'lucide-react';

const PublicReportEmpty: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md text-center p-8">
        <div className="w-24 h-24 rounded-full bg-gray-100 mx-auto mb-6 flex items-center justify-center">
          <FileX className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Informe no encontrado</h2>
        <p className="text-muted-foreground mb-4">
          El informe que estás buscando no existe o ha sido eliminado.
        </p>
        <p className="text-sm text-muted-foreground">
          Si crees que esto es un error, contacta con la persona que compartió este enlace contigo.
        </p>
      </div>
    </div>
  );
};

export default PublicReportEmpty;
