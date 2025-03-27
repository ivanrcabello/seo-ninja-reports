
import { supabase } from '@/integrations/supabase/client';
import { CrawlResult, CrawlPage } from '../types';
import { ApiCrawlResult, ApiCrawlPage } from './responseTypes';
import { mapApiCrawlToCrawlResult, mapApiPageToCrawlPage } from './mappers';

/**
 * Get all crawl results for a given client
 */
export async function getCrawlResults(clientId: string): Promise<CrawlResult[]> {
  try {
    const { data, error } = await supabase
      .from('seo_crawler_crawls')
      .select('*')
      .eq('client_id', clientId)
      .order('inserted_at', { ascending: false });

    if (error) throw error;
    
    // Map database crawls to CrawlResult type with the fields needed by components
    return (data || []).map((crawl: any) => mapApiCrawlToCrawlResult(crawl));
  } catch (error) {
    console.error('Error fetching crawl results:', error);
    return [];
  }
}

/**
 * Get a specific crawl result by ID
 */
export async function getCrawlResult(crawlId: string): Promise<CrawlResult | null> {
  try {
    const { data, error } = await supabase
      .from('seo_crawler_crawls')
      .select('*')
      .eq('id', crawlId)
      .single();

    if (error) throw error;
    
    if (!data) return null;
    
    // Create a properly typed CrawlResult object
    return mapApiCrawlToCrawlResult(data as any);
  } catch (error) {
    console.error('Error fetching crawl result:', error);
    return null;
  }
}

/**
 * Get all pages for a specific crawl
 */
export async function getCrawlPages(crawlId: string): Promise<CrawlPage[]> {
  try {
    const { data, error } = await supabase
      .from('seo_crawler_pages')
      .select('*')
      .eq('crawl_id', crawlId)
      .order('level', { ascending: true });

    if (error) throw error;
    
    return (data || []).map((page: any) => mapApiPageToCrawlPage(page));
  } catch (error) {
    console.error('Error fetching crawl pages:', error);
    return [];
  }
}
