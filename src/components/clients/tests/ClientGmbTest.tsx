
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Search, AlertCircle, CheckCircle, Globe } from 'lucide-react';
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
    
    try {
      const profileData = await extractGmbData(clientWebsite, false);
      
      if (profileData) {
        setBusinessProfile(profileData);
        
        if (onProfileUpdate) {
          onProfileUpdate(profileData);
        }
        
        toast.success('Perfil analizado correctamente');
      } else {
        setError('No se pudo extraer información');
        toast.error('Error al analizar perfil');
      }
    } catch (error: any) {
      setError(error.message || 'Error al analizar perfil');
      toast.error('Error al analizar perfil');
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
    
    try {
      const profileData = await extractBusinessInfo(businessUrl);
      
      if (profileData) {
        setBusinessProfile(profileData);
        
        if (onProfileUpdate) {
          onProfileUpdate(profileData);
        }
        
        toast.success('Perfil analizado correctamente');
      } else {
        setError('No se pudo extraer información');
        toast.error('Error al analizar perfil');
      }
    } catch (error: any) {
      setError(error.message || 'Error al analizar perfil');
      toast.error('Error al analizar perfil');
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
          <div className="mt-4 p-4 rounded-md bg-primary/5 border border-primary/10">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Información detectada</h4>
                <ul className="mt-2 space-y-1 text-sm">
                  {businessProfile.businessName && (
                    <li>Nombre: <span className="font-medium">{businessProfile.businessName}</span></li>
                  )}
                  {businessProfile.businessCategory && (
                    <li>Categoría: <span className="font-medium">{businessProfile.businessCategory}</span></li>
                  )}
                  {businessProfile.businessRating !== undefined && (
                    <li>Valoración: <span className="font-medium">{businessProfile.businessRating}/5 ({businessProfile.businessReviewsCount} reseñas)</span></li>
                  )}
                  {businessProfile.businessAddress && (
                    <li>Dirección: <span className="font-medium">{businessProfile.businessAddress}</span></li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientGmbTest;
