
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Store, AlertCircle, Check, Search } from 'lucide-react';
import { toast } from 'sonner';
import { extractBusinessInfo } from '@/services/reportService';
import { BusinessProfile } from '@/types/report.types';

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
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusinessUrl(e.target.value);
  };
  
  const isValidUrl = (url: string) => {
    try {
      // Verificar si es una URL de Google Maps o Business
      const urlObj = new URL(url);
      return urlObj.hostname.includes('google') && 
        (urlObj.pathname.includes('/maps') || url.includes('business.google.com'));
    } catch (e) {
      return false;
    }
  };
  
  const analyzeBusinessUrl = async () => {
    if (!businessUrl) {
      toast.error('Introduce una URL válida');
      return;
    }
    
    if (!isValidUrl(businessUrl)) {
      toast.error('La URL debe ser de Google Maps o Google Business');
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const profileData = await extractBusinessInfo(businessUrl);
      
      if (profileData) {
        setBusinessProfile(profileData);
        toast.success('Información extraída correctamente');
      }
    } catch (error: any) {
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
          placeholder="https://business.google.com/..."
          className="flex-1"
        />
        <Button 
          onClick={analyzeBusinessUrl} 
          disabled={isAnalyzing || !businessUrl}
          variant="secondary"
        >
          {isAnalyzing ? (
            <>Analizando<span className="loading ml-2">...</span></>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Analizar
            </>
          )}
        </Button>
      </div>
      
      {businessProfile && (
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-start gap-3">
            <div className="bg-green-500/20 p-1.5 rounded-full mt-0.5">
              <Check className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-md">Información detectada</h4>
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
            </div>
          </div>
        </Card>
      )}
      
      <div className="text-sm flex items-start gap-2 mt-2 text-amber-600 dark:text-amber-400">
        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <p>
          La información se extraerá de forma simulada para esta demostración. 
          Para extraer datos reales se necesitaría integrar con una API externa.
        </p>
      </div>
    </div>
  );
};

export default BusinessUrlInput;
