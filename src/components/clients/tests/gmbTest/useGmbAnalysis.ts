
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
  
  const saveToDatabase = async (profileData: any, isSimulatedData: boolean = false) => {
    if (!clientId || isSimulatedData) return;
    
    try {
      // Extract data in the format needed for the database
      const listingData = {
        client_id: clientId,
        title: profileData.businessName,
        address: profileData.businessAddress,
        phone: profileData.businessPhone,
        rating: profileData.businessRating,
        reviews: profileData.businessReviewsCount,
        hours: typeof profileData.businessHours === 'object' ? 
          JSON.stringify(profileData.businessHours) : profileData.businessHours,
        website: profileData.businessWebsite,
        place_id: profileData.businessUrl ? 
          profileData.businessUrl.split('place_id:').pop() : null
      };
      
      // Save to the google_business_listings table
      const { data, error } = await supabase
        .from('google_business_listings')
        .insert(listingData)
        .select();
      
      if (error) {
        console.error('Error saving business listing to database:', error);
        return;
      }
      
      console.log('Business listing saved to database:', data);
    } catch (error) {
      console.error('Error in saveToDatabase:', error);
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
      // First try with ValueSerp for better data
      let profileData = null;
      let extractionMethod = 'valueserp';
      
      try {
        // Use ValueSerp with the client name or domain as the query
        const query = extractDomainFromUrl(clientWebsite);
        profileData = await extractBusinessInfoWithValueSerp(query);
      } catch (valueSerpError) {
        console.error('Error extracting with ValueSerp:', valueSerpError);
        extractionMethod = 'scraper';
        
        // Fallback to original method
        profileData = await extractGmbData(clientWebsite, false);
      }
      
      if (profileData && (profileData.businessName || profileData.businessAddress)) {
        // Ensure businessHours is a proper object
        if (!profileData.businessHours) {
          profileData.businessHours = {};
        } else if (typeof profileData.businessHours === 'string') {
          try {
            profileData.businessHours = JSON.parse(profileData.businessHours);
          } catch (parseError) {
            console.error('Error parsing business hours:', parseError);
            profileData.businessHours = {}; // Fallback to empty object
          }
        }
        
        setBusinessProfile(profileData);
        console.log('Updated GMB Tab with business profile:', profileData);
        
        // Check if the data is from simulation
        const isMockData = profileData.businessName?.includes('ejemplo') || 
                          profileData.businessName === 'Negocio de ejemplo';
                          
        setIsSimulated(isMockData);
        
        // Save to database if not simulated data
        if (!isMockData) {
          await saveToDatabase(profileData);
        }
        
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
        // Ensure businessHours is a proper object or empty object if null/undefined
        if (!profileData.businessHours) {
          profileData.businessHours = {};
        } else if (typeof profileData.businessHours === 'string') {
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
        
        // Save to database if not simulated data
        if (!isMockData) {
          await saveToDatabase(profileData);
        }
        
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
  
  // Helper function to extract domain from URL
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
