
export interface CrawlSettings {
  url: string;
  clientId: string;
  maxPages?: number;
  excludePatterns?: string[];
  includePatterns?: string[];
  followExternalLinks?: boolean;
}

export interface CrawlResult {
  id: string;
  client_id: string;
  domain: string;
  crawl_date: string;
  pages_crawled: number;
  issues_count: number;
  status: 'processing' | 'completed' | 'failed' | 'error';
  total_time_seconds: number;
}

export interface CrawlPage {
  id: string;
  crawl_id: string;
  url: string;
  status_code: number;
  title: string;
  meta_description: string;
  h1: string;
  canonical_url: string;
  robots_directives: string;
  word_count: number;
  load_time_ms: number;
  is_indexable: boolean;
  h2_count?: number;
  h3_count?: number;
  image_count?: number;
  images_without_alt?: number;
  internal_links_count?: number;
  external_links_count?: number;
  has_schema_markup?: boolean;
  content_length?: number;
  meta_robots?: string;
  mobile_friendly?: boolean;
  page_size_kb?: number;
}

export interface CrawlIssue {
  id: string;
  page_id: string;
  issue_type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  recommended_fix: string;
}

export interface CrawlLink {
  id: string;
  page_id: string;
  url: string;
  anchor_text: string;
  is_internal: boolean;
  is_broken: boolean;
  status_code: number;
  follow: boolean;
}

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
