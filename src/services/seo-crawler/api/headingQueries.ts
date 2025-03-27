
import { supabase } from '@/integrations/supabase/client';
import { CrawlHeading } from '../types';

/**
 * Get all headings for a specific page
 */
export async function getPageHeadings(pageId: string): Promise<CrawlHeading[]> {
  try {
    console.log(`Fetching headings for page ID: ${pageId}`);
    const { data, error } = await supabase
      .from('seo_crawler_headings')
      .select('*, seo_crawler_pages(url)')
      .eq('page_id', pageId);

    if (error) {
      console.error('Error from Supabase:', error);
      throw error;
    }
    
    console.log(`Found ${data?.length || 0} headings for page ${pageId}`);
    
    return (data || []).map((heading: any) => ({
      id: heading.id,
      crawl_id: heading.crawl_id,
      page_id: heading.page_id,
      page_url: heading.seo_crawler_pages ? heading.seo_crawler_pages.url : '',
      heading_type: heading.heading_type,
      content: heading.content,
      // Map heading_position to position as expected by interface
      position: heading.position || 0,
      // Add required fields for TypeScript compatibility
      created_at: heading.created_at || new Date().toISOString(),
      seo_crawler_pages: {
        url: heading.seo_crawler_pages ? heading.seo_crawler_pages.url : ''
      }
    }));
  } catch (error) {
    console.error('Error fetching page headings:', error);
    return [];
  }
}

/**
 * Get all headings for a specific crawl
 */
export async function getCrawlHeadings(crawlId: string): Promise<CrawlHeading[]> {
  try {
    console.log(`Fetching all headings for crawl ID: ${crawlId}`);
    
    // Try to use the specialized DB function if available
    try {
      const { data: functionData, error: functionError } = await supabase
        .rpc('get_crawl_headings', { crawl_id_param: crawlId });
        
      if (!functionError && functionData && functionData.length > 0) {
        console.log(`Found ${functionData.length} headings using RPC function for crawl ${crawlId}`);
        
        return functionData.map((heading: any) => ({
          id: heading.id,
          crawl_id: heading.crawl_id,
          page_id: heading.page_id,
          page_url: heading.page_url,
          heading_type: heading.heading_type,
          content: heading.content,
          // Map heading_position to position as expected by interface
          position: heading.heading_position || 0,
          // Add required fields for TypeScript compatibility
          created_at: heading.created_at || new Date().toISOString(),
          seo_crawler_pages: {
            url: heading.page_url || ''
          }
        }));
      }
    } catch (rpcError) {
      console.log('RPC function not available, falling back to standard query:', rpcError);
    }
    
    // Fallback to standard query if RPC function fails
    const { data, error } = await supabase
      .from('seo_crawler_headings')
      .select('*, seo_crawler_pages(url)')
      .eq('crawl_id', crawlId);

    if (error) {
      console.error('Error from Supabase:', error);
      throw error;
    }
    
    console.log(`Found ${data?.length || 0} headings for crawl ${crawlId}`);
    
    return (data || []).map((heading: any) => ({
      id: heading.id,
      crawl_id: heading.crawl_id,
      page_id: heading.page_id,
      page_url: heading.seo_crawler_pages ? heading.seo_crawler_pages.url : '',
      heading_type: heading.heading_type,
      content: heading.content,
      // Map heading_position to position as expected by interface
      position: heading.position || 0,
      // Add required fields for TypeScript compatibility
      created_at: heading.created_at || new Date().toISOString(),
      seo_crawler_pages: {
        url: heading.seo_crawler_pages ? heading.seo_crawler_pages.url : ''
      }
    }));
  } catch (error) {
    console.error('Error fetching crawl headings:', error);
    return [];
  }
}
