
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface PublicReportErrorProps {
  errorMessage: string;
}

const PublicReportError: React.FC<PublicReportErrorProps> = ({ errorMessage }) => {
  const navigate = useNavigate();
  
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-gray-800 shadow-md rounded-lg">
        <div className="bg-destructive/10 p-5 rounded-full mb-4">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Error al cargar el informe</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          {errorMessage || 'No se ha podido cargar el informe. Por favor, inténtalo de nuevo más tarde.'}
        </p>
        <Button onClick={() => navigate('/')}>
          Volver al inicio
        </Button>
      </div>
    </div>
  );
};

export default PublicReportError;
