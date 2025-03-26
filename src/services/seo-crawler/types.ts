
// TypeScript types for SEO crawler functionality

// Crawl settings interface
export interface CrawlSettings {
  max_pages: number;
  exclude_urls: string[];
  include_urls: string[];
  respect_robots_txt: boolean;
  user_agent: string;
  crawl_sitemap: boolean;
  follow_links: boolean;
  max_depth: number;
  custom_headers?: Record<string, string>;
}

// Crawl result interface
export interface CrawlResult {
  id: string;
  client_id: string;
  url: string;
  domain: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  started_at: string;
  completed_at?: string;
  total_pages: number;
  pages_crawled: number;
  total_issues: number;
  total_links: number;
  total_internal_links: number;
  total_external_links: number;
  total_broken_links: number;
  error_message?: string;
  settings: CrawlSettings;
  success?: boolean;
  message?: string;
  
  // Adding missing properties used in components
  inserted_at?: string;
  total_time_seconds?: number;
  issues_count?: number; // Alias for total_issues used in frontend
}

// Crawled page interface
export interface CrawlPage {
  id: string;
  crawl_id: string;
  url: string;
  status_code: number;
  title?: string;
  meta_description?: string;
  h1?: string;
  canonical_url?: string;
  is_indexable: boolean;
  meta_robots?: string;
  robots_directives?: string;
  word_count?: number;
  internal_links_count?: number;
  external_links_count?: number;
  image_count?: number;
  images_without_alt?: number;
  has_schema_markup?: boolean;
  mobile_friendly?: boolean;
  page_size_kb?: number;
  load_time_ms?: number;
  
  // Adding missing property used in PagesList
  issues_count?: number;
}

// Crawl issue interface
export interface CrawlIssue {
  id: string;
  crawl_id?: string;
  page_id?: string;
  page_url?: string;
  issue_type: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  recommended_fix?: string;
  element?: string;
}

// Link interface
export interface CrawlLink {
  id: string;
  crawl_id?: string;
  page_id?: string;
  url: string;
  anchor_text?: string;
  is_internal: boolean;
  is_broken: boolean;
  status_code?: number;
  follow?: boolean;
  rel_attributes?: string[];
}

// Saved crawl settings type
export interface SavedCrawlSettings {
  id: string;
  client_id: string;
  domain: string;
  max_pages: number;
  exclude_patterns: string[];
  include_patterns: string[];
  follow_external_links: boolean;
  created_at: string;
  updated_at: string;
}
