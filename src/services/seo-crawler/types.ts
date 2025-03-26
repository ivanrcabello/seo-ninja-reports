
// SEO Crawler Types

// Result of a crawl
export interface CrawlResult {
  id: string;
  client_id: string;
  url: string;
  domain: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  error_message?: string;
  started_at: string;
  completed_at?: string;
  pages_crawled: number;
  total_pages: number;
  total_issues: number;
  total_links?: number;
  total_internal_links?: number;
  total_external_links?: number;
  total_broken_links?: number;
  settings: CrawlSettings;
  summary?: any;
  inserted_at: string;
  updated_at?: string;
  
  // Fields added in code but not in database
  crawl_date?: string;  // For backward compatibility, maps to started_at
  issues_count?: number; // For backward compatibility, maps to total_issues
  total_time_seconds?: number; // Calculated field
  
  // For API responses
  success?: boolean;
  message?: string;
}

// Individual crawled page
export interface CrawlPage {
  id: string;
  crawl_id: string;
  url: string;
  status_code: number;
  title: string;
  meta_description: string;
  h1: string;
  canonical_url?: string;
  is_indexable: boolean;
  redirect_url?: string;
  level?: number;
  internal_links_count?: number;
  external_links_count?: number;
  word_count?: number;
  content_length?: number;
  text_ratio?: number;
  load_time_ms?: number;
  image_count?: number;
  h2_count?: number;
  h3_count?: number;
  has_schema_markup?: boolean;
  hreflang_count?: number;
  content_type?: string;
  issues_count: number;
  crawled_at?: string;
  
  // Additional fields used in UI
  meta_robots?: string;
  robots_directives?: string;
  mobile_friendly?: boolean;
  page_size_kb?: number;
  images_without_alt?: number;
}

// SEO issue
export interface CrawlIssue {
  id: string;
  page_id: string;
  crawl_id?: string;
  issue_type: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'minor' | 'low' | 'info';
  recommended_fix?: string;
  element?: string;
  page_url?: string; // Added in code after fetching from DB
}

// Link found during crawl
export interface CrawlLink {
  id: string;
  page_id: string;
  url: string;
  anchor_text?: string;
  is_internal?: boolean;
  is_broken?: boolean;
  follow?: boolean;
  status_code?: number;
  rel_attributes?: string[];
}

// Settings for a crawl
export interface CrawlSettings {
  max_pages: number;
  exclude_urls?: string[];
  include_urls?: string[];
  respect_robots_txt: boolean;
  user_agent: string;
  crawl_sitemap?: boolean;
  follow_links: boolean;
  max_depth: number;
  follow_external_links?: boolean;
}
