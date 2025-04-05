
import { supabase } from '@/integrations/supabase/client';
import { CrawlSettings } from '../types';

/**
 * Save crawler settings for a client
 */
export async function saveCrawlSettings(
  clientId: string, 
  settings: Partial<CrawlSettings>
): Promise<boolean> {
  try {
    console.log(`Saving crawler settings for client ID: ${clientId}`);
    console.log('Settings:', settings);
    
    // Check if settings already exist for this client
    const { data: existingSettings, error: checkError } = await supabase
      .from('seo_crawler_settings')
      .select('id, domain')
      .eq('client_id', clientId)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing settings:', checkError);
      throw checkError;
    }
    
    // Make sure we have the domain for new settings
    let domain = '';
    
    // Get domain from existing settings or extract from URL in settings
    if (existingSettings && existingSettings.domain) {
      domain = existingSettings.domain;
    } else if (settings.include_urls && settings.include_urls.length > 0) {
      // Try to extract domain from first include URL
      try {
        const url = new URL(settings.include_urls[0]);
        domain = url.hostname;
      } catch (e) {
        console.error('Error extracting domain from URL:', e);
        return false;
      }
    }
    
    // Extract the specific settings for our database schema
    const dbSettings = {
      client_id: clientId,
      max_pages: settings.max_pages,
      exclude_patterns: settings.exclude_urls, // Map to DB field
      include_patterns: settings.include_urls, // Map to DB field
      respect_robots_txt: settings.respect_robots_txt,
      user_agent: settings.user_agent,
      crawl_sitemap: settings.crawl_sitemap,
      follow_links: settings.follow_links,
      follow_external_links: false, // Default value
      max_depth: settings.max_depth,
      custom_headers: settings.custom_headers || {},
      domain: domain // Required field
    };
    
    if (existingSettings) {
      // Update existing settings
      const { error: updateError } = await supabase
        .from('seo_crawler_settings')
        .update(dbSettings)
        .eq('id', existingSettings.id);
      
      if (updateError) throw updateError;
      
    } else {
      // Create new settings (making sure we have domain set)
      if (!domain) {
        console.error('Domain is required for new settings');
        return false;
      }
      
      const { error: insertError } = await supabase
        .from('seo_crawler_settings')
        .insert(dbSettings);
      
      if (insertError) throw insertError;
    }
    
    return true;
  } catch (error) {
    console.error('Error saving crawler settings:', error);
    return false;
  }
}

/**
 * Get crawler settings for a client
 */
export async function getCrawlSettings(clientId: string): Promise<CrawlSettings | null> {
  try {
    console.log(`Getting crawler settings for client ID: ${clientId}`);
    
    const { data, error } = await supabase
      .from('seo_crawler_settings')
      .select('*')
      .eq('client_id', clientId)
      .single();
    
    if (error) {
      // If no settings found, return default settings
      if (error.code === 'PGRST116') {
        console.log('No settings found, returning defaults');
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
      
      console.error('Error getting crawler settings:', error);
      throw error;
    }
    
    // Convert database fields to our API model
    return {
      max_pages: data.max_pages || 100,
      exclude_urls: data.exclude_patterns || [],
      include_urls: data.include_patterns || [],
      respect_robots_txt: data.respect_robots_txt !== false,
      user_agent: data.user_agent || 'Mozilla/5.0 (compatible; SeoAuditBot/1.0)',
      crawl_sitemap: data.crawl_sitemap !== false,
      follow_links: data.follow_links !== false,
      max_depth: data.max_depth || 5,
      custom_headers: data.custom_headers || {}
    };
    
  } catch (error) {
    console.error('Error getting crawler settings:', error);
    return null;
  }
}

/**
 * Delete a crawl record
 */
export async function deleteCrawlRecord(crawlId: string): Promise<boolean> {
  try {
    console.log(`Deleting crawl record with ID: ${crawlId}`);
    
    // First delete related records in child tables
    const childTables = [
      'seo_crawler_links',
      'seo_crawler_issues',
      'seo_crawler_headings',
      'seo_crawler_pages'
    ];
    
    for (const table of childTables) {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('crawl_id', crawlId);
      
      if (error) {
        console.error(`Error deleting records from ${table}:`, error);
        // Continue with other tables even if one fails
      }
    }
    
    // Then delete the main crawl record
    const { error } = await supabase
      .from('seo_crawler_crawls')
      .delete()
      .eq('id', crawlId);
    
    if (error) {
      console.error('Error deleting crawl record:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteCrawlRecord:', error);
    return false;
  }
}
