
import { supabase } from '@/integrations/supabase/client';
import { CrawlResult, CrawlPage } from '../types';

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
    return (data || []).map(crawl => ({
      ...crawl as unknown as CrawlResult,
      // Set total_time_seconds to 0 if it doesn't exist in the database
      total_time_seconds: crawl.total_time_seconds || 0 
    }));
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
    
    // Convert database crawl to CrawlResult type with fields needed by components
    return data ? {
      ...data as unknown as CrawlResult, 
      // Set total_time_seconds to 0 if it doesn't exist in the database
      total_time_seconds: data.total_time_seconds || 0
    } : null;
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
    
    return (data || []).map((page: any) => ({
      id: page.id,
      crawl_id: page.crawl_id,
      url: page.url,
      status_code: page.status_code,
      title: page.title || '',
      meta_description: page.meta_description || '',
      h1: page.h1 || '',
      canonical_url: page.canonical_url || '',
      is_indexable: page.is_indexable,
      redirect_url: page.redirect_url,
      level: page.level,
      internal_links_count: page.internal_links_count,
      external_links_count: page.external_links_count,
      word_count: page.word_count,
      content_length: page.content_length,
      text_ratio: page.text_ratio,
      load_time_ms: page.load_time_ms,
      image_count: page.image_count,
      h2_count: page.h2_count,
      h3_count: page.h3_count,
      has_schema_markup: page.has_schema_markup,
      hreflang_count: page.hreflang_count || 0,
      content_type: page.content_type || '',
      issues_count: page.issues_count || 0,
      crawled_at: page.crawled_at || page.inserted_at,
      // Added fields used by the PageDetail component
      meta_robots: page.meta_robots || '',
      robots_directives: page.robots_directives || '',
      mobile_friendly: typeof page.mobile_friendly === 'boolean' ? page.mobile_friendly : true,
      page_size_kb: page.page_size_kb || 0,
      images_without_alt: page.images_without_alt || 0
    }));
  } catch (error) {
    console.error('Error fetching crawl pages:', error);
    return [];
  }
}
