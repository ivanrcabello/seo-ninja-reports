
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
      .select('id')
      .eq('client_id', clientId)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing settings:', checkError);
      throw checkError;
    }
    
    if (existingSettings) {
      // Update existing settings
      const { error: updateError } = await supabase
        .from('seo_crawler_settings')
        .update(settings)
        .eq('id', existingSettings.id);
      
      if (updateError) throw updateError;
      
    } else {
      // Create new settings
      const { error: insertError } = await supabase
        .from('seo_crawler_settings')
        .insert({
          client_id: clientId,
          ...settings
        });
      
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
