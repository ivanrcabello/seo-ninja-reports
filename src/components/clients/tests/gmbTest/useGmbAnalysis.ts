import { useState } from 'react';
import { extractBusinessInfo } from '@/services/api/businessProfile';
import { extractGmbData } from '@/services/api/businessProfile/extractGmbData';
import { extractBusinessInfoWithValueSerp } from '@/services/api/businessProfile/extractBusinessInfoWithValueSerp';
import { isValidGoogleBusinessUrl } from '@/services/api/businessProfile/utils';
import { BusinessProfile } from '@/types/report.types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface UseGmbAnalysisProps {
  clientId: string;
  clientWebsite?: string;
  onProfileUpdate?: (profile: Partial<BusinessProfile>) => void;
}

export const useGmbAnalysis = ({ clientId, clientWebsite, onProfileUpdate }: UseGmbAnalysisProps) => {
  const [businessUrl, setBusinessUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [businessProfile, setBusinessProfile] = useState<Partial<BusinessProfile> | null>(null);
  const [useWebsite, setUseWebsite] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);
  
  const handleAnalyze = async () => {
    if (useWebsite && clientWebsite) {
      await analyzeWithWebsite();
    } else if (businessUrl.trim()) {
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
      let profileData = null;
      let extractionMethod = 'valueserp';
      
      try {
        const query = extractDomainFromUrl(clientWebsite);
        console.log(`Using clientId: ${clientId} for ValueSerp query`);
        profileData = await extractBusinessInfoWithValueSerp(query);
      } catch (valueSerpError) {
        console.error('Error extracting with ValueSerp:', valueSerpError);
        extractionMethod = 'scraper';
        
        profileData = await extractGmbData(clientWebsite, false);
      }
      
      if (profileData && (profileData.businessName || profileData.businessAddress)) {
        if (!profileData.businessHours) {
          profileData.businessHours = {};
        } else if (typeof profileData.businessHours === 'string') {
          try {
            profileData.businessHours = JSON.parse(profileData.businessHours);
          } catch (parseError) {
            console.error('Error parsing business hours:', parseError);
            profileData.businessHours = {};
          }
        }
        
        setBusinessProfile(profileData);
        console.log('Updated GMB Tab with business profile:', profileData);
        
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
          toast.success('Perfil analizado correctamente', {
            description: `Datos extraídos usando ${extractionMethod === 'valueserp' ? 'ValueSerp API' : 'scraper'}`
          });
        }
      } else {
        const mockData = {
          businessName: 'Negocio de ejemplo',
          businessAddress: 'Dirección de ejemplo',
          businessCategory: 'Categoría de ejemplo',
          businessRating: 4.5,
          businessReviewsCount: 123,
          businessPhone: '+34 123 456 789',
          businessWebsite: clientWebsite,
          businessHours: {}
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
      
      const mockData = {
        businessName: 'Negocio de ejemplo',
        businessAddress: 'Dirección de ejemplo',
        businessCategory: 'Categoría de ejemplo',
        businessRating: 4.5,
        businessReviewsCount: 123,
        businessPhone: '+34 123 456 789',
        businessWebsite: clientWebsite,
        businessHours: {}
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
      let profileData = null;
      
      try {
        profileData = await extractBusinessInfo(businessUrl);
      } catch (extractError) {
        console.error('Error extracting business info:', extractError);
        throw new Error('No se pudo extraer información del perfil');
      }
      
      if (profileData && (profileData.businessName || profileData.businessAddress)) {
        if (!profileData.businessHours) {
          profileData.businessHours = {};
        } else if (typeof profileData.businessHours === 'string') {
          try {
            profileData.businessHours = JSON.parse(profileData.businessHours);
          } catch (parseError) {
            console.error('Error parsing business hours:', parseError);
            profileData.businessHours = {};
          }
        }
        
        setBusinessProfile(profileData);
        
        const isMockData = profileData.businessName?.includes('ejemplo') || 
                          profileData.businessName === 'Negocio de ejemplo';
                          
        setIsSimulated(isMockData);
        
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
        const mockData = {
          businessUrl: businessUrl,
          businessName: 'Negocio de ejemplo',
          businessAddress: 'Dirección de ejemplo',
          businessCategory: 'Categoría de ejemplo',
          businessRating: 4.5,
          businessReviewsCount: 123,
          businessPhone: '+34 123 456 789',
          businessWebsite: 'https://example.com',
          businessHours: {}
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
      
      const mockData = {
        businessUrl: businessUrl,
        businessName: 'Negocio de ejemplo',
        businessAddress: 'Dirección de ejemplo',
        businessCategory: 'Categoría de ejemplo',
        businessRating: 4.5,
        businessReviewsCount: 123,
        businessPhone: '+34 123 456 789',
        businessWebsite: 'https://example.com',
        businessHours: {}
      };
      
      setBusinessProfile(mockData);
      setError(error.message || 'Error al analizar perfil');
      toast.error('Error al analizar perfil');
      setIsSimulated(true);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const extractDomainFromUrl = (url: string): string => {
    try {
      const domain = url.replace(/^https?:\/\//, '').split('/')[0];
      return domain;
    } catch (error) {
      return url;
    }
  };

  return {
    businessUrl,
    setBusinessUrl,
    isAnalyzing,
    error,
    setError,
    businessProfile,
    useWebsite,
    setUseWebsite,
    isSimulated,
    handleAnalyze
  };
};
