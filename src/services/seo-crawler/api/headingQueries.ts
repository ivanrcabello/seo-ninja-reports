
import { supabase } from '@/integrations/supabase/client';
import { CrawlHeading } from '../types';

/**
 * Get headings for a specific page
 */
export async function getPageHeadings(pageId: string): Promise<CrawlHeading[]> {
  try {
    console.log(`Fetching headings for page ID: ${pageId}`);
    
    const { data, error } = await supabase
      .rpc('get_page_headings', { page_id_param: pageId });
    
    if (error) {
      console.error('Error from Supabase RPC get_page_headings:', error);
      throw error;
    }
    
    return (data || []).map(heading => ({
      id: heading.id,
      crawl_id: heading.crawl_id,
      page_id: heading.page_id,
      page_url: heading.page_url,
      heading_type: heading.heading_type,
      content: heading.content,
      position: heading.heading_position,
      created_at: new Date().toISOString() // Add default since it's expected by the type
    }));
  } catch (error) {
    console.error('Error fetching page headings:', error);
    return [];
  }
}

/**
 * Get all headings for a crawl
 */
export async function getCrawlHeadings(crawlId: string): Promise<CrawlHeading[]> {
  try {
    console.log(`Fetching all headings for crawl ID: ${crawlId}`);
    
    const { data, error } = await supabase
      .rpc('get_crawl_headings', { crawl_id_param: crawlId });
    
    if (error) {
      console.error('Error from Supabase RPC get_crawl_headings:', error);
      throw error;
    }
    
    return (data || []).map(heading => ({
      id: heading.id,
      crawl_id: heading.crawl_id,
      page_id: heading.page_id,
      page_url: heading.page_url,
      heading_type: heading.heading_type,
      content: heading.content,
      position: heading.heading_position,
      created_at: new Date().toISOString() // Add default since it's expected by the type
    }));
  } catch (error) {
    console.error('Error fetching crawl headings:', error);
    return [];
  }
}
