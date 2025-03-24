
import { supabase } from '@/integrations/supabase/client';
import { CrawlResult, CrawlPage, CrawlIssue, CrawlLink } from './types';

// Fetch all crawl results for a client
export const fetchCrawlResults = async (clientId: string): Promise<CrawlResult[]> => {
  try {
    const { data, error } = await supabase
      .from('seo_crawl_results')
      .select('*')
      .eq('client_id', clientId)
      .order('crawl_date', { ascending: false });
      
    if (error) throw error;
    
    return data as CrawlResult[];
  } catch (error) {
    console.error("Error retrieving crawl results:", error);
    throw error;
  }
};

// Delete a crawl record and its associated data
export const deleteCrawlRecord = async (crawlId: string): Promise<void> => {
  try {
    // First find all pages associated with this crawl
    const { data: pages, error: pagesError } = await supabase
      .from('seo_crawl_pages')
      .select('id')
      .eq('crawl_id', crawlId);
      
    if (pagesError) throw pagesError;
    
    // Delete issues and links for each page
    if (pages && pages.length > 0) {
      const pageIds = pages.map(page => page.id);
      
      // Delete issues
      const { error: issuesError } = await supabase
        .from('seo_crawl_issues')
        .delete()
        .in('page_id', pageIds);
        
      if (issuesError) throw issuesError;
      
      // Delete links
      const { error: linksError } = await supabase
        .from('seo_crawl_links')
        .delete()
        .in('page_id', pageIds);
        
      if (linksError) throw linksError;
    }
    
    // Delete all pages for this crawl
    const { error: deletePageError } = await supabase
      .from('seo_crawl_pages')
      .delete()
      .eq('crawl_id', crawlId);
      
    if (deletePageError) throw deletePageError;
    
    // Finally delete the crawl record
    const { error: deleteCrawlError } = await supabase
      .from('seo_crawl_results')
      .delete()
      .eq('id', crawlId);
      
    if (deleteCrawlError) throw deleteCrawlError;
  } catch (error) {
    console.error("Error deleting crawl record:", error);
    throw error;
  }
};

// Fetch a specific crawl result
export const fetchCrawlResult = async (crawlId: string): Promise<CrawlResult> => {
  try {
    const { data, error } = await supabase
      .from('seo_crawl_results')
      .select('*')
      .eq('id', crawlId)
      .single();
      
    if (error) throw error;
    
    return data as CrawlResult;
  } catch (error) {
    console.error("Error retrieving crawl result:", error);
    throw error;
  }
};

// Fetch issues for a specific page
export const fetchCrawlIssues = async (pageId: string): Promise<CrawlIssue[]> => {
  try {
    const { data, error } = await supabase
      .from('seo_crawl_issues')
      .select('*')
      .eq('page_id', pageId);
      
    if (error) throw error;
    
    return data as CrawlIssue[];
  } catch (error) {
    console.error("Error retrieving page issues:", error);
    throw error;
  }
};

// Fetch links for a specific page
export const fetchCrawlLinks = async (pageId: string): Promise<CrawlLink[]> => {
  try {
    const { data, error } = await supabase
      .from('seo_crawl_links')
      .select('*')
      .eq('page_id', pageId);
      
    if (error) throw error;
    
    // Convert to CrawlLink type with proper is_followed property
    return data.map(link => ({
      ...link,
      is_followed: link.follow || false
    })) as unknown as CrawlLink[];
  } catch (error) {
    console.error("Error retrieving page links:", error);
    throw error;
  }
};
