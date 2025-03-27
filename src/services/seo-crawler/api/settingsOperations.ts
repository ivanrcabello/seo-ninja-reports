
import { supabase } from '@/integrations/supabase/client';
import { CrawlSettings } from '../types';

/**
 * Update settings for a specific crawl
 */
export async function updateCrawlSettings(
  crawlId: string, 
  settings: Partial<CrawlSettings>
): Promise<boolean> {
  try {
    // Get current settings first
    const { data: currentData, error: fetchError } = await supabase
      .from('seo_crawler_crawls')
      .select('settings')
      .eq('id', crawlId)
      .single();
    
    if (fetchError) {
      console.error('Error fetching current settings:', fetchError);
      throw fetchError;
    }
    
    // Merge the current settings with the new settings
    const currentSettings = currentData.settings as CrawlSettings || getDefaultCrawlSettings();
    const mergedSettings = {
      ...currentSettings,
      ...settings
    };
    
    // Update the crawl settings
    const { error } = await supabase
      .from('seo_crawler_crawls')
      .update({ settings: mergedSettings })
      .eq('id', crawlId);
    
    if (error) {
      console.error('Error updating crawl settings:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating crawl settings:', error);
    return false;
  }
}

/**
 * Get settings for a specific crawl
 */
export async function getCrawlSettings(
  crawlId: string
): Promise<CrawlSettings | null> {
  try {
    const { data, error } = await supabase
      .from('seo_crawler_crawls')
      .select('settings')
      .eq('id', crawlId)
      .single();
    
    if (error) {
      console.error('Error fetching crawl settings:', error);
      throw error;
    }
    
    if (!data || !data.settings) {
      return getDefaultCrawlSettings();
    }
    
    return data.settings as CrawlSettings;
  } catch (error) {
    console.error('Error fetching crawl settings:', error);
    return null;
  }
}

/**
 * Get default crawl settings
 */
export function getDefaultCrawlSettings(): CrawlSettings {
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
