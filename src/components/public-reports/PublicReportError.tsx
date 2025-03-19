
import React from 'react';
import BlurredCard from '@/components/ui/BlurredCard';
import { AlertCircle } from 'lucide-react';

interface PublicReportErrorProps {
  errorMessage: string | null;
}

const PublicReportError: React.FC<PublicReportErrorProps> = ({ errorMessage }) => {
  return (
    <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <BlurredCard className="w-full max-w-4xl p-8 text-center">
        <div className="flex flex-col items-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-muted-foreground">{errorMessage || 'Informe no encontrado'}</p>
          <p className="mt-4 text-sm text-muted-foreground">
            Si recibiste un enlace a este informe, contacta a la persona que te lo compartió.
          </p>
        </div>
      </BlurredCard>
    </div>
  );
};

export default PublicReportError;
