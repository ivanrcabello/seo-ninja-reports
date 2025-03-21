
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Search, AlertCircle, CheckCircle, Globe, Info, Clock, Phone, Link2 } from 'lucide-react';
import { extractBusinessInfo } from '@/services/api/businessProfile';
import { extractGmbData } from '@/services/api/businessProfile/extractGmbData'; 
import { toast } from 'sonner';
import { BusinessProfile } from '@/types/report.types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { isValidGoogleBusinessUrl } from '@/services/api/businessProfile/utils';

interface ClientGmbTestProps {
  clientId: string;
  clientWebsite?: string;
  onProfileUpdate?: (profile: Partial<BusinessProfile>) => void;
}

const ClientGmbTest: React.FC<ClientGmbTestProps> = ({ clientId, clientWebsite, onProfileUpdate }) => {
  const [businessUrl, setBusinessUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [businessProfile, setBusinessProfile] = useState<Partial<BusinessProfile> | null>(null);
  const [useWebsite, setUseWebsite] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);
  
  const handleAnalyze = async () => {
    if (useWebsite && clientWebsite) {
      // Usar la URL del sitio web para intentar encontrar el perfil GMB
      await analyzeWithWebsite();
    } else if (businessUrl.trim()) {
      // Usar la URL de GMB proporcionada
      await analyzeWithGmbUrl();
    } else {
      toast.error('Introduce una URL válida o usa el sitio web del cliente');
      return;
    }
  };
  
  const analyzeWithWebsite = async () => {
    if (!clientWebsite) {
      toast.error('No hay URL de sitio web disponible para este cliente');
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    setIsSimulated(false);
    
    try {
      // Safety wrapper to ensure we always get data back and never show a blank screen
      let profileData = null;
      
      try {
        profileData = await extractGmbData(clientWebsite, false);
      } catch (extractError) {
        console.error('Error extracting GMB data from website:', extractError);
        throw new Error('No se pudo extraer información del sitio web');
      }
      
      if (profileData && (profileData.businessName || profileData.businessAddress)) {
        // Ensure businessHours is a proper object
        if (profileData.businessHours && typeof profileData.businessHours === 'string') {
          try {
            profileData.businessHours = JSON.parse(profileData.businessHours);
          } catch (parseError) {
            console.error('Error parsing business hours:', parseError);
            profileData.businessHours = {}; // Fallback to empty object
          }
        }
        
        setBusinessProfile(profileData);
        
        // Check if the data is from simulation
        const isMockData = profileData.businessName?.includes('ejemplo') || 
                          profileData.businessName === 'Negocio de ejemplo';
                          
        setIsSimulated(isMockData);
        
        if (onProfileUpdate && !isMockData) {
          onProfileUpdate(profileData);
        }
        
        if (isMockData) {
          toast.warning('Se están usando datos simulados', {
            description: 'No se pudo encontrar un perfil de GMB para este sitio web'
          });
        } else {
          toast.success('Perfil analizado correctamente');
        }
      } else {
        // Si es null o datos insuficientes, usar un perfil simulado
        const mockData = {
          businessName: 'Negocio de ejemplo',
          businessAddress: 'Dirección de ejemplo',
          businessCategory: 'Categoría de ejemplo',
          businessRating: 4.5,
          businessReviewsCount: 123,
          businessPhone: '+34 123 456 789',
          businessWebsite: clientWebsite,
          businessHours: {} // Empty object by default
        };
        
        setBusinessProfile(mockData);
        setIsSimulated(true);
        setError('No se pudo extraer información real');
        toast.warning('Usando datos simulados', {
          description: 'No se pudo obtener datos reales del perfil'
        });
      }
    } catch (error: any) {
      console.error('Error al analizar con sitio web:', error);
      
      // Usar datos simulados en caso de error para evitar pantalla en blanco
      const mockData = {
        businessName: 'Negocio de ejemplo',
        businessAddress: 'Dirección de ejemplo',
        businessCategory: 'Categoría de ejemplo',
        businessRating: 4.5,
        businessReviewsCount: 123,
        businessPhone: '+34 123 456 789',
        businessWebsite: clientWebsite,
        businessHours: {} // Empty object by default
      };
      
      setBusinessProfile(mockData);
      setError(error.message || 'Error al analizar perfil');
      toast.error('Error al analizar perfil');
      setIsSimulated(true);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const analyzeWithGmbUrl = async () => {
    if (!isValidGoogleBusinessUrl(businessUrl)) {
      setError('La URL debe ser de Google Business o Google Maps');
      toast.error('URL no válida', {
        description: 'Debes proporcionar una URL válida de Google Maps o Google Business'
      });
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    setIsSimulated(false);
    
    try {
      // Safety wrapper to ensure we always get data back
      let profileData = null;
      
      try {
        profileData = await extractBusinessInfo(businessUrl);
      } catch (extractError) {
        console.error('Error extracting business info:', extractError);
        throw new Error('No se pudo extraer información del perfil');
      }
      
      if (profileData && (profileData.businessName || profileData.businessAddress)) {
        // Ensure businessHours is a proper object
        if (profileData.businessHours && typeof profileData.businessHours === 'string') {
          try {
            profileData.businessHours = JSON.parse(profileData.businessHours);
          } catch (parseError) {
            console.error('Error parsing business hours:', parseError);
            profileData.businessHours = {}; // Fallback to empty object
          }
        }
        
        setBusinessProfile(profileData);
        
        // Check if the data is from simulation
        const isMockData = profileData.businessName?.includes('ejemplo') || 
                          profileData.businessName === 'Negocio de ejemplo';
                          
        setIsSimulated(isMockData);
        
        // Only update the parent component with real data
        if (onProfileUpdate && !isMockData) {
          onProfileUpdate(profileData);
        }
        
        if (isMockData) {
          toast.warning('Se están usando datos simulados', {
            description: 'No se pudieron extraer datos reales del perfil'
          });
        } else {
          toast.success('Perfil analizado correctamente');
        }
      } else {
        // Si es null o datos insuficientes, usar un perfil simulado para evitar la pantalla en blanco
        const mockData = {
          businessUrl: businessUrl,
          businessName: 'Negocio de ejemplo',
          businessAddress: 'Dirección de ejemplo',
          businessCategory: 'Categoría de ejemplo',
          businessRating: 4.5,
          businessReviewsCount: 123,
          businessPhone: '+34 123 456 789',
          businessWebsite: 'https://example.com',
          businessHours: {} // Empty object by default
        };
        
        setBusinessProfile(mockData);
        setIsSimulated(true);
        setError('No se pudo extraer información real');
        toast.warning('Usando datos simulados', {
          description: 'No se pudo obtener datos reales del perfil'
        });
      }
    } catch (error: any) {
      console.error('Error al analizar URL de GMB:', error);
      
      // Usar datos simulados en caso de error para evitar pantalla en blanco
      const mockData = {
        businessUrl: businessUrl,
        businessName: 'Negocio de ejemplo',
        businessAddress: 'Dirección de ejemplo',
        businessCategory: 'Categoría de ejemplo',
        businessRating: 4.5,
        businessReviewsCount: 123,
        businessPhone: '+34 123 456 789',
        businessWebsite: 'https://example.com',
        businessHours: {} // Empty object by default
      };
      
      setBusinessProfile(mockData);
      setError(error.message || 'Error al analizar perfil');
      toast.error('Error al analizar perfil');
      setIsSimulated(true);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-primary" />
          Análisis de Google Business
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Introduce la URL del perfil de Google Business para analizar la información o usa el sitio web del cliente
        </p>
        
        {clientWebsite && (
          <div className="flex items-center space-x-2 mb-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setUseWebsite(!useWebsite);
                setError(null);
              }}
              className={useWebsite ? "bg-primary/10" : ""}
            >
              <Globe className="h-4 w-4 mr-2" />
              {useWebsite ? "Usando sitio web" : "Usar sitio web del cliente"}
            </Button>
            {useWebsite && (
              <p className="text-xs text-muted-foreground">
                Se analizará: {clientWebsite}
              </p>
            )}
          </div>
        )}
        
        {!useWebsite && (
          <div className="flex gap-2">
            <Input
              placeholder="https://maps.app.goo.gl/... o https://www.google.com/maps/..."
              value={businessUrl}
              onChange={(e) => {
                setBusinessUrl(e.target.value);
                setError(null);
              }}
              className={error ? "border-red-500" : ""}
            />
            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing || !businessUrl.trim()}
            >
              {isAnalyzing ? (
                <span className="flex items-center">
                  <span className="loading mr-2">●</span>
                  Analizando
                </span>
              ) : (
                <span className="flex items-center">
                  <Search className="h-4 w-4 mr-2" />
                  Analizar
                </span>
              )}
            </Button>
          </div>
        )}
        
        {useWebsite && (
          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing || !clientWebsite}
            className="w-full"
          >
            {isAnalyzing ? (
              <span className="flex items-center">
                <span className="loading mr-2">●</span>
                Analizando con sitio web
              </span>
            ) : (
              <span className="flex items-center">
                <Search className="h-4 w-4 mr-2" />
                Analizar con sitio web
              </span>
            )}
          </Button>
        )}
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {businessProfile && (
          <div className={`mt-4 p-4 rounded-md ${isSimulated ? 'bg-amber-50 border border-amber-200' : 'bg-primary/5 border border-primary/10'}`}>
            <div className="flex items-start gap-3">
              {isSimulated ? (
                <Info className="h-5 w-5 text-amber-600 mt-0.5" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              )}
              <div className="w-full">
                <h4 className="font-medium">{isSimulated ? "Datos simulados" : "Información detectada"}</h4>
                <ul className="mt-2 space-y-2 text-sm divide-y divide-gray-100">
                  {businessProfile.businessName && (
                    <li className="pt-2 pb-1">
                      <div className="font-medium">Nombre</div>
                      <div>{businessProfile.businessName}</div>
                    </li>
                  )}
                  {businessProfile.businessCategory && (
                    <li className="pt-2 pb-1">
                      <div className="font-medium">Categoría</div>
                      <div>{businessProfile.businessCategory}</div>
                    </li>
                  )}
                  {businessProfile.businessRating !== undefined && (
                    <li className="pt-2 pb-1">
                      <div className="font-medium">Valoración</div>
                      <div className="flex items-center">
                        <div className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium mr-2">
                          {businessProfile.businessRating.toFixed(1)}
                        </div>
                        {businessProfile.businessReviewsCount !== undefined && (
                          <span className="text-muted-foreground">
                            {businessProfile.businessReviewsCount} reseñas
                          </span>
                        )}
                      </div>
                    </li>
                  )}
                  {businessProfile.businessAddress && (
                    <li className="pt-2 pb-1">
                      <div className="font-medium flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" /> 
                        Dirección
                      </div>
                      <div>{businessProfile.businessAddress}</div>
                    </li>
                  )}
                  {businessProfile.businessPhone && (
                    <li className="pt-2 pb-1">
                      <div className="font-medium flex items-center">
                        <Phone className="h-3.5 w-3.5 mr-1 text-muted-foreground" /> 
                        Teléfono
                      </div>
                      <div>{businessProfile.businessPhone}</div>
                    </li>
                  )}
                  {businessProfile.businessWebsite && (
                    <li className="pt-2 pb-1">
                      <div className="font-medium flex items-center">
                        <Link2 className="h-3.5 w-3.5 mr-1 text-muted-foreground" /> 
                        Sitio web
                      </div>
                      <div className="truncate">
                        <a 
                          href={businessProfile.businessWebsite} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-primary hover:underline"
                        >
                          {businessProfile.businessWebsite.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    </li>
                  )}
                  {businessProfile.businessHours && 
                   typeof businessProfile.businessHours === 'object' && 
                   Object.keys(businessProfile.businessHours).length > 0 && (
                    <li className="pt-2 pb-1">
                      <div className="font-medium flex items-center">
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
                    </li>
                  )}
                </ul>
                {isSimulated && (
                  <p className="mt-3 text-xs text-amber-600">
                    Estos son datos simulados. Para obtener datos reales, proporciona una URL directa al perfil de GMB.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientGmbTest;
