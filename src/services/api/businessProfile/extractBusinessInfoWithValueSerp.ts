
import { supabase } from '@/integrations/supabase/client';
import { BusinessProfile } from '@/types/report.types';
import { toast } from 'sonner';
import { simulateBusinessProfileData } from './mocks';
import { extractValueserpData } from './extractValueserpData';

/**
 * Extrae información de negocio utilizando ValueSerp API a través de un edge function
 * @deprecated - Use extractValueserpData instead
 */
export const extractBusinessInfoWithValueSerp = async (
  query: string
): Promise<Partial<BusinessProfile> | null> => {
  console.log(`Calling ValueSerp edge function with query: ${query}`);
  return extractValueserpData(query);
};
