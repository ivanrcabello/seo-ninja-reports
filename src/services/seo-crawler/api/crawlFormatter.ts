
import { CrawlResult } from '../types';

/**
 * Format raw crawl result data from the database into the expected shape
 */
export const formatCrawlResult = (data: any): CrawlResult => {
  if (!data) return {} as CrawlResult;
  
  return {
    id: data.id,
    client_id: data.client_id,
    url: data.url,
    domain: data.domain,
    status: data.status,
    error_message: data.error_message,
    started_at: data.started_at,
    completed_at: data.completed_at,
    total_pages: data.total_pages || 0,
    pages_crawled: data.pages_crawled || 0,
    total_issues: data.total_issues || 0,
    total_links: data.total_links || 0,
    settings: data.settings || {},
    created_at: data.created_at || data.inserted_at,
    updated_at: data.updated_at,
    inserted_at: data.inserted_at,
    
    // Additional properties with default values
    success: data.success !== undefined ? data.success : true,
    message: data.message || '',
    total_time_seconds: data.total_time_seconds || 0,
    total_internal_links: data.total_internal_links || 0,
    total_external_links: data.total_external_links || 0,
    total_broken_links: data.total_broken_links || 0,
    avg_page_load_time_ms: data.avg_page_load_time_ms,
    crawl_depth: data.crawl_depth,
    duplicate_content_count: data.duplicate_content_count,
    mobile_friendly_score: data.mobile_friendly_score,
    performance_score: data.performance_score,
    schema_markup_count: data.schema_markup_count,
    summary: data.summary
  };
};
