
import React from 'react';
import BlurredCard from '@/components/ui/BlurredCard';

const PublicReportEmpty: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <BlurredCard className="w-full max-w-4xl p-8 text-center">
        <h3 className="text-xl font-medium mb-2">No hay contenido disponible</h3>
        <p className="text-muted-foreground">Este informe aún no tiene contenido.</p>
      </BlurredCard>
    </div>
  );
};

export default PublicReportEmpty;
