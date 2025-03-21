
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Store, Check, Search, AlertTriangle, Info, MapPin, Phone, Link2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { extractBusinessInfo } from '@/services/api/businessProfile';
import { BusinessProfile } from '@/types/report.types';
import { isValidGoogleBusinessUrl } from '@/services/api/businessProfile/utils';

interface BusinessUrlInputProps {
  businessUrl: string;
  setBusinessUrl: (url: string) => void;
  businessProfile: Partial<BusinessProfile> | null;
  setBusinessProfile: (profile: Partial<BusinessProfile> | null) => void;
}

const BusinessUrlInput: React.FC<BusinessUrlInputProps> = ({
  businessUrl,
  setBusinessUrl,
  businessProfile,
  setBusinessProfile
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusinessUrl(e.target.value);
    setHasError(false);
    setIsSimulated(false);
  };
  
  const analyzeBusinessUrl = async () => {
    if (!businessUrl) {
      toast.error('Introduce una URL válida');
      return;
    }
    
    if (!isValidGoogleBusinessUrl(businessUrl)) {
      toast.error('URL no válida', {
        description: 'Debes proporcionar una URL válida de Google Maps o Google Business'
      });
      setHasError(true);
      return;
    }
    
    setIsAnalyzing(true);
    setHasError(false);
    setIsSimulated(false);
    
    try {
      // Use the extractBusinessInfo function to get profile information
      const profileData = await extractBusinessInfo(businessUrl);
      
      if (profileData) {
        // Ensure businessHours is a proper object or empty object
        if (!profileData.businessHours) {
          profileData.businessHours = {};
        } else if (typeof profileData.businessHours === 'string') {
          try {
            profileData.businessHours = JSON.parse(profileData.businessHours);
          } catch (parseError) {
            console.error('Error parsing business hours:', parseError);
            profileData.businessHours = {}; // Fallback to empty object
          }
        }
        
        setBusinessProfile(profileData);
        console.log('Perfil de negocio extraído:', profileData);
        
        // Check if the data is from simulation (we can tell by checking if the name contains "ejemplo")
        const isMockData = profileData.businessName?.includes('ejemplo') || 
                           profileData.businessName === 'Negocio de ejemplo';
                           
        setIsSimulated(isMockData);
        
        if (isMockData) {
          toast.warning('Datos simulados obtenidos', {
            description: 'Se están mostrando datos de ejemplo'
          });
        } else {
          toast.success('Información extraída correctamente');
        }
      } else {
        setHasError(true);
        toast.error('No se pudo extraer información', {
          description: 'No se encontraron datos del perfil de negocio'
        });
      }
    } catch (error: any) {
      setHasError(true);
      setIsSimulated(true);
      console.error('Error al analizar URL:', error);
      toast.error('Error al analizar URL', {
        description: error.message || 'No se pudo extraer información'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Helper function to safely render rating
  const renderBusinessRating = (rating: number | null | undefined) => {
    if (rating === undefined || rating === null) {
      return "N/A";
    }
    return rating.toFixed(1);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Store className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-medium">Perfil de Google Business</h3>
      </div>
      
      <p className="text-muted-foreground text-sm">
        Añade un enlace al perfil de Google Business para incluir información local en el informe
      </p>
      
      <div className="flex items-center gap-2">
        <Input
          value={businessUrl}
          onChange={handleUrlChange}
          placeholder="https://maps.google.com/... o https://maps.app.goo.gl/..."
          className={`flex-1 ${hasError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        />
        <Button 
          onClick={analyzeBusinessUrl} 
          disabled={isAnalyzing || !businessUrl}
          variant={hasError ? "destructive" : "secondary"}
        >
          {isAnalyzing ? (
            <>Analizando<span className="loading ml-2">...</span></>
          ) : (
            <>
              {hasError ? 
                <AlertTriangle className="h-4 w-4 mr-2" /> : 
                <Search className="h-4 w-4 mr-2" />
              }
              {hasError ? 'Reintentar' : 'Analizar'}
            </>
          )}
        </Button>
      </div>
      
      {businessProfile && (
        <Card className={`p-4 ${hasError ? 'bg-red-50 border-red-200' : isSimulated ? 'bg-amber-50 border-amber-200' : 'bg-primary/5 border-primary/20'}`}>
          <div className="flex items-start gap-3">
            <div className={`${hasError ? 'bg-red-500/20' : isSimulated ? 'bg-amber-500/20' : 'bg-green-500/20'} p-1.5 rounded-full mt-0.5`}>
              {hasError ? 
                <AlertTriangle className="h-4 w-4 text-red-600" /> : 
                isSimulated ?
                <Info className="h-4 w-4 text-amber-600" /> :
                <Check className="h-4 w-4 text-green-600" />
              }
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-md">
                {hasError 
                  ? 'Datos limitados' 
                  : isSimulated 
                    ? 'Datos simulados' 
                    : 'Información detectada'
                }
              </h4>
              <div className="mt-2 space-y-2 text-sm text-muted-foreground divide-y divide-gray-100">
                {businessProfile.businessName && (
                  <div className="pb-2">
                    <div className="font-medium text-foreground">Nombre</div>
                    <div>{businessProfile.businessName}</div>
                  </div>
                )}
                {businessProfile.businessCategory && (
                  <div className="py-2">
                    <div className="font-medium text-foreground">Categoría</div>
                    <div>{businessProfile.businessCategory}</div>
                  </div>
                )}
                {businessProfile.businessRating !== undefined && (
                  <div className="py-2">
                    <div className="font-medium text-foreground">Valoración</div>
                    <div className="flex items-center">
                      <div className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium mr-2">
                        {renderBusinessRating(businessProfile.businessRating)}
                      </div>
                      {businessProfile.businessReviewsCount !== undefined && (
                        <span>
                          {businessProfile.businessReviewsCount} reseñas
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {businessProfile.businessAddress && (
                  <div className="py-2">
                    <div className="font-medium text-foreground flex items-center">
                      <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" /> 
                      Dirección
                    </div>
                    <div>{businessProfile.businessAddress}</div>
                  </div>
                )}
                {businessProfile.businessPhone && (
                  <div className="py-2">
                    <div className="font-medium text-foreground flex items-center">
                      <Phone className="h-3.5 w-3.5 mr-1 text-muted-foreground" /> 
                      Teléfono
                    </div>
                    <div>{businessProfile.businessPhone}</div>
                  </div>
                )}
                {businessProfile.businessWebsite && (
                  <div className="py-2">
                    <div className="font-medium text-foreground flex items-center">
                      <Link2 className="h-3.5 w-3.5 mr-1 text-muted-foreground" /> 
                      Sitio web
                    </div>
                    <div>
                      <a 
                        href={businessProfile.businessWebsite} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-primary hover:underline"
                      >
                        {businessProfile.businessWebsite.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  </div>
                )}
                {businessProfile.businessHours && 
                 typeof businessProfile.businessHours === 'object' && 
                 Object.keys(businessProfile.businessHours).length > 0 && (
                  <div className="py-2">
                    <div className="font-medium text-foreground flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" /> 
                      Horario
                    </div>
                    <div className="text-xs space-y-1 mt-1">
                      {Object.entries(businessProfile.businessHours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between">
                          <span className="font-medium">{day}</span>
                          <span>{hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {(hasError || isSimulated) && (
                <p className="mt-3 text-xs text-amber-600">
                  Nota: Se están utilizando datos simulados. Para obtener datos reales, asegúrate de proporcionar una URL válida de Google Business.
                </p>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default BusinessUrlInput;
