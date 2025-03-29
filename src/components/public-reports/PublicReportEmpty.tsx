
import React from 'react';
import BlurredCard from '@/components/ui/BlurredCard';
import { FileX } from 'lucide-react';

const PublicReportEmpty: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <BlurredCard className="w-full max-w-4xl p-8 text-center">
        <div className="flex flex-col items-center">
          <FileX className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No hay contenido disponible</h3>
          <p className="text-muted-foreground">Este informe aún no tiene contenido o está en proceso de generación.</p>
          <p className="mt-4 text-sm text-muted-foreground">
            Si recibiste un enlace a este informe, contacta a la persona que te lo compartió.
          </p>
        </div>
      </BlurredCard>
    </div>
  );
};

export default PublicReportEmpty;
