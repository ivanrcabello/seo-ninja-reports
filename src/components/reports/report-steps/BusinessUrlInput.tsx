
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Store, Check, Search, AlertTriangle } from 'lucide-react';
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
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusinessUrl(e.target.value);
    setHasError(false);
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
    
    try {
      // Use the extractBusinessInfo function to get profile information
      const profileData = await extractBusinessInfo(businessUrl);
      
      if (profileData) {
        setBusinessProfile(profileData);
        console.log('Perfil de negocio extraído:', profileData);
        
        // Check if the data is meaningful
        if (!profileData.businessName && !profileData.businessAddress) {
          toast.warning('Datos limitados obtenidos', {
            description: 'Se han obtenido datos simulados para demostración'
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
      console.error('Error al analizar URL:', error);
      toast.error('Error al analizar URL', {
        description: error.message || 'No se pudo extraer información'
      });
    } finally {
      setIsAnalyzing(false);
    }
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
        <Card className={`p-4 ${hasError ? 'bg-red-50 border-red-200' : 'bg-primary/5 border-primary/20'}`}>
          <div className="flex items-start gap-3">
            <div className={`${hasError ? 'bg-red-500/20' : 'bg-green-500/20'} p-1.5 rounded-full mt-0.5`}>
              {hasError ? 
                <AlertTriangle className="h-4 w-4 text-red-600" /> : 
                <Check className="h-4 w-4 text-green-600" />
              }
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-md">{hasError ? 'Datos limitados' : 'Información detectada'}</h4>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {businessProfile.businessName && (
                  <li>Nombre: <span className="text-foreground">{businessProfile.businessName}</span></li>
                )}
                {businessProfile.businessCategory && (
                  <li>Categoría: <span className="text-foreground">{businessProfile.businessCategory}</span></li>
                )}
                {businessProfile.businessRating !== undefined && (
                  <li>Valoración: <span className="text-foreground">{businessProfile.businessRating}/5 ({businessProfile.businessReviewsCount} reseñas)</span></li>
                )}
                {businessProfile.businessAddress && (
                  <li>Dirección: <span className="text-foreground">{businessProfile.businessAddress}</span></li>
                )}
              </ul>
              {hasError && (
                <p className="mt-2 text-xs text-red-600">
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
