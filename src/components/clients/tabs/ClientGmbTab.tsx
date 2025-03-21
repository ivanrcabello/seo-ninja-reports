
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, RefreshCw, Star, Phone, Link2, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BusinessProfile } from '@/types/report.types';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { extractValueserpData } from '@/services/api/businessProfile/extractValueserpData';
import { saveBusinessProfile } from '@/services/api/businessProfile/saveBusinessProfile';
import { supabase } from '@/integrations/supabase/client';

interface ClientGmbTabProps {
  clientId: string;
  clientName?: string;
  clientLocation?: string;
  businessProfile: Partial<BusinessProfile> | null;
  isRefreshingBusinessProfile: boolean;
  onRefreshBusinessProfile: () => void;
  onBusinessProfileUpdate: (profile: Partial<BusinessProfile>) => void;
}

const ClientGmbTab: React.FC<ClientGmbTabProps> = ({
  clientId,
  clientName,
  clientLocation,
  businessProfile,
  isRefreshingBusinessProfile,
  onRefreshBusinessProfile,
  onBusinessProfileUpdate
}) => {
  const [displayProfile, setDisplayProfile] = useState<Partial<BusinessProfile> | null>(null);
  const [isSimulated, setIsSimulated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (businessProfile) {
      setDisplayProfile(businessProfile);
      setIsSimulated(
        businessProfile.businessName === 'Negocio de ejemplo' || 
        businessProfile.businessName?.includes('ejemplo') || false
      );
      console.log("Updated GMB Tab with business profile:", businessProfile);
    }
  }, [businessProfile]);

  const handleAnalyzeGMB = async () => {
    if (!clientName) {
      toast.error('Nombre del cliente no disponible');
      return;
    }

    try {
      toast.info('Consultando API de ValueSerp', {
        description: 'Extrayendo información detallada del negocio...',
      });
      
      const result = await extractValueserpData(clientName, clientLocation || '');
      
      if (result) {
        setDisplayProfile(result);
        onBusinessProfileUpdate(result);
        
        const resultIsSimulated = result.businessName === 'Negocio de ejemplo' || 
                          result.businessName?.includes('ejemplo');
        setIsSimulated(resultIsSimulated);
                          
        if (resultIsSimulated) {
          toast.warning('Datos simulados obtenidos', {
            description: 'Intenta refinar la búsqueda con ubicación específica'
          });
        } else {
          toast.success('Datos de negocio actualizados correctamente con ValueSerp');
        }
      } else {
        toast.error('No se pudieron obtener datos del negocio');
      }
    } catch (error) {
      console.error('Error analyzing GMB:', error);
      toast.error('Error al actualizar datos de negocio');
    }
  };

  const saveBusinessProfileData = async () => {
    if (!clientId || !displayProfile) {
      console.error("Cannot save business profile: missing clientId or profile data");
      toast.error('No hay datos para guardar');
      return;
    }

    setIsSaving(true);

    try {
      // Get the latest report for this client
      const { data: reports, error: reportsError } = await supabase
        .from('reports')
        .select('id')
        .eq('client_id', clientId)
        .order('date', { ascending: false })
        .limit(1);

      if (reportsError) {
        console.error('Error fetching latest report:', reportsError);
        toast.error('Error al obtener el informe más reciente');
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
        
        // Save the business profile to this report
        await saveBusinessProfile(latestReportId, profileToSave);
        toast.success('Perfil de negocio guardado correctamente');
      } else {
        toast.error('No hay informes disponibles para guardar el perfil');
      }
    } catch (error) {
      console.error('Error saving business profile:', error);
      toast.error('Error al guardar el perfil de negocio');
    } finally {
      setIsSaving(false);
    }
  };

  const getRatingColor = (rating: number | undefined) => {
    if (!rating) return "";
    if (rating >= 4.5) return "text-green-500";
    if (rating >= 3.5) return "text-amber-500";
    return "text-red-500";
  };

  const hasData = Boolean(displayProfile?.businessName);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-primary" />
            Perfil de Google My Business
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!hasData ? (
            <div className="py-4 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                No hay datos de perfil de negocio disponibles
              </p>
              <Button 
                variant="outline" 
                onClick={onRefreshBusinessProfile}
                disabled={isRefreshingBusinessProfile}
                className="mx-auto"
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
          ) : (
            <>
              <div className={`mb-4 p-4 rounded-md ${isSimulated ? 'bg-amber-50 border border-amber-200' : 'bg-primary/5 border border-primary/10'}`}>
                <div className="flex items-start gap-3">
                  {isSimulated ? (
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="space-y-1">
                    <h3 className="font-medium">
                      {isSimulated ? "Datos simulados" : "Perfil de Google My Business"}
                    </h3>
                    {isSimulated && (
                      <p className="text-sm text-amber-600">
                        Los datos mostrados son simulados. Para obtener datos reales, refina la búsqueda con información más específica.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
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
                      {displayProfile.businessRating?.toFixed(1)}
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

                {displayProfile?.businessCategory && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Categoría</span>
                    <span className="text-sm truncate max-w-[200px]">{displayProfile.businessCategory}</span>
                  </div>
                )}
                
                {displayProfile?.businessHours && 
                  typeof displayProfile.businessHours === 'object' && 
                  Object.keys(displayProfile.businessHours).length > 0 && (
                  <div className="mt-4 pt-2 border-t border-border">
                    <h4 className="text-sm font-medium mb-2">Horarios de apertura</h4>
                    <div className="grid grid-cols-1 gap-1">
                      {Object.entries(displayProfile.businessHours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between text-sm">
                          <span>{day}</span>
                          <span>{hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full" 
                  onClick={handleAnalyzeGMB}
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
                  disabled={isSaving || isSimulated}
                >
                  Guardar para informe
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientGmbTab;
