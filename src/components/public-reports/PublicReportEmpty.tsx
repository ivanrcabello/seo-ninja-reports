
import React from 'react';
import { FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const PublicReportEmpty: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-gray-800 shadow-md rounded-lg">
        <div className="bg-primary/10 p-5 rounded-full mb-4">
          <FileQuestion className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Informe sin contenido</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Este informe no tiene contenido o está en proceso de generación.
        </p>
        <Button onClick={() => navigate('/')}>
          Volver al inicio
        </Button>
      </div>
    </div>
  );
};

export default PublicReportEmpty;
