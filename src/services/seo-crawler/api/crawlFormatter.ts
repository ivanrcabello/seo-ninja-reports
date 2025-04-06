
import { CrawlResult } from '../types';

export const formatCrawlResult = (data: any): CrawlResult => {
  return {
    id: data.id,
    client_id: data.client_id,
    domain: data.domain || '',
    start_url: data.start_url || '',
    status: data.status || 'processing',
    max_pages: data.max_pages || 100, // Increasing default max pages from 3 to 100
    pages_count: data.pages_count || 0,
    issues_count: data.issues_count || 0,
    crawled_pages: data.crawled_pages || 0,
    errors_count: data.errors_count || 0,
    error_message: data.error_message || null,
    options: data.options || {},
    inserted_at: data.inserted_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString(),
    completed_at: data.completed_at || null
  };
};
