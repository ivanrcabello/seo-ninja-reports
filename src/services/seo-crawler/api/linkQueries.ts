
import { supabase } from '@/integrations/supabase/client';
import { CrawlLink } from '../types';

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
    
    return (data || []).map((link: any) => ({
      id: link.id,
      crawl_id: link.crawl_id,
      page_id: link.page_id,
      url: link.url,
      text: link.anchor_text || 'Sin texto ancla', // Map to the standard property
      anchor_text: link.anchor_text || 'Sin texto ancla', // Keep the alias
      is_internal: link.is_internal,
      is_followed: !!link.follow, // Map from follow to is_followed
      follow: link.follow, // Keep the original property
      is_broken: link.is_broken,
      status_code: link.status_code,
      rel_attributes: link.rel_attributes,
      created_at: link.created_at || new Date().toISOString(),
      // Additional properties that might be accessed
      nofollow: !link.follow,
      link_location: link.link_location,
      link_text: link.link_text,
      link_type: link.link_type
    }));
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
    
    return (data || []).map((link: any) => ({
      id: link.id,
      crawl_id: link.crawl_id,
      page_id: link.page_id,
      url: link.url,
      text: link.anchor_text || 'Sin texto ancla', // Map to the standard property
      anchor_text: link.anchor_text || 'Sin texto ancla', // Keep the alias
      is_internal: link.is_internal,
      is_followed: !!link.follow, // Map from follow to is_followed
      follow: link.follow, // Keep the original property
      is_broken: link.is_broken,
      status_code: link.status_code,
      rel_attributes: link.rel_attributes,
      created_at: link.created_at || new Date().toISOString(),
      // Additional properties that might be accessed
      nofollow: !link.follow,
      link_location: link.link_location,
      link_text: link.link_text,
      link_type: link.link_type
    }));
  } catch (error) {
    console.error('Error fetching crawl links:', error);
    return [];
  }
}
