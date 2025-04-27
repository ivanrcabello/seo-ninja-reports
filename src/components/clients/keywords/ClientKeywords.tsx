
import React from 'react';

interface ClientKeywordsProps {
  clientId: string;
  reports?: any[]; // Make reports optional
}

const ClientKeywords: React.FC<ClientKeywordsProps> = ({ clientId, reports = [] }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Palabras Clave</h2>
      </div>
      
      <div className="bg-muted/50 rounded-lg p-6 text-center">
        <p className="text-muted-foreground mb-4">
          La función de seguimiento de palabras clave está en desarrollo.
        </p>
        <p className="text-sm text-muted-foreground">
          Pronto podrás añadir y realizar seguimiento de palabras clave relevantes para este cliente.
        </p>
      </div>
    </div>
  );
};

export default ClientKeywords;
