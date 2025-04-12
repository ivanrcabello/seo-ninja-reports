
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
}

const ClientGmbTab: React.FC<ClientGmbTabProps> = ({ clientId, clientName }) => {
  const [businessProfile, setBusinessProfile] = React.useState<BusinessProfile | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  
  const handleGetBusinessData = async () => {
    try {
      setIsLoading(true);
      toast.info('Buscando datos del negocio...');
      
      const profile = await fetchBusinessProfile(clientId);
      console.info('Received business profile from API:', profile);
      
      if (profile) {
        setBusinessProfile(profile);
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
    if (!businessProfile?.businessHours || !businessProfile.businessHours.Hours) {
      return <p className="text-muted-foreground">No hay información de horarios disponible</p>;
    }
    
    return (
      <div className="grid grid-cols-1 gap-1">
        {businessProfile.businessHours.Hours.map((hour, index) => (
          <div key={index} className="flex justify-between">
            <span className="font-medium capitalize">{hour.name}:</span>
            <span>{hour.value}</span>
          </div>
        ))}
      </div>
    );
  };

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
          onClick={handleGetBusinessData} 
          disabled={isLoading}
        >
          {isLoading ? (
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
