
import { supabase } from '@/integrations/supabase/client';
import { CrawlResult, CrawlPage, CrawlSettings } from '../types';
import { debugCrawlData } from './debugUtils';

/**
 * Get a specific crawl result by ID
 */
export async function getCrawlResult(crawlId: string): Promise<CrawlResult> {
  try {
    console.log(`Fetching crawl record with ID: ${crawlId}`);
    
    const { data, error } = await supabase
      .from('seo_crawler_crawls')
      .select('*')
      .eq('id', crawlId)
      .single();
    
    if (error) {
      console.error('Error from Supabase:', error);
      throw error;
    }
    
    if (!data) {
      throw new Error(`Crawl with ID ${crawlId} not found`);
    }
    
    // Debug crawl data to see what fields are available
    debugCrawlData(data);
    
    // Parse the settings to ensure it's a CrawlSettings object
    // Safe type assertion with fallback values
    const settings = data.settings as any;
    const parsedSettings: CrawlSettings = {
      max_pages: settings?.max_pages || 100,
      exclude_urls: settings?.exclude_urls || [],
      include_urls: settings?.include_urls || [],
      respect_robots_txt: settings?.respect_robots_txt !== false,
      user_agent: settings?.user_agent || 'Mozilla/5.0 (compatible; SeoAuditBot/1.0)',
      crawl_sitemap: settings?.crawl_sitemap !== false,
      follow_links: settings?.follow_links !== false,
      max_depth: settings?.max_depth || 5,
      custom_headers: settings?.custom_headers || {}
    };
    
    // Map database record to our CrawlResult type
    return {
      id: data.id,
      client_id: data.client_id,
      url: data.url,
      domain: data.domain,
      status: data.status as 'queued' | 'processing' | 'completed' | 'failed',
      started_at: data.started_at || data.inserted_at,
      start_time: data.started_at || data.inserted_at,
      completed_at: data.completed_at,
      created_at: data.created_at || data.inserted_at || new Date().toISOString(),
      updated_at: data.updated_at || data.inserted_at || new Date().toISOString(),
      total_pages: data.total_pages || 0,
      pages_crawled: data.pages_crawled || 0,
      total_issues: data.total_issues || 0,
      error_message: data.error_message,
      settings: parsedSettings,
      success: true,
      message: 'Crawl data retrieved successfully',
      
      // Additional properties
      total_time_seconds: data.total_time_seconds || 0,
      total_links: data.total_links || 0,
      total_internal_links: data.total_internal_links || 0,
      total_external_links: data.total_external_links || 0,
      total_broken_links: data.total_broken_links || 0,
      inserted_at: data.inserted_at || new Date().toISOString(),
      avg_page_load_time_ms: data.avg_page_load_time_ms || 0,
      crawl_depth: data.crawl_depth || 0,
      duplicate_content_count: data.duplicate_content_count || 0,
      mobile_friendly_score: data.mobile_friendly_score || 0,
      performance_score: data.performance_score || 0,
      schema_markup_count: data.schema_markup_count || 0,
      summary: data.summary || null
    };
    
  } catch (error) {
    console.error('Error fetching crawl result:', error);
    throw error;
  }
}

/**
 * Get all crawl results for a client
 */
export async function getCrawlResults(clientId: string): Promise<CrawlResult[]> {
  try {
    console.log(`Fetching all crawl records for client ID: ${clientId}`);
    
    const { data, error } = await supabase
      .from('seo_crawler_crawls')
      .select('*')
      .eq('client_id', clientId)
      .order('inserted_at', { ascending: false });
    
    if (error) {
      console.error('Error from Supabase:', error);
      throw error;
    }
    
    return (data || []).map(item => {
      // Debug crawl data to see what fields are available
      debugCrawlData(item);
      
      // Parse the settings to ensure it's a CrawlSettings object
      const settings = item.settings as any;
      const parsedSettings: CrawlSettings = {
        max_pages: settings?.max_pages || 100,
        exclude_urls: settings?.exclude_urls || [],
        include_urls: settings?.include_urls || [],
        respect_robots_txt: settings?.respect_robots_txt !== false,
        user_agent: settings?.user_agent || 'Mozilla/5.0 (compatible; SeoAuditBot/1.0)',
        crawl_sitemap: settings?.crawl_sitemap !== false,
        follow_links: settings?.follow_links !== false,
        max_depth: settings?.max_depth || 5,
        custom_headers: settings?.custom_headers || {}
      };
      
      // Map database record to our CrawlResult type
      return {
        id: item.id,
        client_id: item.client_id,
        url: item.url,
        domain: item.domain,
        status: item.status as 'queued' | 'processing' | 'completed' | 'failed',
        started_at: item.started_at || item.inserted_at,
        start_time: item.started_at || item.inserted_at,
        completed_at: item.completed_at,
        created_at: item.created_at || item.inserted_at || new Date().toISOString(),
        updated_at: item.updated_at || item.inserted_at || new Date().toISOString(),
        total_pages: item.total_pages || 0,
        pages_crawled: item.pages_crawled || 0,
        total_issues: item.total_issues || 0,
        error_message: item.error_message,
        settings: parsedSettings,
        success: true,
        message: 'Crawl data retrieved successfully',
        
        // Additional properties
        total_time_seconds: item.total_time_seconds || 0,
        total_links: item.total_links || 0,
        total_internal_links: item.total_internal_links || 0,
        total_external_links: item.total_external_links || 0,
        total_broken_links: item.total_broken_links || 0, 
        inserted_at: item.inserted_at || new Date().toISOString(),
        avg_page_load_time_ms: item.avg_page_load_time_ms || 0,
        crawl_depth: item.crawl_depth || 0,
        duplicate_content_count: item.duplicate_content_count || 0,
        mobile_friendly_score: item.mobile_friendly_score || 0,
        performance_score: item.performance_score || 0,
        schema_markup_count: item.schema_markup_count || 0,
        summary: item.summary || null
      };
    });
    
  } catch (error) {
    console.error('Error fetching crawl results:', error);
    throw error;
  }
}

/**
 * Get pages for a specific crawl
 */
export async function getCrawlPages(crawlId: string): Promise<CrawlPage[]> {
  try {
    console.log(`Fetching pages for crawl ID: ${crawlId}`);
    
    const { data, error } = await supabase
      .from('seo_crawler_pages')
      .select('*')
      .eq('crawl_id', crawlId);
    
    if (error) {
      console.error('Error from Supabase:', error);
      throw error;
    }
    
    console.log(`Found ${data?.length || 0} pages for crawl ${crawlId}`);
    
    return (data || []).map(page => ({
      id: page.id,
      crawl_id: page.crawl_id,
      url: page.url,
      title: page.title,
      meta_description: page.meta_description,
      h1: page.h1,
      status_code: page.status_code || 0,
      is_internal: page.is_internal !== false,
      is_crawled: page.is_crawled !== false,
      issues_count: page.issues_count || 0,
      internal_links_count: page.internal_links_count || 0,
      external_links_count: page.external_links_count || 0,
      created_at: page.created_at || new Date().toISOString(),
      updated_at: page.updated_at || page.created_at || new Date().toISOString(),
      
      // Additional properties
      is_indexable: page.is_indexable,
      word_count: page.word_count,
      image_count: page.image_count,
      canonical_url: page.canonical_url,
      meta_robots: page.meta_robots,
      robots_directives: page.robots_directives,
      mobile_friendly: page.mobile_friendly,
      has_schema_markup: page.has_schema_markup,
      page_size_kb: page.page_size_kb,
      load_time_ms: page.load_time_ms,
      images_without_alt: page.images_without_alt,
      text_ratio: page.text_ratio,
      content_type: page.content_type
    }));
    
  } catch (error) {
    console.error('Error fetching crawl pages:', error);
    throw error;
  }
}
