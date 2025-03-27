import { supabase } from '@/integrations/supabase/client';
import { getCrawlResult } from './api/crawlQueries';
import { CrawlSettings } from './types';

/**
 * Get the settings for a specific crawl
 */
export async function getCrawlSettings(crawlId: string): Promise<CrawlSettings | null> {
  try {
    const crawl = await getCrawlResult(crawlId);
    
    if (!crawl) {
      throw new Error('Crawl not found');
    }
    
    // If the crawl has custom settings, return them
    if (crawl['settings']) {
      return crawl['settings'] as CrawlSettings;
    }
    
    // Otherwise return default settings
    return getDefaultCrawlSettings();
  } catch (error) {
    console.error('Error fetching crawl settings:', error);
    return null;
  }
}

/**
 * Update the settings for a specific crawl
 */
export async function updateCrawlSettings(crawlId: string, settings: Partial<CrawlSettings>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('seo_crawler_crawls')
      .update({ settings })
      .eq('id', crawlId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating crawl settings:', error);
    return false;
  }
}

/**
 * Get the default crawl settings
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
