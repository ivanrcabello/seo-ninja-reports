
import { supabase } from '@/integrations/supabase/client';

/**
 * Get all issues for a specific page
 */
export const getPageIssues = async (pageId: string) => {
  const { data, error } = await supabase
    .from('seo_crawler_issues')
    .select('*')
    .eq('page_id', pageId)
    .order('severity', { ascending: false });
  
  if (error) {
    console.error('Error fetching page issues:', error);
    throw error;
  }
  
  return data || [];
};

/**
 * Get all issues for an entire crawl
 */
export const getCrawlIssues = async (crawlId: string) => {
  const { data, error } = await supabase
    .from('seo_crawler_issues')
    .select(`
      *,
      page:page_id(url)
    `)
    .eq('crawl_id', crawlId)
    .order('severity', { ascending: false });
  
  if (error) {
    console.error('Error fetching crawl issues:', error);
    throw error;
  }
  
  return data || [];
};
