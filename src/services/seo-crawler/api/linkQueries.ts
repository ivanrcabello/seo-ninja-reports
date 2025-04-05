
import { supabase } from '@/integrations/supabase/client';
import { CrawlLink } from '../types';

/**
 * Get links for a specific page
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
    
    // Map the data to our CrawlLink type
    return (data || []).map(link => ({
      id: link.id,
      crawl_id: link.crawl_id,
      page_id: link.page_id,
      url: link.url,
      text: link.anchor_text || link.link_text, // Original property
      anchor_text: link.anchor_text || link.link_text, // Used instead in some places
      is_internal: link.is_internal === undefined ? false : link.is_internal,
      is_followed: link.follow === undefined ? true : link.follow,
      is_broken: link.is_broken === undefined ? false : link.is_broken,
      status_code: link.status_code,
      created_at: new Date().toISOString(),
      
      // Add missing properties
      follow: link.follow === undefined ? true : link.follow,
      rel_attributes: link.rel_attributes || [],
      nofollow: link.nofollow === undefined ? false : link.nofollow,
      link_location: link.link_location || '',
      link_text: link.link_text || link.anchor_text || '',
      link_type: link.link_type || '',
    }));
  } catch (error) {
    console.error('Error fetching page links:', error);
    return [];
  }
}

/**
 * Get all links for a crawl
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
    
    // Map the data to our CrawlLink type
    return (data || []).map(link => ({
      id: link.id,
      crawl_id: link.crawl_id,
      page_id: link.page_id,
      url: link.url,
      text: link.anchor_text || link.link_text, // Original property
      anchor_text: link.anchor_text || link.link_text, // Used instead in some places
      is_internal: link.is_internal === undefined ? false : link.is_internal,
      is_followed: link.follow === undefined ? true : link.follow,
      is_broken: link.is_broken === undefined ? false : link.is_broken,
      status_code: link.status_code,
      created_at: new Date().toISOString(),
      
      // Add missing properties
      follow: link.follow === undefined ? true : link.follow,
      rel_attributes: link.rel_attributes || [],
      nofollow: link.nofollow === undefined ? false : link.nofollow,
      link_location: link.link_location || '',
      link_text: link.link_text || link.anchor_text || '',
      link_type: link.link_type || '',
    }));
  } catch (error) {
    console.error('Error fetching crawl links:', error);
    return [];
  }
}
