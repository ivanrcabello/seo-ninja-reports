
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface BusinessProfileActionsProps {
  onRefreshBusinessProfile: () => void;
  isRefreshingBusinessProfile: boolean;
  saveBusinessProfileData: () => void;
}

const BusinessProfileActions: React.FC<BusinessProfileActionsProps> = ({
  onRefreshBusinessProfile,
  isRefreshingBusinessProfile,
  saveBusinessProfileData
}) => {
  return (
    <div className="flex gap-2 mt-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full" 
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
            Actualizar
          </>
        )}
      </Button>
      <Button 
        variant="default" 
        size="sm" 
        className="w-full"
        onClick={saveBusinessProfileData}
        disabled={isRefreshingBusinessProfile}
      >
        Guardar para informe
      </Button>
    </div>
  );
};

export default BusinessProfileActions;
