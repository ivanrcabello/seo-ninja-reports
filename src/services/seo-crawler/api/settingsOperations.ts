
import { supabase } from '@/integrations/supabase/client';
import { CrawlSettings } from '../types';

/**
 * Get crawl settings for a given client
 */
export async function getCrawlSettings(
  clientId: string,
  domain?: string
): Promise<CrawlSettings> {
  try {
    console.log(`Fetching crawl settings for client: ${clientId}`);
    
    // Query parameters
    const queryParams: any = { client_id: clientId };
    if (domain) {
      queryParams.domain = domain;
    }
    
    const { data, error } = await supabase
      .from('seo_crawler_settings')
      .select('*')
      .match(queryParams)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.log(`No settings found for client ${clientId}, returning defaults`);
        // Settings not found, return default settings
        return getDefaultSettings();
      }
      throw error;
    }
    
    // Ensure custom_headers is an object even if it's null or another type in the database
    const customHeaders: Record<string, string> = typeof data.custom_headers === 'object' && data.custom_headers !== null 
      ? data.custom_headers as Record<string, string>
      : {};
    
    return {
      max_pages: data.max_pages,
      respect_robots_txt: data.respect_robots_txt,
      user_agent: data.user_agent,
      exclude_urls: data.exclude_patterns || [],
      include_urls: data.include_patterns || [],
      follow_links: data.follow_links,
      crawl_sitemap: data.crawl_sitemap,
      max_depth: data.max_depth,
      custom_headers: customHeaders
    };
  } catch (error) {
    console.error('Error fetching crawl settings:', error);
    // In case of error, return default settings
    return getDefaultSettings();
  }
}

/**
 * Get default crawl settings
 */
function getDefaultSettings(): CrawlSettings {
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

/**
 * Save crawl settings for a given client
 */
export async function saveCrawlSettings(
  clientId: string,
  domain: string,
  settings: Partial<CrawlSettings>
): Promise<{ success: boolean; message: string }> {
  try {
    console.log(`Saving crawl settings for client: ${clientId}, domain: ${domain}`);
    
    // First check if settings already exist
    const { data: existingSettings, error: queryError } = await supabase
      .from('seo_crawler_settings')
      .select('id')
      .eq('client_id', clientId)
      .eq('domain', domain)
      .maybeSingle();
    
    if (queryError && queryError.code !== 'PGRST116') {
      throw queryError;
    }
    
    // Ensure custom_headers is a valid object
    const customHeaders: Record<string, string> = {};
    if (settings.custom_headers && typeof settings.custom_headers === 'object') {
      Object.entries(settings.custom_headers).forEach(([key, value]) => {
        if (typeof value === 'string') {
          customHeaders[key] = value;
        }
      });
    }
    
    // Settings to save
    const settingsToSave = {
      client_id: clientId,
      domain,
      max_pages: settings.max_pages || 100,
      exclude_patterns: settings.exclude_urls || [],
      include_patterns: settings.include_urls || [],
      respect_robots_txt: settings.respect_robots_txt !== undefined ? settings.respect_robots_txt : true,
      user_agent: settings.user_agent || 'Mozilla/5.0 (compatible; SeoAuditBot/1.0)',
      crawl_sitemap: settings.crawl_sitemap !== undefined ? settings.crawl_sitemap : true,
      follow_links: settings.follow_links !== undefined ? settings.follow_links : true,
      max_depth: settings.max_depth || 5,
      custom_headers: customHeaders
    };
    
    let result;
    
    // Update or insert settings
    if (existingSettings?.id) {
      // Update existing settings
      const { error: updateError } = await supabase
        .from('seo_crawler_settings')
        .update(settingsToSave)
        .eq('id', existingSettings.id);
      
      if (updateError) throw updateError;
      
      result = { success: true, message: 'Configuración de análisis actualizada correctamente' };
    } else {
      // Insert new settings
      const { error: insertError } = await supabase
        .from('seo_crawler_settings')
        .insert(settingsToSave);
      
      if (insertError) throw insertError;
      
      result = { success: true, message: 'Configuración de análisis guardada correctamente' };
    }
    
    return result;
  } catch (error) {
    console.error('Error saving crawl settings:', error);
    return {
      success: false,
      message: `Error al guardar la configuración: ${error.message}`
    };
  }
}
