
import React from 'react';
import { Gauge } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="text-center p-8">
      <Gauge className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-xl font-medium mb-2">No hay datos de PageSpeed disponibles</h3>
      <p className="text-muted-foreground">
        No se han encontrado datos de rendimiento para este informe.
      </p>
    </div>
  );
};

export default EmptyState;
