
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BusinessProfile } from '@/types/report.types';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Phone, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { RefreshCw } from 'lucide-react';
import { saveBusinessProfile } from '@/services/api/businessProfile/saveBusinessProfile';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ClientBusinessCardProps {
  businessProfile: Partial<BusinessProfile> | null;
  isRefreshingBusinessProfile: boolean;
  onRefreshBusinessProfile: () => void;
  clientId?: string;
}

const ClientBusinessCard: React.FC<ClientBusinessCardProps> = ({
  businessProfile,
  isRefreshingBusinessProfile,
  onRefreshBusinessProfile,
  clientId
}) => {
  const [displayProfile, setDisplayProfile] = useState<Partial<BusinessProfile> | null>(null);
  
  // Actualizar el perfil a mostrar cuando cambia businessProfile
  useEffect(() => {
    if (businessProfile) {
      setDisplayProfile(businessProfile);
      console.log("Perfil de negocio actualizado en ClientBusinessCard:", businessProfile);
    }
  }, [businessProfile]);
  
  const hasBusinessData = Boolean(displayProfile?.businessName);
  const isSimulatedData = displayProfile?.businessName === 'Negocio de ejemplo' || 
                          displayProfile?.businessName?.includes('ejemplo');
  
  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-500";
    if (rating >= 3.5) return "text-amber-500";
    return "text-red-500";
  };

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
        
        // Make sure businessUrl is always provided
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
        
        await saveBusinessProfile(latestReportId, profileToSave);
        toast.success('Perfil de negocio guardado correctamente');
      }
    } catch (error) {
      console.error('Error saving business profile:', error);
    }
  };
  
  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-md",
      !hasBusinessData && "opacity-70"
    )}>
      <div className="pb-2 px-6 pt-6">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-medium flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-primary" />
            Perfil de Google Business
          </h3>
          <div className="flex items-center gap-2">
            {hasBusinessData ? (
              isSimulatedData ? (
                <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                  Simulado
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                  Activo
                </Badge>
              )
            ) : (
              <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                No configurado
              </Badge>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={onRefreshBusinessProfile}
                    disabled={isRefreshingBusinessProfile}
                  >
                    <RefreshCw className={cn(
                      "h-4 w-4", 
                      isRefreshingBusinessProfile && "animate-spin"
                    )} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Actualizar datos de GMB</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      <CardContent>
        {hasBusinessData ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Nombre</span>
              <span className="text-sm truncate max-w-[200px]">{displayProfile?.businessName}</span>
            </div>
            
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
            
            {displayProfile?.businessCategory && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Categoría</span>
                <span className="text-sm truncate max-w-[200px]">{displayProfile.businessCategory}</span>
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
            
            {isSimulatedData && (
              <div className="mt-2 py-2 px-3 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-xs text-amber-700">
                  Se muestran datos simulados. Usa el botón de actualizar para obtener datos reales.
                </p>
              </div>
            )}

            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-3" 
              onClick={saveBusinessProfileData}
              disabled={isRefreshingBusinessProfile || !hasBusinessData}
            >
              Guardar perfil para informe
            </Button>
          </div>
        ) : (
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
        )}
      </CardContent>
    </Card>
  );
};

export default ClientBusinessCard;
