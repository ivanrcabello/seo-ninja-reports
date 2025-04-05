
import { supabase } from '@/integrations/supabase/client';
import { CrawlSettings } from '../types';

/**
 * Save crawler settings for a specific domain and client
 */
export async function saveCrawlSettings(
  clientId: string,
  domain: string,
  settings: Partial<CrawlSettings>
): Promise<{ success: boolean; message: string; id?: string }> {
  try {
    // Default settings
    const defaultSettings: CrawlSettings = {
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

    // Merge with user settings
    const mergedSettings: CrawlSettings = {
      ...defaultSettings,
      ...settings
    };

    // Ensure arrays are valid
    mergedSettings.exclude_urls = mergedSettings.exclude_urls || [];
    mergedSettings.include_urls = mergedSettings.include_urls || [];
    mergedSettings.custom_headers = mergedSettings.custom_headers || {};

    console.log('Saving crawler settings:', { clientId, domain, settings: mergedSettings });

    // Check if settings already exist for this domain
    const { data: existingSettings } = await supabase
      .from('seo_crawler_settings')
      .select('id')
      .eq('client_id', clientId)
      .eq('domain', domain)
      .maybeSingle();

    let result;

    if (existingSettings) {
      // Update existing settings
      const { data, error } = await supabase
        .from('seo_crawler_settings')
        .update({
          max_pages: mergedSettings.max_pages,
          exclude_patterns: mergedSettings.exclude_urls,
          include_patterns: mergedSettings.include_urls,
          respect_robots_txt: mergedSettings.respect_robots_txt,
          user_agent: mergedSettings.user_agent,
          crawl_sitemap: mergedSettings.crawl_sitemap,
          follow_links: mergedSettings.follow_links,
          follow_external_links: false, // Default value
          max_depth: mergedSettings.max_depth,
          custom_headers: mergedSettings.custom_headers as Record<string, string>,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingSettings.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Create new settings
      const { data, error } = await supabase
        .from('seo_crawler_settings')
        .insert({
          client_id: clientId,
          domain: domain,
          max_pages: mergedSettings.max_pages,
          exclude_patterns: mergedSettings.exclude_urls,
          include_patterns: mergedSettings.include_urls,
          respect_robots_txt: mergedSettings.respect_robots_txt,
          user_agent: mergedSettings.user_agent,
          crawl_sitemap: mergedSettings.crawl_sitemap,
          follow_links: mergedSettings.follow_links,
          follow_external_links: false, // Default value
          max_depth: mergedSettings.max_depth,
          custom_headers: mergedSettings.custom_headers as Record<string, string>,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return {
      success: true,
      message: 'Settings saved successfully',
      id: result.id
    };
  } catch (error) {
    console.error('Error saving crawler settings:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Get saved crawler settings for a specific domain
 */
export async function getCrawlSettings(
  domain: string
): Promise<CrawlSettings | null> {
  try {
    console.log(`Fetching crawler settings for domain: ${domain}`);

    const { data, error } = await supabase
      .from('seo_crawler_settings')
      .select('*')
      .eq('domain', domain)
      .maybeSingle();

    if (error) {
      console.error('Error fetching crawler settings:', error);
      throw error;
    }

    if (!data) {
      console.log(`No settings found for domain ${domain}`);
      return null;
    }

    // Map database record to CrawlSettings type
    return {
      max_pages: data.max_pages || 100,
      exclude_urls: data.exclude_patterns || [],
      include_urls: data.include_patterns || [],
      respect_robots_txt: data.respect_robots_txt !== undefined ? data.respect_robots_txt : true,
      user_agent: data.user_agent || 'Mozilla/5.0 (compatible; SeoAuditBot/1.0)',
      crawl_sitemap: data.crawl_sitemap !== undefined ? data.crawl_sitemap : true,
      follow_links: data.follow_links !== undefined ? data.follow_links : true,
      max_depth: data.max_depth || 5,
      custom_headers: data.custom_headers as Record<string, string> || {}
    };
  } catch (error) {
    console.error('Error fetching crawler settings:', error);
    return null;
  }
}
