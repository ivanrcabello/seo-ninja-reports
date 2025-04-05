
import { supabase } from '@/integrations/supabase/client';
import { CrawlSettings } from '../types';

/**
 * Save crawl settings for a client domain
 */
export async function saveCrawlSettings(clientId: string, domain: string, settings: Partial<CrawlSettings>): Promise<boolean> {
  try {
    console.log(`Saving crawl settings for domain: ${domain}`);
    
    // Prepare settings object with defaults
    const settingsWithDefaults: CrawlSettings = {
      max_pages: settings.max_pages || 100,
      exclude_urls: settings.exclude_urls || [],
      include_urls: settings.include_urls || [],
      respect_robots_txt: settings.respect_robots_txt !== undefined ? settings.respect_robots_txt : true,
      user_agent: settings.user_agent || 'Mozilla/5.0 (compatible; SeoAuditBot/1.0)',
      crawl_sitemap: settings.crawl_sitemap !== undefined ? settings.crawl_sitemap : true,
      follow_links: settings.follow_links !== undefined ? settings.follow_links : true,
      max_depth: settings.max_depth || 5,
      custom_headers: settings.custom_headers || {}
    };
    
    // Check if settings already exist for this domain and client
    const { data: existingSettings } = await supabase
      .from('seo_crawler_settings')
      .select('id')
      .eq('client_id', clientId)
      .eq('domain', domain)
      .maybeSingle();
    
    if (existingSettings) {
      // Update existing settings
      const { error } = await supabase
        .from('seo_crawler_settings')
        .update({
          ...settingsWithDefaults,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingSettings.id);
        
      if (error) throw error;
    } else {
      // Create new settings
      const { error } = await supabase
        .from('seo_crawler_settings')
        .insert({
          client_id: clientId,
          domain: domain,
          ...settingsWithDefaults,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
      if (error) throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error saving crawl settings:', error);
    return false;
  }
}

/**
 * Get crawl settings for a client domain
 */
export async function getCrawlSettings(clientId: string, domain: string): Promise<CrawlSettings | null> {
  try {
    console.log(`Fetching crawl settings for domain: ${domain}`);
    
    const { data, error } = await supabase
      .from('seo_crawler_settings')
      .select('*')
      .eq('client_id', clientId)
      .eq('domain', domain)
      .maybeSingle();
    
    if (error) {
      console.error('Error from Supabase:', error);
      throw error;
    }
    
    if (!data) {
      console.log('No crawl settings found, returning defaults');
      
      // Return default settings
      return {
        max_pages: 100,
        exclude_urls: [],
        include_urls: [],
        respect_robots_txt: true,
        user_agent: 'Mozilla/5.0 (compatible; SeoAuditBot/1.0)',
        crawl_sitemap: true,
        follow_links: true,
        max_depth: 5,
        custom_headers: {}
      };
    }
    
    // Map database record to our CrawlSettings type
    // Safely convert custom_headers to a Record<string, string>
    const customHeaders = data.custom_headers || {};
    const typedCustomHeaders: Record<string, string> = {};
    
    // Ensure the custom_headers is a valid Record<string, string>
    if (typeof customHeaders === 'object' && customHeaders !== null) {
      Object.keys(customHeaders).forEach(key => {
        const value = (customHeaders as any)[key];
        if (typeof value === 'string') {
          typedCustomHeaders[key] = value;
        } else if (value !== null && value !== undefined) {
          typedCustomHeaders[key] = String(value);
        }
      });
    }

    return {
      max_pages: data.max_pages || 100,
      exclude_urls: data.exclude_patterns || [],
      include_urls: data.include_patterns || [],
      respect_robots_txt: data.respect_robots_txt !== undefined ? data.respect_robots_txt : true,
      user_agent: data.user_agent || 'Mozilla/5.0 (compatible; SeoAuditBot/1.0)',
      crawl_sitemap: data.crawl_sitemap !== undefined ? data.crawl_sitemap : true,
      follow_links: data.follow_links !== undefined ? data.follow_links : true,
      max_depth: data.max_depth || 5,
      custom_headers: typedCustomHeaders
    };
  } catch (error) {
    console.error('Error fetching crawl settings:', error);
    return null;
  }
}
