
import { supabase } from '@/integrations/supabase/client';
import { CrawlSettings } from '../types';

/**
 * Get settings for a specific crawl
 */
export async function getCrawlSettings(crawlId: string): Promise<CrawlSettings | null> {
  try {
    const { data, error } = await supabase
      .from('seo_crawler_crawls')
      .select('settings')
      .eq('id', crawlId)
      .single();
    
    if (error) {
      console.error('Error getting crawl settings:', error);
      return null;
    }
    
    // Ensure settings has all required fields and convert any unknown fields
    const settings = data.settings || {};
    
    return {
      max_pages: settings.max_pages || 100,
      exclude_urls: settings.exclude_urls || [],
      include_urls: settings.include_urls || [],
      respect_robots_txt: settings.respect_robots_txt === false ? false : true,
      user_agent: settings.user_agent || 'Mozilla/5.0 (compatible; SeoAuditBot/1.0)',
      crawl_sitemap: settings.crawl_sitemap === false ? false : true,
      follow_links: settings.follow_links === false ? false : true,
      max_depth: settings.max_depth || 5,
      custom_headers: settings.custom_headers && typeof settings.custom_headers === 'object' 
        ? settings.custom_headers as Record<string, string>
        : {}
    };
  } catch (error) {
    console.error('Error in getCrawlSettings:', error);
    return null;
  }
}

/**
 * Save settings for a new or existing crawl
 */
export async function saveCrawlSettings(
  settings: Partial<CrawlSettings>,
  clientId: string,
  crawlId?: string
): Promise<string | null> {
  try {
    // Format settings to match database expectations
    const formattedSettings = {
      max_pages: settings.max_pages || 100,
      exclude_urls: settings.exclude_urls || [],
      include_urls: settings.include_urls || [],
      respect_robots_txt: settings.respect_robots_txt === false ? false : true,
      user_agent: settings.user_agent || 'Mozilla/5.0 (compatible; SeoAuditBot/1.0)',
      crawl_sitemap: settings.crawl_sitemap === false ? false : true,
      follow_links: settings.follow_links === false ? false : true,
      max_depth: settings.max_depth || 5,
      custom_headers: settings.custom_headers || {}
    };
    
    if (crawlId) {
      // Update existing crawl settings
      const { error } = await supabase
        .from('seo_crawler_crawls')
        .update({
          settings: formattedSettings,
          updated_at: new Date().toISOString()
        })
        .eq('id', crawlId);
      
      if (error) {
        console.error('Error updating crawl settings:', error);
        return null;
      }
      
      return crawlId;
    } else {
      // Create new crawl settings record with a domain
      // Extract domain from settings or use a default
      let domain = '';
      
      // Try to get domain from URL in the settings
      if (settings.include_urls && settings.include_urls.length > 0) {
        try {
          const url = new URL(settings.include_urls[0]);
          domain = url.hostname;
        } catch (error) {
          console.error('Error extracting domain from URL:', error);
        }
      }
      
      if (!domain) {
        throw new Error('No valid domain could be determined from settings');
      }
      
      const { data, error } = await supabase
        .from('seo_crawler_settings')
        .insert({
          client_id: clientId,
          domain: domain,
          settings: formattedSettings
        })
        .select('id')
        .single();
      
      if (error) {
        console.error('Error creating crawl settings:', error);
        return null;
      }
      
      return data.id;
    }
  } catch (error) {
    console.error('Error in saveCrawlSettings:', error);
    return null;
  }
}

/**
 * Get all settings for a client
 */
export async function getClientSettings(clientId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('seo_crawler_settings')
      .select('*')
      .eq('client_id', clientId);
    
    if (error) {
      console.error('Error getting client settings:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getClientSettings:', error);
    return [];
  }
}

/**
 * Delete settings by ID
 */
export async function deleteSettings(settingsId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('seo_crawler_settings')
      .delete()
      .eq('id', settingsId);
    
    if (error) {
      console.error('Error deleting settings:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteSettings:', error);
    return false;
  }
}
