
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Página no encontrada</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Lo sentimos, la página que buscas no existe o ha sido movida.
      </p>
      <Button asChild>
        <Link to="/">Volver al inicio</Link>
      </Button>
    </div>
  );
};

export default NotFoundPage;
