
import { supabase } from '@/integrations/supabase/client';
import { CrawlSettings } from '../types';

/**
 * Save settings for a specific domain
 */
export async function saveSettings(domainOrClientId: string, settings: CrawlSettings, isClient: boolean = false): Promise<boolean> {
  try {
    const column = isClient ? 'client_id' : 'domain';
    
    // Check if settings already exist
    const { data: existingSettings } = await supabase
      .from('seo_crawler_settings')
      .select('id')
      .eq(column, domainOrClientId)
      .maybeSingle();
    
    if (existingSettings) {
      // Update existing settings
      const { error } = await supabase
        .from('seo_crawler_settings')
        .update(settings as any)
        .eq('id', existingSettings.id);
      
      if (error) throw error;
    } else {
      // Create new settings
      const insertData = {
        domain: isClient ? '' : domainOrClientId,
        client_id: isClient ? domainOrClientId : null,
        ...settings
      };
      
      const { error } = await supabase
        .from('seo_crawler_settings')
        .insert(insertData);
      
      if (error) throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
}

/**
 * Get settings for a specific domain or client
 */
export async function getSettings(domainOrClientId: string, isClient: boolean = false): Promise<CrawlSettings | null> {
  try {
    const column = isClient ? 'client_id' : 'domain';
    
    const { data, error } = await supabase
      .from('seo_crawler_settings')
      .select('*')
      .eq(column, domainOrClientId)
      .maybeSingle();
    
    if (error) throw error;
    
    if (!data) {
      // Return default settings if none exist
      return {
        max_pages: 100,
        exclude_urls: [],
        include_urls: [],
        respect_robots_txt: true,
        user_agent: 'Mozilla/5.0 (compatible; SEOcrawler/1.0; +https://example.com/bot)',
        crawl_sitemap: true,
        follow_links: true,
        max_depth: 10
      };
    }
    
    // Cast data to CrawlSettings
    return data as unknown as CrawlSettings;
  } catch (error) {
    console.error('Error getting settings:', error);
    return null;
  }
}
