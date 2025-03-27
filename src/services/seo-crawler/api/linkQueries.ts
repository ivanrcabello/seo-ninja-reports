
import { supabase } from '@/integrations/supabase/client';
import { CrawlLink } from '../types';
import { mapApiLinkToCrawlLink } from './mappers';

/**
 * Get all links for a specific page
 */
export async function getPageLinks(pageId: string): Promise<CrawlLink[]> {
  try {
    console.log(`Fetching links for page ID: ${pageId}`);
    const { data, error } = await supabase
      .from('seo_crawler_links')
      .select('*')
      .eq('page_id', pageId);

    if (error) {
      console.error('Error from Supabase:', error);
      throw error;
    }
    
    console.log(`Found ${data?.length || 0} links for page ${pageId}`);
    
    return (data || []).map(mapApiLinkToCrawlLink);
  } catch (error) {
    console.error('Error fetching page links:', error);
    return [];
  }
}

/**
 * Get all links for a specific crawl
 */
export async function getCrawlLinks(crawlId: string): Promise<CrawlLink[]> {
  try {
    console.log(`Fetching all links for crawl ID: ${crawlId}`);
    const { data, error } = await supabase
      .from('seo_crawler_links')
      .select('*')
      .eq('crawl_id', crawlId);

    if (error) {
      console.error('Error from Supabase:', error);
      throw error;
    }
    
    console.log(`Found ${data?.length || 0} links for crawl ${crawlId}`);
    
    return (data || []).map(mapApiLinkToCrawlLink);
  } catch (error) {
    console.error('Error fetching crawl links:', error);
    return [];
  }
}
