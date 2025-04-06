
import { supabase } from '@/integrations/supabase/client';
import { CrawlSettings } from '../types';

/**
 * Save crawl settings for a client
 */
export const saveCrawlSettings = async (clientId: string, settings: CrawlSettings) => {
  // Convert our settings object to match the table schema
  const settingsRecord = {
    client_id: clientId,
    domain: settings.include_urls[0] || '',  // Use the first include URL as domain if available
    max_pages: settings.max_pages,
    exclude_patterns: settings.exclude_urls,
    include_patterns: settings.include_urls,
    respect_robots_txt: settings.respect_robots_txt,
    user_agent: settings.user_agent,
    crawl_sitemap: settings.crawl_sitemap,
    follow_links: settings.follow_links,
    max_depth: settings.max_depth,
    custom_headers: settings.custom_headers as any,
    updated_at: new Date().toISOString()
  };
  
  const { data, error } = await supabase
    .from('seo_crawler_settings')
    .upsert(settingsRecord);
  
  if (error) {
    console.error('Error saving crawl settings:', error);
    throw error;
  }
  
  return data;
};

/**
 * Get crawl settings for a client
 */
export const getCrawlSettings = async (clientId: string): Promise<CrawlSettings | null> => {
  const { data, error } = await supabase
    .from('seo_crawler_settings')
    .select('*')
    .eq('client_id', clientId)
    .single();
  
  if (error && error.code !== 'PGRST116') {  // PGRST116 is "no rows found"
    console.error('Error fetching crawl settings:', error);
    throw error;
  }
  
  if (!data) return null;
  
  // Convert from DB schema to our CrawlSettings interface
  return {
    max_pages: data.max_pages || 100,
    exclude_urls: data.exclude_patterns || [],
    include_urls: data.include_patterns || [],
    respect_robots_txt: data.respect_robots_txt,
    user_agent: data.user_agent,
    crawl_sitemap: data.crawl_sitemap,
    follow_links: data.follow_links,
    max_depth: data.max_depth,
    custom_headers: data.custom_headers || {}
  };
};
