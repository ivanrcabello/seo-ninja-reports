
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BlurredCard from '@/components/ui/BlurredCard';
import { CardContent } from '@/components/ui/card';

interface NotFoundStateProps {
  clientId: string;
}

const NotFoundState: React.FC<NotFoundStateProps> = ({ clientId }) => {
  const navigate = useNavigate();
  
  return (
    <BlurredCard>
      <CardContent className="p-12 text-center">
        <h2 className="text-xl font-bold mb-4">Análisis no encontrado</h2>
        <p className="text-muted-foreground mb-6">
          No se pudo encontrar el análisis SEO solicitado.
        </p>
        <Button onClick={() => navigate(`/clients/${clientId}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al cliente
        </Button>
      </CardContent>
    </BlurredCard>
  );
};

export default NotFoundState;
