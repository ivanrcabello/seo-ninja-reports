
/**
 * Types for the SEO crawler service
 */

// Define crawl settings for the SEO crawler
export interface CrawlSettings {
  max_pages: number;
  exclude_urls: string[];
  include_urls: string[];
  respect_robots_txt: boolean;
  user_agent: string;
  crawl_sitemap: boolean;
  follow_links: boolean;
  max_depth: number;
}

// Result of a crawl operation
export interface CrawlResult {
  id: string;
  client_id: string;
  url: string;
  domain: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  start_time: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  total_pages?: number;
  pages_crawled?: number;
  total_issues?: number;
  error_message?: string;
  settings: CrawlSettings;
  success: boolean;
  message: string;
}

// Crawl page data
export interface CrawlPage {
  id: string;
  crawl_id: string;
  url: string;
  title?: string;
  meta_description?: string;
  h1?: string;
  status_code: number;
  is_internal: boolean;
  is_crawled: boolean;
  issues_count: number;
  internal_links_count: number;
  external_links_count: number;
  created_at: string;
  updated_at: string;
}

// Crawl issue data
export interface CrawlIssue {
  id: string;
  crawl_id: string;
  page_id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  details?: any;
  created_at: string;
}

// Crawl link data
export interface CrawlLink {
  id: string;
  crawl_id: string;
  page_id: string;
  url: string;
  text?: string;
  is_internal: boolean;
  is_followed: boolean;
  is_broken?: boolean;
  status_code?: number;
  created_at: string;
}

// Crawl meta data
export interface CrawlMeta {
  id: string;
  crawl_id: string;
  page_id: string;
  name: string;
  content: string;
  created_at: string;
}

// Crawl summary data
export interface CrawlSummary {
  pages_count: number;
  issues_count: number;
  internal_links_count: number;
  external_links_count: number;
  broken_links_count: number;
  crawl_duration: number;
  top_issues: { type: string; count: number }[];
}
