import React, { useState, useEffect } from 'react';
import { BusinessProfile } from '@/types/report.types';
import { Button } from '@/components/ui/button';
import { RefreshCw, Star, MapPin, Phone, Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { saveBusinessProfile } from '@/services/api/businessProfile/saveBusinessProfile';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface BusinessProfileCardContentProps {
  businessProfile: Partial<BusinessProfile> | null;
  isRefreshingBusinessProfile: boolean;
  onRefreshBusinessProfile: () => void;
  clientName?: string;
  clientLocation?: string;
  clientId?: string;
}

const BusinessProfileCardContent: React.FC<BusinessProfileCardContentProps> = ({
  businessProfile,
  isRefreshingBusinessProfile,
  onRefreshBusinessProfile,
  clientName,
  clientLocation,
  clientId
}) => {
  const [displayProfile, setDisplayProfile] = useState<Partial<BusinessProfile> | null>(null);
  
  useEffect(() => {
    if (businessProfile) {
      setDisplayProfile(businessProfile);
      console.log("Perfil de negocio actualizado en BusinessProfileCardContent:", businessProfile);
    }
  }, [businessProfile]);
  
  const hasData = Boolean(displayProfile?.businessName);
  const isSimulated = displayProfile?.businessName === 'Negocio de ejemplo' || 
                     displayProfile?.businessName?.includes('ejemplo');

  const saveBusinessProfileData = async () => {
    if (!clientId || !displayProfile) {
      console.error("Cannot save business profile: missing clientId or profile data");
      return;
    }

    try {
      const { data: reports, error: reportsError } = await supabase
        .from('reports')
        .select('id')
        .eq('client_id', clientId)
        .order('date', { ascending: false })
        .limit(1);

      if (reportsError) {
        console.error('Error fetching latest report:', reportsError);
        return;
      }

      if (reports && reports.length > 0) {
        const latestReportId = reports[0].id;
        
        const profileToSave = {
          businessUrl: displayProfile.businessUrl || '',
          businessName: displayProfile.businessName,
          businessAddress: displayProfile.businessAddress,
          businessPhone: displayProfile.businessPhone,
          businessCategory: displayProfile.businessCategory,
          businessRating: displayProfile.businessRating,
          businessReviewsCount: displayProfile.businessReviewsCount,
          businessWebsite: displayProfile.businessWebsite,
          businessHours: displayProfile.businessHours || {}
        };
        
        const savedProfile = await saveBusinessProfile(latestReportId, profileToSave);
        
        if (savedProfile) {
          const { error: updateError } = await supabase
            .from('reports')
            .update({ has_business_profile: true })
            .eq('id', latestReportId);
            
          if (updateError) {
            console.error('Error updating has_business_profile flag:', updateError);
          }
          
          toast.success('Perfil de negocio guardado correctamente');
        } else {
          toast.error('Error al guardar el perfil de negocio');
        }
      } else {
        toast.error('No hay informes disponibles para guardar el perfil');
      }
    } catch (error) {
      console.error('Error saving business profile:', error);
      toast.error('Error al guardar el perfil de negocio');
    }
  };

  if (!hasData) {
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
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-500";
    if (rating >= 3.5) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {displayProfile?.businessName && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Nombre</span>
            <span className="text-sm truncate max-w-[200px]">{displayProfile.businessName}</span>
          </div>
        )}
      
        {displayProfile?.businessRating !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Valoración</span>
            <span className={cn("flex items-center", getRatingColor(displayProfile.businessRating))}>
              {displayProfile.businessRating.toFixed(1)}
              <Star className="h-3.5 w-3.5 ml-1 fill-current" />
              <span className="text-xs text-muted-foreground ml-1">
                ({displayProfile.businessReviewsCount || 0})
              </span>
            </span>
          </div>
        )}
      
        {displayProfile?.businessAddress && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center">
              <MapPin className="h-3 w-3 mr-1 text-muted-foreground" /> 
              Dirección
            </span>
            <span className="text-sm truncate max-w-[200px]">{displayProfile.businessAddress}</span>
          </div>
        )}
        
        {displayProfile?.businessPhone && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center">
              <Phone className="h-3 w-3 mr-1 text-muted-foreground" /> 
              Teléfono
            </span>
            <span className="text-sm">{displayProfile.businessPhone}</span>
          </div>
        )}
        
        {displayProfile?.businessWebsite && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center">
              <Link2 className="h-3 w-3 mr-1 text-muted-foreground" /> 
              Web
            </span>
            <a 
              href={displayProfile.businessWebsite} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm text-primary hover:underline truncate max-w-[200px]"
            >
              {displayProfile.businessWebsite.replace(/^https?:\/\//, '')}
            </a>
          </div>
        )}
      </div>
      
      {isSimulated && (
        <div className="py-2 px-3 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-xs text-amber-700">
            Se muestran datos simulados. Usa el botón de actualizar para obtener datos reales.
          </p>
        </div>
      )}

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
    </div>
  );
};

export default BusinessProfileCardContent;
