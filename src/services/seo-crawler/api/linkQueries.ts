
import { supabase } from '@/integrations/supabase/client';
import { CrawlLink } from '../types';
import { debugLinksData } from './debugUtils';

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
    
    // Debug links data to identify structure issues
    debugLinksData(data);
    
    // Map to our CrawlLink type with the required fields
    return (data || []).map(link => ({
      id: link.id,
      crawl_id: link.crawl_id,
      page_id: link.page_id,
      url: link.url,
      text: link.anchor_text || link.link_text || '', // Original required property
      anchor_text: link.anchor_text || link.link_text || '',
      is_internal: link.is_internal || false,
      is_followed: link.follow !== false, // Convert from follow to is_followed
      is_broken: link.is_broken || false,
      status_code: link.status_code || 0,
      follow: link.follow !== false,
      rel_attributes: link.rel_attributes || [],
      nofollow: !link.follow,
      link_location: link.link_location || '',
      link_text: link.link_text || '',
      link_type: link.link_type || '',
      created_at: new Date().toISOString() // Default since it's not in the database
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
    
    // Debug links data to identify structure issues
    debugLinksData(data);
    
    // Map to our CrawlLink type with the required fields
    return (data || []).map(link => ({
      id: link.id,
      crawl_id: link.crawl_id,
      page_id: link.page_id,
      url: link.url,
      text: link.anchor_text || link.link_text || '', // Original required property
      anchor_text: link.anchor_text || link.link_text || '',
      is_internal: link.is_internal || false,
      is_followed: link.follow !== false, // Convert from follow to is_followed
      is_broken: link.is_broken || false,
      status_code: link.status_code || 0,
      follow: link.follow !== false,
      rel_attributes: link.rel_attributes || [],
      nofollow: !link.follow,
      link_location: link.link_location || '',
      link_text: link.link_text || '',
      link_type: link.link_type || '',
      created_at: new Date().toISOString() // Default since it's not in the database
    }));
  } catch (error) {
    console.error('Error fetching crawl links:', error);
    return [];
  }
}
