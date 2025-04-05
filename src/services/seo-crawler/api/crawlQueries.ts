
import { supabase } from '@/integrations/supabase/client';
import { CrawlResult, CrawlPage } from '../types';

/**
 * Get a specific crawl result by ID
 */
export async function getCrawlResult(crawlId: string): Promise<CrawlResult> {
  try {
    console.log(`Fetching crawl result with ID: ${crawlId}`);
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
    
    return {
      id: data.id,
      client_id: data.client_id,
      url: data.url,
      domain: data.domain,
      status: data.status as 'queued' | 'processing' | 'completed' | 'failed',
      started_at: data.started_at,
      start_time: data.started_at, // Map for compatibility
      completed_at: data.completed_at,
      created_at: data.inserted_at,
      updated_at: data.updated_at,
      total_pages: data.total_pages,
      pages_crawled: data.pages_crawled,
      total_issues: data.total_issues,
      error_message: data.error_message,
      settings: data.settings,
      success: true,
      message: '',
      // Additional fields
      inserted_at: data.inserted_at,
      total_time_seconds: data.total_time_seconds,
      total_links: data.total_links,
      total_internal_links: data.total_internal_links,
      total_external_links: data.total_external_links,
      total_broken_links: data.total_broken_links
    };
  } catch (error) {
    console.error('Error fetching crawl result:', error);
    throw error;
  }
}

/**
 * Get all crawl results for a given client
 */
export async function getCrawlResults(clientId: string): Promise<CrawlResult[]> {
  try {
    console.log(`Fetching crawl results for client: ${clientId}`);
    const { data, error } = await supabase
      .from('seo_crawler_crawls')
      .select('*')
      .eq('client_id', clientId)
      .order('inserted_at', { ascending: false });
    
    if (error) {
      console.error('Error from Supabase:', error);
      throw error;
    }
    
    return (data || []).map(item => ({
      id: item.id,
      client_id: item.client_id,
      url: item.url,
      domain: item.domain,
      status: item.status as 'queued' | 'processing' | 'completed' | 'failed',
      started_at: item.started_at,
      start_time: item.started_at, // Map for compatibility
      completed_at: item.completed_at,
      created_at: item.inserted_at,
      updated_at: item.updated_at,
      total_pages: item.total_pages,
      pages_crawled: item.pages_crawled,
      total_issues: item.total_issues,
      error_message: item.error_message,
      settings: item.settings,
      success: true,
      message: '',
      // Additional fields
      inserted_at: item.inserted_at,
      total_time_seconds: item.total_time_seconds,
      total_links: item.total_links,
      total_internal_links: item.total_internal_links,
      total_external_links: item.total_external_links,
      total_broken_links: item.total_broken_links
    }));
  } catch (error) {
    console.error('Error fetching crawl results:', error);
    return [];
  }
}

/**
 * Get all pages for a specific crawl
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
      is_internal: true, // Default value
      is_crawled: true, // Default value
      internal_links_count: page.internal_links_count,
      external_links_count: page.external_links_count,
      issues_count: page.issues_count || 0,
      created_at: page.crawled_at || new Date().toISOString(),
      updated_at: page.crawled_at || new Date().toISOString(),
      // Additional fields from database
      is_indexable: page.is_indexable,
      canonical_url: page.canonical_url,
      meta_robots: page.meta_robots,
      robots_directives: page.robots_directives,
      mobile_friendly: page.mobile_friendly,
      has_schema_markup: page.has_schema_markup,
      word_count: page.word_count,
      image_count: page.image_count,
      images_without_alt: page.images_without_alt,
      page_size_kb: page.page_size_kb,
      load_time_ms: page.load_time_ms || page.response_time_ms
    }));
  } catch (error) {
    console.error('Error fetching crawl pages:', error);
    return [];
  }
}

/**
 * Delete a specific crawl record
 */
export async function deleteCrawlRecord(crawlId: string): Promise<boolean> {
  try {
    console.log(`Deleting crawl with ID: ${crawlId}`);
    
    // Delete related records first (to avoid foreign key constraints)
    await Promise.all([
      supabase.from('seo_crawler_issues').delete().eq('crawl_id', crawlId),
      supabase.from('seo_crawler_links').delete().eq('crawl_id', crawlId),
      supabase.from('seo_crawler_headings').delete().eq('crawl_id', crawlId)
    ]);
    
    // Then delete pages
    await supabase.from('seo_crawler_pages').delete().eq('crawl_id', crawlId);
    
    // Finally delete the crawl record
    const { error } = await supabase
      .from('seo_crawler_crawls')
      .delete()
      .eq('id', crawlId);
    
    if (error) {
      console.error('Error from Supabase:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting crawl record:', error);
    throw error;
  }
}
