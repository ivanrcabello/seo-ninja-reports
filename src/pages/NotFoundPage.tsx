
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Página no encontrada</h2>
      <p className="text-muted-foreground mb-6 text-center max-w-md">
        Lo sentimos, no pudimos encontrar la página o el recurso que estás buscando.
      </p>
      <Button onClick={() => navigate(-1)}>Volver atrás</Button>
    </div>
  );
};

export default NotFoundPage;
