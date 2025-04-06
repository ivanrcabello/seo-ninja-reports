
import { supabase } from '@/integrations/supabase/client';
import { CrawlResult } from '../types';
import { formatCrawlResult } from './crawlFormatter';

/**
 * Get all crawl results for a client
 */
export const getCrawlResults = async (clientId: string): Promise<CrawlResult[]> => {
  // Use a type assertion to tell TypeScript what table we're using
  const { data, error } = await supabase
    .from('seo_crawler_crawls')
    .select('*')
    .eq('client_id', clientId)
    .order('inserted_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching crawl results:', error);
    throw error;
  }
  
  return data ? data.map(formatCrawlResult) : [];
};

/**
 * Get a single crawl result by ID
 */
export const getCrawlResult = async (crawlId: string): Promise<CrawlResult> => {
  // Use a type assertion to tell TypeScript what table we're using
  const { data, error } = await supabase
    .from('seo_crawler_crawls')
    .select('*')
    .eq('id', crawlId)
    .single();
  
  if (error) {
    console.error('Error fetching crawl result:', error);
    throw error;
  }
  
  return formatCrawlResult(data);
};

/**
 * Delete a crawl record and all associated data
 */
export const deleteCrawlRecord = async (crawlId: string): Promise<void> => {
  // First delete all related records in child tables
  const tables = ['seo_crawler_pages', 'seo_crawler_issues', 'seo_crawler_links', 'seo_crawler_headings'];
  
  for (const table of tables) {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('crawl_id', crawlId);
    
    if (error) {
      console.error(`Error deleting records from ${table}:`, error);
      // Continue with other tables despite errors
    }
  }
  
  // Then delete the main crawl record
  const { error } = await supabase
    .from('seo_crawler_crawls')
    .delete()
    .eq('id', crawlId);
  
  if (error) {
    console.error('Error deleting crawl record:', error);
    throw error;
  }
};

/**
 * Get all pages for a crawl
 */
export const getCrawlPages = async (crawlId: string) => {
  const { data, error } = await supabase
    .from('seo_crawler_pages')
    .select('*')
    .eq('crawl_id', crawlId)
    .order('crawled_at', { ascending: true });
  
  if (error) {
    console.error('Error fetching crawl pages:', error);
    throw error;
  }
  
  return data || [];
};
