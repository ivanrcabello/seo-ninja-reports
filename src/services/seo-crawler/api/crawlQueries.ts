
import { supabase } from '@/integrations/supabase/client';
import { CrawlResult, CrawlPage, CrawlSettings } from '../types';

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
    return (data || []).map(crawl => {
      // Create a properly typed object
      const result: CrawlResult = {
        id: crawl.id,
        client_id: crawl.client_id || '',
        url: crawl.url,
        domain: crawl.domain,
        status: crawl.status as 'queued' | 'processing' | 'completed' | 'failed',
        started_at: crawl.started_at || '',
        completed_at: crawl.completed_at,
        total_pages: crawl.total_pages || 0,
        pages_crawled: crawl.pages_crawled || 0,
        total_issues: crawl.total_issues || 0,
        total_links: crawl.total_links || 0,
        total_internal_links: crawl.total_internal_links || 0,
        total_external_links: crawl.total_external_links || 0,
        total_broken_links: crawl.total_broken_links || 0,
        error_message: crawl.error_message,
        // Cast the settings JSON to CrawlSettings type
        settings: crawl.settings as unknown as CrawlSettings,
        // Add the additional properties that components use
        inserted_at: crawl.inserted_at,
        // Check if total_time_seconds exists and is a number
        total_time_seconds: crawl.total_time_seconds ? Number(crawl.total_time_seconds) : 0
      };
      
      return result;
    });
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
    const result: CrawlResult = {
      id: data.id,
      client_id: data.client_id || '',
      url: data.url,
      domain: data.domain,
      status: data.status as 'queued' | 'processing' | 'completed' | 'failed',
      started_at: data.started_at || '',
      completed_at: data.completed_at,
      total_pages: data.total_pages || 0,
      pages_crawled: data.pages_crawled || 0,
      total_issues: data.total_issues || 0,
      total_links: data.total_links || 0,
      total_internal_links: data.total_internal_links || 0,
      total_external_links: data.total_external_links || 0,
      total_broken_links: data.total_broken_links || 0,
      error_message: data.error_message,
      // Cast the settings JSON to CrawlSettings type
      settings: data.settings as unknown as CrawlSettings,
      // Add the additional properties that components use
      inserted_at: data.inserted_at,
      // Check if total_time_seconds exists and is a number
      total_time_seconds: data.total_time_seconds ? Number(data.total_time_seconds) : 0
    };
    
    return result;
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
