
import { supabase } from '@/integrations/supabase/client';
import { CrawlSettings, SavedCrawlSettings } from './types';

// Get saved crawl settings for a client
export const getSettings = async (clientId: string): Promise<SavedCrawlSettings | null> => {
  try {
    const { data, error } = await supabase
      .from('seo_crawl_settings')
      .select('*')
      .eq('client_id', clientId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();
      
    if (error) {
      // If no settings found, return null instead of throwing error
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }
    
    return data as SavedCrawlSettings;
  } catch (error) {
    console.error("Error retrieving crawl settings:", error);
    return null;
  }
};

// Save crawl settings for a client
export const saveSettings = async (settings: CrawlSettings): Promise<SavedCrawlSettings | null> => {
  try {
    // First check if settings already exist
    const { data: existingSettings, error: checkError } = await supabase
      .from('seo_crawl_settings')
      .select('id')
      .eq('client_id', settings.clientId)
      .eq('domain', settings.url)
      .limit(1);
      
    if (checkError) throw checkError;
    
    // Prepare data for insert/update
    const dataToSave = {
      client_id: settings.clientId,
      domain: settings.url,
      max_pages: settings.maxPages || 100,
      follow_external_links: settings.followExternalLinks || false,
      exclude_patterns: settings.excludePatterns || [],
      include_patterns: settings.includePatterns || [],
      updated_at: new Date().toISOString()
    };
    
    let result;
    
    // Update if exists, insert if not
    if (existingSettings && existingSettings.length > 0) {
      const { data, error } = await supabase
        .from('seo_crawl_settings')
        .update(dataToSave)
        .eq('id', existingSettings[0].id)
        .select();
        
      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await supabase
        .from('seo_crawl_settings')
        .insert({
          ...dataToSave,
          created_at: new Date().toISOString()
        })
        .select();
        
      if (error) throw error;
      result = data;
    }
    
    return result[0] as SavedCrawlSettings;
  } catch (error) {
    console.error("Error saving crawl settings:", error);
    throw error;
  }
};
