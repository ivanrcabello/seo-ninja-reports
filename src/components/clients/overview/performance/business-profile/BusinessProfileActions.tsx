
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Save } from 'lucide-react';

interface BusinessProfileActionsProps {
  onRefreshBusinessProfile: () => void;
  isRefreshingBusinessProfile: boolean;
  saveBusinessProfileData: () => void;
  isSaving?: boolean;
}

const BusinessProfileActions: React.FC<BusinessProfileActionsProps> = ({
  onRefreshBusinessProfile,
  isRefreshingBusinessProfile,
  saveBusinessProfileData,
  isSaving = false
}) => {
  return (
    <div className="flex gap-2 justify-end mt-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onRefreshBusinessProfile}
        disabled={isRefreshingBusinessProfile}
      >
        {isRefreshingBusinessProfile ? (
          <>
            <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
            Actualizando...
          </>
        ) : (
          <>
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Actualizar datos
          </>
        )}
      </Button>
      <Button 
        size="sm" 
        onClick={saveBusinessProfileData}
        disabled={isSaving}
      >
        {isSaving ? (
          <>
            <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
            Guardando...
          </>
        ) : (
          <>
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Guardar perfil
          </>
        )}
      </Button>
    </div>
  );
};

export default BusinessProfileActions;
