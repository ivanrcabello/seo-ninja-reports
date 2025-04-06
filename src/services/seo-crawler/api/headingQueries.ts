
import { supabase } from '@/integrations/supabase/client';

/**
 * Get all headings for a specific page
 */
export const getPageHeadings = async (pageId: string) => {
  const { data, error } = await supabase
    .from('seo_crawler_headings')
    .select('*')
    .eq('page_id', pageId)
    .order('position', { ascending: true });
  
  if (error) {
    console.error('Error fetching page headings:', error);
    throw error;
  }
  
  return data || [];
};

/**
 * Get all headings for an entire crawl
 */
export const getCrawlHeadings = async (crawlId: string) => {
  const { data, error } = await supabase
    .from('seo_crawler_headings')
    .select(`
      *,
      page:page_id(url)
    `)
    .eq('crawl_id', crawlId)
    .order('position', { ascending: true });
  
  if (error) {
    console.error('Error fetching crawl headings:', error);
    throw error;
  }
  
  return data || [];
};
