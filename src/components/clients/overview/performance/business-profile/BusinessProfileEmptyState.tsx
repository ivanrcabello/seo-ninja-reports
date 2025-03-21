
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface BusinessProfileEmptyStateProps {
  onRefreshBusinessProfile: () => void;
  isRefreshingBusinessProfile: boolean;
}

const BusinessProfileEmptyState: React.FC<BusinessProfileEmptyStateProps> = ({
  onRefreshBusinessProfile,
  isRefreshingBusinessProfile
}) => {
  return (
    <div className="py-4 text-center">
      <p className="text-sm text-muted-foreground mb-4">
        No hay datos de perfil de negocio disponibles
      </p>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onRefreshBusinessProfile}
        disabled={isRefreshingBusinessProfile}
      >
        {isRefreshingBusinessProfile ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Analizando...
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            Obtener datos GMB
          </>
        )}
      </Button>
    </div>
  );
};

export default BusinessProfileEmptyState;
