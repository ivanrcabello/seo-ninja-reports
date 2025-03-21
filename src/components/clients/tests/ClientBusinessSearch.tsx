
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Store, AlertTriangle, Check, Info, MapPin, Phone, Link2, Clock, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { extractValueserpData } from '@/services/api/businessProfile/extractValueserpData';
import { BusinessProfile } from '@/types/report.types';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ClientBusinessSearchProps {
  clientId: string;
  onProfileUpdate: (profile: Partial<BusinessProfile>) => void;
}

const ClientBusinessSearch: React.FC<ClientBusinessSearchProps> = ({
  clientId,
  onProfileUpdate
}) => {
  const [businessName, setBusinessName] = useState('');
  const [businessLocation, setBusinessLocation] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [businessProfile, setBusinessProfile] = useState<Partial<BusinessProfile> | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);
  const [dataQualityScore, setDataQualityScore] = useState(0);
  
  const handleBusinessNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusinessName(e.target.value);
  };
  
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusinessLocation(e.target.value);
  };
  
  const searchBusiness = async () => {
    if (!businessName) {
      toast.error('Introduce un nombre de negocio');
      return;
    }
    
    setIsAnalyzing(true);
    setHasError(false);
    setIsSimulated(false);
    
    try {
      // Indicar claramente que estamos usando ValueSerp
      toast.info('Consultando API de ValueSerp', {
        description: 'Extrayendo información detallada del negocio...',
      });
      
      console.log('Calling ValueSerp with query:', businessName, businessLocation || '');
      
      // Use ValueSerp API to get profile information
      const profileData = await extractValueserpData(businessName, businessLocation);
      
      if (profileData) {
        setBusinessProfile(profileData);
        console.log('Perfil de negocio extraído:', profileData);
        
        // Check if the data is from simulation
        const isMockData = profileData.businessName?.includes('ejemplo') || 
                           profileData.businessName === 'Negocio de ejemplo';
                           
        setIsSimulated(isMockData);
        
        // Calculate data quality score based on available fields
        let qualityPoints = 0;
        let totalPoints = 0;
        
        // Check each field for data quality
        const fields = [
          'businessName', 'businessAddress', 'businessPhone', 
          'businessCategory', 'businessRating', 'businessReviewsCount', 
          'businessWebsite', 'businessHours'
        ];
        
        fields.forEach(field => {
          totalPoints++;
          if (profileData[field as keyof typeof profileData]) {
            if (field === 'businessHours' && 
                typeof profileData.businessHours === 'object' && 
                Object.keys(profileData.businessHours).length > 0) {
              qualityPoints++;
            } else if (field !== 'businessHours') {
              qualityPoints++;
            }
          }
        });
        
        const scorePercentage = Math.round((qualityPoints / totalPoints) * 100);
        setDataQualityScore(scorePercentage);
        
        if (isMockData) {
          toast.warning('Datos simulados obtenidos', {
            description: 'Intenta refinar tu búsqueda con un nombre más específico'
          });
        } else {
          toast.success('Información extraída correctamente');
          // Update the parent component with the found profile
          onProfileUpdate(profileData);
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
      console.error('Error al analizar negocio:', error);
      toast.error('Error al buscar negocio', {
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
  
  const getDataQualityLabel = (score: number) => {
    if (score >= 80) return "Excelente";
    if (score >= 60) return "Buena";
    if (score >= 40) return "Aceptable";
    return "Limitada";
  };
  
  const getDataQualityColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-emerald-500";
    if (score >= 40) return "bg-amber-500";
    return "bg-red-500";
  };
  
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center space-x-2">
        <Store className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Búsqueda de Negocio con ValueSerp</h3>
      </div>
      
      <p className="text-muted-foreground text-sm">
        Busca información detallada de un negocio por su nombre y ubicación utilizando la API de ValueSerp
      </p>
      
      <div className="space-y-3">
        <div>
          <label htmlFor="businessName" className="text-sm font-medium mb-1 block">
            Nombre del negocio
          </label>
          <Input
            id="businessName"
            value={businessName}
            onChange={handleBusinessNameChange}
            placeholder="Ej. Restaurante El Patio"
            className={`w-full ${hasError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
          />
        </div>
        
        <div>
          <label htmlFor="businessLocation" className="text-sm font-medium mb-1 block">
            Ubicación (opcional)
          </label>
          <Input
            id="businessLocation"
            value={businessLocation}
            onChange={handleLocationChange}
            placeholder="Ej. Madrid, España"
          />
        </div>
        
        <Button 
          onClick={searchBusiness} 
          disabled={isAnalyzing || !businessName}
          variant="default"
          className="w-full"
        >
          {isAnalyzing ? (
            <>
              <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
              Consultando ValueSerp...
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Buscar con ValueSerp
            </>
          )}
        </Button>
      </div>
      
      {businessProfile && (
        <Card className={`p-4 mt-4 ${hasError ? 'bg-red-50 border-red-200' : isSimulated ? 'bg-amber-50 border-amber-200' : 'bg-primary/5 border-primary/20'}`}>
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
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-md">
                  {hasError 
                    ? 'Datos limitados' 
                    : isSimulated 
                      ? 'Datos simulados' 
                      : 'Información detectada'
                  }
                </h4>
                
                {!hasError && !isSimulated && (
                  <Badge className={`${getDataQualityColor(dataQualityScore)} text-white`}>
                    Calidad: {getDataQualityLabel(dataQualityScore)}
                  </Badge>
                )}
              </div>
              
              {!hasError && !isSimulated && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Completitud de datos</span>
                    <span>{dataQualityScore}%</span>
                  </div>
                  <Progress value={dataQualityScore} className={`h-1.5 ${getDataQualityColor(dataQualityScore)}`} />
                </div>
              )}
              
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
                  Nota: Los datos podrían no ser precisos. Intenta refinar tu búsqueda con términos más específicos.
                </p>
              )}
            </div>
          </div>
        </Card>
      )}
    </Card>
  );
};

export default ClientBusinessSearch;
