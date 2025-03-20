
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Search, AlertCircle, CheckCircle } from 'lucide-react';
import { extractBusinessInfo } from '@/services/api/businessProfile';
import { toast } from 'sonner';
import { BusinessProfile } from '@/types/report.types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { isValidGoogleBusinessUrl } from '@/services/api/businessProfile/utils';

interface ClientGmbTestProps {
  clientId: string;
  onProfileUpdate?: (profile: Partial<BusinessProfile>) => void;
}

const ClientGmbTest: React.FC<ClientGmbTestProps> = ({ clientId, onProfileUpdate }) => {
  const [businessUrl, setBusinessUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [businessProfile, setBusinessProfile] = useState<Partial<BusinessProfile> | null>(null);
  
  const handleAnalyze = async () => {
    if (!businessUrl.trim()) {
      toast.error('Introduce una URL válida');
      return;
    }
    
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
          Introduce la URL del perfil de Google Business para analizar la información
        </p>
        
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
