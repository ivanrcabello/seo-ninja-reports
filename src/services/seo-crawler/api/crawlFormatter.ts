
import { CrawlResult } from '../types';

/**
 * Format raw crawl result data from the database into the expected shape
 */
export const formatCrawlResult = (data: any): CrawlResult => {
  if (!data) return {} as CrawlResult;
  
  // Return the data as is, assuming it already matches the CrawlResult type
  // If specific transformations are needed, they can be added here
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
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};
