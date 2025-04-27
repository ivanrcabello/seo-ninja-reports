
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fetchBusinessProfile } from '@/services/api/businessProfile/fetchBusinessProfile';
import { toast } from 'sonner';
import { Loader2, MapPin, Phone, Globe, Clock, Star } from 'lucide-react';
import { BusinessProfile } from '@/types/report.types';

interface ClientGmbTabProps {
  clientId: string;
  clientName: string;
  businessProfile?: Partial<BusinessProfile> | null;
  isRefreshingBusinessProfile?: boolean;
  onRefreshBusinessProfile?: () => void;
  onBusinessProfileUpdate?: (profile: Partial<BusinessProfile>) => void;
}

const ClientGmbTab: React.FC<ClientGmbTabProps> = ({ 
  clientId, 
  clientName,
  businessProfile: propBusinessProfile,
  isRefreshingBusinessProfile,
  onRefreshBusinessProfile,
  onBusinessProfileUpdate 
}) => {
  const [businessProfile, setBusinessProfile] = React.useState<BusinessProfile | null>(propBusinessProfile as BusinessProfile || null);
  const [isLoading, setIsLoading] = React.useState(false);
  
  const handleGetBusinessData = async () => {
    try {
      setIsLoading(true);
      toast.info('Buscando datos del negocio...');
      
      const profile = await fetchBusinessProfile(clientId);
      console.info('Received business profile from API:', profile);
      
      if (profile) {
        setBusinessProfile(profile);
        
        // Also notify parent component if callback is provided
        if (onBusinessProfileUpdate) {
          onBusinessProfileUpdate(profile);
        }
        
        toast.success('Datos de negocio actualizados correctamente');
      } else {
        toast.error('No se encontraron datos del negocio');
      }
    } catch (error) {
      console.error('Error fetching business profile:', error);
      toast.error('Error al obtener datos del negocio');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format the business hours for display
  const renderBusinessHours = () => {
    if (!businessProfile?.businessHours) {
      return <p className="text-muted-foreground">No hay información de horarios disponible</p>;
    }
    
    // Check if businessHours has an Hours property and it's an array
    if (
      businessProfile.businessHours.Hours && 
      Array.isArray(businessProfile.businessHours.Hours)
    ) {
      return (
        <div className="grid grid-cols-1 gap-1">
          {businessProfile.businessHours.Hours.map((hour: any, index: number) => (
            <div key={index} className="flex justify-between">
              <span className="font-medium capitalize">{typeof hour === 'object' && hour !== null && 'name' in hour ? hour.name : 'Día'}:</span>
              <span>{typeof hour === 'object' && hour !== null && 'value' in hour ? hour.value : 'No disponible'}</span>
            </div>
          ))}
        </div>
      );
    }
    
    // If businessHours is a string that looks like JSON, try to parse it
    if (typeof businessProfile.businessHours === 'string') {
      try {
        const parsedHours = JSON.parse(businessProfile.businessHours);
        if (parsedHours.Hours && Array.isArray(parsedHours.Hours)) {
          return (
            <div className="grid grid-cols-1 gap-1">
              {parsedHours.Hours.map((hour: any, index: number) => (
                <div key={index} className="flex justify-between">
                  <span className="font-medium capitalize">{typeof hour === 'object' && hour !== null && 'name' in hour ? hour.name : 'Día'}:</span>
                  <span>{typeof hour === 'object' && hour !== null && 'value' in hour ? hour.value : 'No disponible'}</span>
                </div>
              ))}
            </div>
          );
        }
      } catch (e) {
        console.error('Error parsing business hours:', e);
      }
    }
    
    // Fallback for any other format - handle it as a simple object with key-value pairs
    const hours = typeof businessProfile.businessHours === 'object' ? businessProfile.businessHours : {};
    
    if (Object.keys(hours).length === 0) {
      return <p className="text-muted-foreground">No hay información de horarios disponible</p>;
    }
    
    return (
      <div className="grid grid-cols-1 gap-1">
        {Object.entries(hours).map(([day, timeObj], index) => {
          // Skip rendering if it's not a direct key-value pair
          if (typeof timeObj === 'object' && timeObj !== null) {
            // Add additional verifications for timeObj and its properties
            if (timeObj && typeof timeObj === 'object') {
              // Verificar si el objeto tiene las propiedades name y value usando 'in'
              let hasName = false;
              let hasValue = false;
              
              if ('name' in timeObj) {
                hasName = true;
              }
              
              if ('value' in timeObj) {
                hasValue = true;
              }
              
              const name = hasName && timeObj.name ? String(timeObj.name) : 'Día';
              const value = hasValue && timeObj.value ? String(timeObj.value) : 'No disponible';
              
              return (
                <div key={index} className="flex justify-between">
                  <span className="font-medium capitalize">{name}:</span>
                  <span>{value}</span>
                </div>
              );
            }
            return null;
          }
          
          // Safe handling of null/undefined values
          const dayDisplay = day || 'Día';
          
          // Make sure timeObj is converted to string safely
          let timeDisplay = 'No disponible';
          if (timeObj !== null && timeObj !== undefined) {
            timeDisplay = String(timeObj);
          }
          
          return (
            <div key={index} className="flex justify-between">
              <span className="font-medium capitalize">{dayDisplay}:</span>
              <span>{timeDisplay}</span>
            </div>
          );
        }).filter(Boolean)}
      </div>
    );
  };

  // Determine which action should be taken when getting data
  const handleAction = onRefreshBusinessProfile || handleGetBusinessData;
  const isLoadingState = isRefreshingBusinessProfile || isLoading;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Perfil de Google My Business</h2>
          <p className="text-muted-foreground">
            Información del perfil de empresa en Google para {clientName}
          </p>
        </div>
        <Button 
          onClick={handleAction} 
          disabled={isLoadingState}
          className="bg-teal-600 hover:bg-teal-700"
        >
          {isLoadingState ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cargando...
            </>
          ) : (
            'Obtener datos GMB'
          )}
        </Button>
      </div>
      
      {businessProfile ? (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Negocio</CardTitle>
              <CardDescription>Detalles básicos del perfil empresarial</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-lg">{businessProfile.businessName}</h3>
                {businessProfile.businessRating && (
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="font-medium">{businessProfile.businessRating}</span>
                    <span className="text-muted-foreground ml-1">
                      ({businessProfile.businessReviewsCount || 0} reseñas)
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                <span>{businessProfile.businessAddress || 'No disponible'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{businessProfile.businessPhone || 'No disponible'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <a 
                  href={businessProfile.businessWebsite} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {businessProfile.businessWebsite ? 
                    businessProfile.businessWebsite.replace(/^https?:\/\//, '') : 
                    'No disponible'}
                </a>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Horarios de Atención</CardTitle>
              <CardDescription>Horarios publicados en el perfil de Google</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-2 mb-4">
                <Clock className="h-4 w-4 mt-1 text-muted-foreground" />
                <div className="flex-1">
                  {renderBusinessHours()}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              <p className="mb-4">No se han cargado datos del perfil de Google My Business</p>
              <p>Haga clic en "Obtener datos GMB" para cargar la información</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClientGmbTab;
