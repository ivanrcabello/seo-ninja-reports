
import { supabase } from '@/integrations/supabase/client';

/**
 * Save crawl settings for a client
 */
export const saveCrawlSettings = async (clientId: string, settings: any) => {
  const { data, error } = await supabase
    .from('seo_crawler_settings')
    .upsert({
      client_id: clientId,
      settings: settings,
      updated_at: new Date().toISOString()
    });
  
  if (error) {
    console.error('Error saving crawl settings:', error);
    throw error;
  }
  
  return data;
};

/**
 * Get crawl settings for a client
 */
export const getCrawlSettings = async (clientId: string) => {
  const { data, error } = await supabase
    .from('seo_crawler_settings')
    .select('settings')
    .eq('client_id', clientId)
    .single();
  
  if (error && error.code !== 'PGRST116') {  // PGRST116 is "no rows found"
    console.error('Error fetching crawl settings:', error);
    throw error;
  }
  
  return data?.settings || null;
};
