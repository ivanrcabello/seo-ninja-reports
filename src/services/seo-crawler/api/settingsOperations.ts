
import { supabase } from '@/integrations/supabase/client';
import { CrawlSettings } from '../types';

/**
 * Save crawler settings
 */
export async function saveSettings(
  clientId: string, 
  settings: Partial<CrawlSettings>
): Promise<boolean> {
  try {
    // Extract domain from settings or use a default
    const domain = settings.include_urls && settings.include_urls.length > 0 
      ? new URL(settings.include_urls[0]).hostname 
      : 'default-domain.com';
      
    // Create a properly typed custom_headers object
    let customHeaders: Record<string, string> = {};
    
    if (settings.custom_headers && typeof settings.custom_headers === 'object') {
      customHeaders = Object.entries(settings.custom_headers).reduce((acc, [key, value]) => {
        acc[key] = String(value); // Ensure all values are strings
        return acc;
      }, {} as Record<string, string>);
    }
      
    const { error } = await supabase
      .from('seo_crawler_settings')
      .upsert({
        client_id: clientId,
        domain: domain,
        max_pages: settings.max_pages || 100,
        exclude_patterns: settings.exclude_urls || [],
        include_patterns: settings.include_urls || [],
        follow_external_links: settings.follow_links || false,
        respect_robots_txt: settings.respect_robots_txt || true,
        user_agent: settings.user_agent || 'Mozilla/5.0 (compatible; SeoAuditBot/1.0)',
        max_depth: settings.max_depth || 5,
        crawl_sitemap: settings.crawl_sitemap || true,
        custom_headers: customHeaders,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error saving crawler settings:', error);
    return false;
  }
}

/**
 * Get crawler settings for a client
 */
export async function getSettings(
  clientId: string
): Promise<CrawlSettings | null> {
  try {
    const { data, error } = await supabase
      .from('seo_crawler_settings')
      .select('*')
      .eq('client_id', clientId)
      .order('updated_at', { ascending: false })
      .limit(1);

    if (error) throw error;
    
    if (!data || data.length === 0) {
      // No settings found, return default settings
      return {
        max_pages: 100,
        exclude_urls: [],
        include_urls: [],
        respect_robots_txt: true,
        user_agent: 'Mozilla/5.0 (compatible; SeoAuditBot/1.0)',
        crawl_sitemap: true,
        follow_links: true,
        max_depth: 5
      };
    }
    
    // Convert from DB format to the CrawlSettings format
    return {
      max_pages: data[0].max_pages,
      exclude_urls: data[0].exclude_patterns || [],
      include_urls: data[0].include_patterns || [],
      respect_robots_txt: data[0].respect_robots_txt,
      user_agent: data[0].user_agent,
      crawl_sitemap: data[0].crawl_sitemap,
      follow_links: data[0].follow_external_links,
      max_depth: data[0].max_depth,
      custom_headers: data[0].custom_headers || {}
    };
  } catch (error) {
    console.error('Error fetching crawler settings:', error);
    return null;
  }
}
