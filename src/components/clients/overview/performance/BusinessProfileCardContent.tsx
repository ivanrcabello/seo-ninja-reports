
import React from 'react';
import { BusinessProfile } from '@/types/report.types';
import { Star, MapPin, Phone, Link2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getRatingColor } from './PerformanceUtils';

interface BusinessProfileCardContentProps {
  businessProfile: Partial<BusinessProfile> | null;
  isRefreshingBusinessProfile: boolean;
  onRefreshBusinessProfile: () => void;
}

const BusinessProfileCardContent: React.FC<BusinessProfileCardContentProps> = ({
  businessProfile,
  isRefreshingBusinessProfile,
  onRefreshBusinessProfile
}) => {
  const hasBusinessData = Boolean(businessProfile?.businessName);
  const isSimulatedData = businessProfile?.businessName === 'Negocio de ejemplo' || 
                         businessProfile?.businessName?.includes('ejemplo');

  if (!hasBusinessData) {
    return (
      <div className="py-4 text-center">
        <p className="text-sm text-muted-foreground">
          No hay datos de Google Business disponibles
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-3" 
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
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Nombre</span>
        <span className="text-sm truncate max-w-[200px]">{businessProfile?.businessName}</span>
      </div>
      
      {businessProfile?.businessRating !== undefined && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Valoración</span>
          <span className={cn("flex items-center", getRatingColor(businessProfile.businessRating))}>
            {businessProfile.businessRating.toFixed(1)}
            <Star className="h-3.5 w-3.5 ml-1 fill-current" />
            <span className="text-xs text-muted-foreground ml-1">
              ({businessProfile.businessReviewsCount || 0})
            </span>
          </span>
        </div>
      )}
      
      {businessProfile?.businessCategory && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Categoría</span>
          <span className="text-sm truncate max-w-[200px]">{businessProfile.businessCategory}</span>
        </div>
      )}
      
      {businessProfile?.businessAddress && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium flex items-center">
            <MapPin className="h-3 w-3 mr-1 text-muted-foreground" /> 
            Dirección
          </span>
          <span className="text-sm truncate max-w-[200px]">{businessProfile.businessAddress}</span>
        </div>
      )}
      
      {businessProfile?.businessPhone && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium flex items-center">
            <Phone className="h-3 w-3 mr-1 text-muted-foreground" /> 
            Teléfono
          </span>
          <span className="text-sm">{businessProfile.businessPhone}</span>
        </div>
      )}
      
      {businessProfile?.businessWebsite && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium flex items-center">
            <Link2 className="h-3 w-3 mr-1 text-muted-foreground" /> 
            Web
          </span>
          <a 
            href={businessProfile.businessWebsite} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm text-primary hover:underline truncate max-w-[200px]"
          >
            {businessProfile.businessWebsite.replace(/^https?:\/\//, '')}
          </a>
        </div>
      )}
      
      {isSimulatedData && (
        <div className="mt-2 py-2 px-3 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-xs text-amber-700">
            Se muestran datos simulados. Usa el botón de actualizar para obtener datos reales.
          </p>
        </div>
      )}
    </div>
  );
};

export default BusinessProfileCardContent;
