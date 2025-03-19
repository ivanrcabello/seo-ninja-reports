
import React from 'react';
import BlurredCard from '@/components/ui/BlurredCard';

interface PublicReportErrorProps {
  errorMessage: string | null;
}

const PublicReportError: React.FC<PublicReportErrorProps> = ({ errorMessage }) => {
  return (
    <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <BlurredCard className="w-full max-w-4xl p-8 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
        <p className="text-muted-foreground">{errorMessage || 'Informe no encontrado'}</p>
      </BlurredCard>
    </div>
  );
};

export default PublicReportError;
