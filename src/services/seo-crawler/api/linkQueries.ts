
import { supabase } from '@/integrations/supabase/client';

/**
 * Get all links for a specific page
 */
export const getPageLinks = async (pageId: string) => {
  const { data, error } = await supabase
    .from('seo_crawler_links')
    .select('*')
    .eq('page_id', pageId);
  
  if (error) {
    console.error('Error fetching page links:', error);
    throw error;
  }
  
  return data || [];
};

/**
 * Get all links for an entire crawl
 */
export const getCrawlLinks = async (crawlId: string) => {
  const { data, error } = await supabase
    .from('seo_crawler_links')
    .select(`
      *,
      page:page_id(url)
    `)
    .eq('crawl_id', crawlId);
  
  if (error) {
    console.error('Error fetching crawl links:', error);
    throw error;
  }
  
  return data || [];
};
