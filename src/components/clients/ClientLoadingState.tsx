
import React from 'react';
import { Loader2 } from 'lucide-react';
import AnimatedContainer from '@/components/ui/AnimatedContainer';

const ClientLoadingState: React.FC = () => {
  return (
    <AnimatedContainer animation="fade" className="flex flex-col items-center justify-center py-16">
      <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
      <h3 className="text-lg font-medium text-muted-foreground">Cargando información del cliente...</h3>
    </AnimatedContainer>
  );
};

export default ClientLoadingState;
