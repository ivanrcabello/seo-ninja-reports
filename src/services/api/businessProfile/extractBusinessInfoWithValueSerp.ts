
import { BusinessProfile } from '@/types/report.types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { simulateBusinessProfileData } from './mocks';

/**
 * Extract business information using ValueSerp API
 */
export const extractBusinessInfoWithValueSerp = async (
  query: string,
  clientId?: string
): Promise<Partial<BusinessProfile> | null> => {
  if (!query) {
    toast.error('Invalid query');
    return null;
  }

  try {
    console.log(`Extracting business info with ValueSerp: "${query}" for clientId: ${clientId || 'not provided'}`);
    toast.info('Consultando ValueSerp API', {
      description: 'Extrayendo datos del negocio...'
    });

    // Get API key from localStorage
    const valueSerpApiKey = localStorage.getItem('value_serp_api_key');

    if (!valueSerpApiKey) {
      console.warn('ValueSerp API key not found in localStorage');
      toast.error('API key de ValueSerp no configurada', {
        description: 'Configure la API key en Ajustes > Integraciones'
      });
      return simulateBusinessProfileData(query);
    }

    console.log('Calling ValueSerp edge function...');
    
    // Call the edge function with query
    const { data, error } = await supabase.functions.invoke('valueserp-business', {
      body: {
        query,
        apiKey: valueSerpApiKey,
        clientId,
        saveToDb: true  // Explicitly request to save to database
      }
    });

    if (error) {
      console.error('ValueSerp edge function error:', error);
      throw new Error(`ValueSerp error: ${error.message}`);
    }

    if (!data) {
      console.error('No data received from ValueSerp edge function');
      throw new Error('No data received from ValueSerp');
    }

    console.log('ValueSerp response:', data);

    // If data was saved to database, log it
    if (data.savedToDb) {
      console.log('Business data saved to database:', data.savedToDb);
    }

    // Store raw data in localStorage for debugging
    try {
      localStorage.setItem('valueserp_last_raw_data', JSON.stringify(data.raw_response || data.raw_data || data));
    } catch (e) {
      console.warn('Could not store raw data in localStorage:', e);
    }

    // Process local results if available
    if (data.local_results && data.local_results.length > 0) {
      console.log('Using local_results data from ValueSerp:', data.local_results[0]);
      
      // Use the first local result
      const firstResult = data.local_results[0];
      
      const profileData: Partial<BusinessProfile> = {
        businessName: firstResult.title || '',
        businessAddress: firstResult.address || '',
        businessPhone: firstResult.phone || '',
        businessRating: firstResult.rating ? parseFloat(firstResult.rating) : null,
        businessReviewsCount: firstResult.reviews ? parseInt(firstResult.reviews.toString(), 10) : 0,
        businessWebsite: firstResult.website || '',
        businessHours: firstResult.hours ? { 'Hours': firstResult.hours } : {},
        businessUrl: firstResult.link || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
      };
      
      if (profileData.businessName && profileData.businessName !== 'Negocio de ejemplo') {
        toast.success('Datos de negocio extraídos correctamente');
        console.log('Extracted business profile:', profileData);
        return profileData;
      }
    }

    // Otherwise, use the data field for backward compatibility
    if (data.data && data.data.businessName && data.data.businessName !== 'Negocio de ejemplo') {
      console.log('Using data field from ValueSerp response');
      toast.success('Datos de negocio extraídos correctamente');
      return data.data;
    }

    // If we get to here, no real data was found
    console.warn('No real business data found, using simulated data');
    toast.warning('Usando datos simulados', {
      description: 'No se encontraron datos reales del negocio'
    });
    return simulateBusinessProfileData(query);
  } catch (error: any) {
    console.error('Error extracting business info with ValueSerp:', error);
    toast.error('Error extracting business info', {
      description: error.message || 'Unexpected error'
    });
    return simulateBusinessProfileData(query);
  }
};
