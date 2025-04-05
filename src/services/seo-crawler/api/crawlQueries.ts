
import { supabase } from '@/integrations/supabase/client';
import { CrawlResult, CrawlPage, CrawlSettings } from '../types';
import { debugCrawlData, normalizeSettings, addMissingProperties } from './debugUtils';

/**
 * Get a specific crawl record
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
    
    // Debug crawl data to identify structure issues
    debugCrawlData(data);
    
    // Normalize the settings
    const normalizedSettings = normalizeSettings(data.settings);
    
    // Calculate total_time_seconds if it doesn't exist but we have started_at and completed_at
    let calculatedTotalTimeSeconds = 0;
    if (!data.total_time_seconds && data.started_at && data.completed_at) {
      const startDate = new Date(data.started_at);
      const endDate = new Date(data.completed_at);
      calculatedTotalTimeSeconds = Math.round((endDate.getTime() - startDate.getTime()) / 1000);
      console.log(`Calculated total_time_seconds: ${calculatedTotalTimeSeconds}`);
    }
    
    // Map the data to our CrawlResult type with safe property access
    return {
      id: data.id,
      client_id: data.client_id,
      url: data.url,
      domain: data.domain,
      status: data.status as 'queued' | 'processing' | 'completed' | 'failed',
      started_at: data.started_at,
      start_time: data.started_at || data.inserted_at,
      completed_at: data.completed_at,
      created_at: data.inserted_at || new Date().toISOString(),
      updated_at: data.updated_at || data.inserted_at || new Date().toISOString(),
      total_pages: data.total_pages || 0,
      pages_crawled: data.pages_crawled || 0,
      total_issues: data.total_issues || 0,
      error_message: data.error_message,
      settings: normalizedSettings,
      success: true,
      message: "Crawl data retrieved successfully",
      
      // Add defaults for properties that might be missing
      total_time_seconds: data.total_time_seconds || calculatedTotalTimeSeconds || 0,
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
    console.error('Error fetching crawl record:', error);
    throw error;
  }
}

/**
 * Get all crawl records for a client
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
    
    // Debug the first crawl data to identify structure issues
    if (data && data.length > 0) {
      debugCrawlData(data[0]);
    }
    
    // Map database records to our CrawlResult type
    return (data || []).map(record => {
      // Normalize the settings
      const normalizedSettings = normalizeSettings(record.settings);
      
      // Calculate total_time_seconds if it doesn't exist but we have started_at and completed_at
      let calculatedTotalTimeSeconds = 0;
      if (!record.total_time_seconds && record.started_at && record.completed_at) {
        const startDate = new Date(record.started_at);
        const endDate = new Date(record.completed_at);
        calculatedTotalTimeSeconds = Math.round((endDate.getTime() - startDate.getTime()) / 1000);
      }
      
      return {
        id: record.id,
        client_id: record.client_id,
        url: record.url,
        domain: record.domain,
        status: record.status as 'queued' | 'processing' | 'completed' | 'failed',
        started_at: record.started_at,
        start_time: record.started_at || record.inserted_at,
        completed_at: record.completed_at,
        created_at: record.inserted_at || new Date().toISOString(),
        updated_at: record.updated_at || record.inserted_at || new Date().toISOString(),
        total_pages: record.total_pages || 0,
        pages_crawled: record.pages_crawled || 0,
        total_issues: record.total_issues || 0,
        error_message: record.error_message,
        settings: normalizedSettings,
        success: true,
        message: "Crawl data retrieved successfully",
        
        // Add defaults for properties that might be missing
        total_time_seconds: record.total_time_seconds || calculatedTotalTimeSeconds || 0,
        total_links: record.total_links || 0,
        total_internal_links: record.total_internal_links || 0,
        total_external_links: record.total_external_links || 0,
        total_broken_links: record.total_broken_links || 0,
        inserted_at: record.inserted_at || new Date().toISOString(),
        avg_page_load_time_ms: record.avg_page_load_time_ms || 0,
        crawl_depth: record.crawl_depth || 0,
        duplicate_content_count: record.duplicate_content_count || 0,
        mobile_friendly_score: record.mobile_friendly_score || 0,
        performance_score: record.performance_score || 0,
        schema_markup_count: record.schema_markup_count || 0,
        summary: record.summary || null
      };
    });
  } catch (error) {
    console.error('Error fetching crawl records:', error);
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
    
    // Map database records to our CrawlPage type with required fields and default values
    return (data || []).map(page => {
      // Create default structure for a page
      const defaultPageProps = {
        is_internal: true,
        is_crawled: true,
        issues_count: 0,
        internal_links_count: 0,
        external_links_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Use the addMissingProperties helper to ensure all required properties exist
      const pageWithDefaults = addMissingProperties(page, defaultPageProps);
      
      return {
        id: page.id,
        crawl_id: page.crawl_id,
        url: page.url,
        title: page.title || '',
        meta_description: page.meta_description || '',
        h1: page.h1 || '',
        status_code: page.status_code || 200,
        is_internal: pageWithDefaults.is_internal,
        is_crawled: pageWithDefaults.is_crawled,
        issues_count: page.issues_count || 0,
        internal_links_count: page.internal_links_count || 0,
        external_links_count: page.external_links_count || 0,
        created_at: page.crawled_at || pageWithDefaults.created_at,
        updated_at: page.crawled_at || pageWithDefaults.updated_at,
        
        // Add missing properties from the type
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
        content_text: page.content_text,
        content_hash: page.content_hash,
        meta_keywords: page.meta_keywords,
        level: page.level,
        redirect_url: page.redirect_url,
        dom_nodes_count: page.dom_nodes_count,
        dom_load_time_ms: page.dom_load_time_ms,
        content_type: page.content_type,
        content_length: page.content_length,
        text_ratio: page.text_ratio,
        similar_page_id: page.similar_page_id,
        response_time_ms: page.response_time_ms,
        crawled_at: page.crawled_at,
        hreflang_count: page.hreflang_count,
        h2_count: page.h2_count,
        h3_count: page.h3_count
      };
    });
  } catch (error) {
    console.error('Error fetching crawl pages:', error);
    return [];
  }
}

/**
 * Delete a crawl record and all related data
 */
export async function deleteCrawlRecord(crawlId: string): Promise<boolean> {
  try {
    // Delete all related records first (assuming cascade deletion is not set up)
    // Issues
    await supabase
      .from('seo_crawler_issues')
      .delete()
      .eq('crawl_id', crawlId);
      
    // Links
    await supabase
      .from('seo_crawler_links')
      .delete()
      .eq('crawl_id', crawlId);
      
    // Pages
    await supabase
      .from('seo_crawler_pages')
      .delete()
      .eq('crawl_id', crawlId);
      
    // Finally delete the crawl record
    const { error } = await supabase
      .from('seo_crawler_crawls')
      .delete()
      .eq('id', crawlId);
      
    if (error) {
      console.error('Error deleting crawl record:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteCrawlRecord:', error);
    return false;
  }
}
