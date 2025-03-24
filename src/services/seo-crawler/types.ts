
// SEO Crawler Types

// Basic types
export interface CrawlResult {
  id: string;
  client_id: string;
  domain: string;
  crawl_date: string;
  pages_crawled: number;
  issues_count: number;
  status: 'pending' | 'processing' | 'completed' | 'error' | string;
  total_time_seconds: number;
}

export interface CrawlPage {
  id: string;
  crawl_id: string;
  url: string;
  title: string | null;
  meta_description: string | null;
  status_code: number;
  content_type: string;
  issues_count: number;
  crawled_at: string;
  
  // Additional properties
  h1: string | null;
  h2_count: number;
  h3_count: number;
  word_count: number;
  image_count: number;
  internal_links_count: number;
  external_links_count: number;
  canonical_url: string | null;
  robots_directives: string | null;
  meta_robots: string | null;
  is_indexable: boolean;
  page_size_kb: number;
  load_time_ms: number;
  images_without_alt: number;
  mobile_friendly: boolean;
  has_schema_markup: boolean;
  content_length: number;
}

export interface CrawlIssue {
  id: string;
  page_id: string;
  issue_type: string;
  severity: 'low' | 'medium' | 'high' | string;
  description: string;
  element: string;
  fix_suggestion: string;
  recommended_fix: string;
  page_url?: string; // Optional field for UI display
}

export interface CrawlLink {
  id: string;
  page_id: string;
  url: string;
  anchor_text: string;
  is_internal: boolean;
  is_followed: boolean;
  rel_attributes: string;
  is_broken: boolean;
  status_code: number;
  follow?: boolean; // For compatibility with API
}

// Crawler configuration
export interface CrawlSettings {
  clientId: string;
  url: string;
  maxPages?: number;
  followExternalLinks?: boolean;
  excludePatterns?: string[];
  includePatterns?: string[];
}

// Saved crawler configuration
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
