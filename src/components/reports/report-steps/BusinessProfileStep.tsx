
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Map, Building, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { scrapeBusinessProfile } from '@/services/api/businessProfile/scrapeBusinessProfile';
import { useReportGenerator } from '@/context/ReportGeneratorContext';

interface BusinessProfileStepProps {
  nextStep: () => void;
  previousStep: () => void;
}

const BusinessProfileStep: React.FC<BusinessProfileStepProps> = ({
  nextStep,
  previousStep
}) => {
  const { 
    businessUrl, setBusinessUrl,
    businessProfile, setBusinessProfile, 
    useGmbData, setUseGmbData
  } = useReportGenerator();
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleFetchBusinessProfile = async () => {
    if (!businessUrl) {
      toast.error('Introduce una URL de Google Maps válida');
      return;
    }
    
    try {
      setIsLoading(true);
      const data = await scrapeBusinessProfile(businessUrl);
      
      if (data) {
        setBusinessProfile(data);
        toast.success('Información del negocio obtenida correctamente');
      } else {
        toast.error('No se pudo obtener información del negocio');
      }
    } catch (error) {
      console.error('Error fetching business profile:', error);
      toast.error('Error al obtener información del negocio');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Presencia local</h2>
          <p className="text-muted-foreground">
            Obtén y configura información sobre el perfil de negocio en Google
          </p>
        </div>
        
        <div className="border rounded-lg p-4 space-y-4">
          <div className="flex items-start gap-3">
            <Map className="h-5 w-5 text-primary mt-1" />
            <div>
              <h3 className="font-medium">Perfil de Google Business</h3>
              <p className="text-sm text-muted-foreground">
                Incluye información de la ficha de Google My Business en el informe
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="use-gmb" 
              checked={useGmbData}
              onCheckedChange={(checked) => setUseGmbData(checked)}
            />
            <Label htmlFor="use-gmb">
              Incluir datos de Google My Business en el informe
            </Label>
          </div>
          
          {useGmbData && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="business-url">URL de Google Maps</Label>
                <Input
                  id="business-url"
                  placeholder="https://maps.google.com/..."
                  value={businessUrl}
                  onChange={(e) => setBusinessUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Introduce la URL completa del negocio en Google Maps
                </p>
              </div>
              
              <Button 
                variant="outline" 
                onClick={handleFetchBusinessProfile}
                disabled={!businessUrl || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Obteniendo datos...
                  </>
                ) : businessProfile ? (
                  'Actualizar información'
                ) : (
                  'Obtener información del negocio'
                )}
              </Button>
              
              {businessProfile && (
                <div className="bg-muted/30 p-4 rounded-md space-y-3">
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-muted-foreground" />
                    <h4 className="font-medium">{businessProfile.businessName}</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    {businessProfile.businessAddress && (
                      <div>
                        <span className="text-muted-foreground">Dirección:</span>{' '}
                        <span>{businessProfile.businessAddress}</span>
                      </div>
                    )}
                    
                    {businessProfile.businessPhone && (
                      <div>
                        <span className="text-muted-foreground">Teléfono:</span>{' '}
                        <span>{businessProfile.businessPhone}</span>
                      </div>
                    )}
                    
                    {businessProfile.businessCategory && (
                      <div>
                        <span className="text-muted-foreground">Categoría:</span>{' '}
                        <span>{businessProfile.businessCategory}</span>
                      </div>
                    )}
                    
                    {businessProfile.businessRating !== undefined && (
                      <div>
                        <span className="text-muted-foreground">Valoración:</span>{' '}
                        <span>{businessProfile.businessRating} ⭐ ({businessProfile.businessReviewsCount} reseñas)</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={previousStep}>
          Atrás
        </Button>
        <Button onClick={nextStep}>
          Continuar
        </Button>
      </CardFooter>
    </>
  );
};

export default BusinessProfileStep;
