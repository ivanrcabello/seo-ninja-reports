
import React from 'react';
import BlurredCard from '@/components/ui/BlurredCard';
import { AlertTriangle } from 'lucide-react';

interface PublicReportErrorProps {
  errorMessage: string;
}

const PublicReportError: React.FC<PublicReportErrorProps> = ({ errorMessage }) => {
  return (
    <div className="container mx-auto py-12">
      <BlurredCard className="max-w-lg mx-auto p-6 bg-red-50/50 dark:bg-red-950/30 backdrop-blur-md border-red-200/50 dark:border-red-800/50">
        <div className="flex flex-col items-center text-center">
          <AlertTriangle size={48} className="text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-red-600 dark:text-red-400">Error al cargar el informe</h2>
          <p className="text-gray-600 dark:text-gray-300">{errorMessage}</p>
        </div>
      </BlurredCard>
    </div>
  );
};

export default PublicReportError;
