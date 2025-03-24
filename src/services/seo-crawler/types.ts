
// SEO Crawler Types

// Crawl Result
export interface CrawlResult {
  id: string;
  client_id: string;
  domain: string;
  crawl_date: string;
  pages_crawled: number;
  issues_count: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  total_time_seconds: number;
}

// Crawl Page
export interface CrawlPage {
  id: string;
  crawl_id: string;
  url: string;
  title: string;
  meta_description: string;
  status_code: number;
  content_type: string;
  issues_count: number;
  crawled_at: string;
  
  // Additional properties being used in components
  h1?: string;
  h2_count?: number;
  h3_count?: number;
  word_count?: number;
  image_count?: number;
  internal_links_count?: number;
  external_links_count?: number;
  canonical_url?: string;
  robots_directives?: string;
  meta_robots?: string;
  is_indexable?: boolean;
  page_size_kb?: number;
  load_time_ms?: number;
  images_without_alt?: number;
  mobile_friendly?: boolean;
  has_schema_markup?: boolean;
}

// Crawl Issue
export interface CrawlIssue {
  id: string;
  page_id: string;
  issue_type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  element?: string;
  fix_suggestion?: string;
  recommended_fix?: string; // Added this property
}

// Crawl Link
export interface CrawlLink {
  id: string;
  page_id: string;
  url: string;
  anchor_text: string;
  is_internal: boolean;
  is_followed: boolean;
  rel_attributes?: string;
  
  // Additional properties being used
  is_broken?: boolean;
  status_code?: number;
}

// Crawl Settings
export interface CrawlSettings {
  clientId: string;
  url: string;
  maxPages?: number;
  followExternalLinks?: boolean;
  excludePatterns?: string[];
  includePatterns?: string[];
}

// Saved Crawl Settings from database
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
