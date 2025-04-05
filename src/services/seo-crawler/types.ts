
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
  custom_headers?: Record<string, string>; // Added custom_headers as an optional property
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
  
  // Additional properties being used in components
  started_at?: string; // Used in many components
  inserted_at?: string; // Fallback for started_at
  total_time_seconds?: number; // Used for displaying duration
  total_links?: number; // Used in summary
  total_internal_links?: number; // Used in summary
  total_external_links?: number; // Used in summary
  total_broken_links?: number; // Used in summary
  
  // Add any other properties that might be used by components
  avg_page_load_time_ms?: number;
  crawl_depth?: number;
  duplicate_content_count?: number; 
  mobile_friendly_score?: number;
  performance_score?: number;
  schema_markup_count?: number;
  summary?: any;
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
  internal_links_count?: number;
  external_links_count?: number;
  created_at: string;
  updated_at: string;
  
  // Additional properties being used in components
  is_indexable?: boolean;
  word_count?: number;
  image_count?: number;
  canonical_url?: string;
  meta_robots?: string;
  robots_directives?: string;
  mobile_friendly?: boolean;
  has_schema_markup?: boolean;
  page_size_kb?: number;
  load_time_ms?: number;
  images_without_alt?: number;
  
  // Add any other properties that might be used
  content_text?: string;
  content_hash?: string;
  meta_keywords?: string;
  level?: number;
  redirect_url?: string;
  dom_nodes_count?: number;
  dom_load_time_ms?: number;
  content_type?: string;
  content_length?: number;
  text_ratio?: number;
  similar_page_id?: string;
  response_time_ms?: number;
  crawled_at?: string;
  hreflang_count?: number;
  h2_count?: number;
  h3_count?: number;
}

// Crawl issue data
export interface CrawlIssue {
  id: string;
  crawl_id: string;
  page_id: string;
  type: string; // Original property
  severity: 'low' | 'medium' | 'high' | 'critical' | 'info'; // Added 'info' as a valid severity
  description: string;
  details?: any;
  created_at: string;
  
  // Additional properties being used in components
  issue_type?: string; // Alias for 'type'
  page_url?: string; // Used in issue listing
  recommended_fix?: string; // Used in issue details
  element?: string; // Used in issue details
  fix_suggestion?: string; // Used in issue details
  category?: string; // Used in issue categorization
  seo_crawler_pages?: { url: string }; // Referenced in various components
}

// Crawl link data
export interface CrawlLink {
  id: string;
  crawl_id: string;
  page_id: string;
  url: string;
  text?: string; // Original property
  is_internal: boolean;
  is_followed: boolean;
  is_broken?: boolean;
  status_code?: number;
  created_at: string;
  
  // Additional properties being used in components
  anchor_text?: string; // Alias for 'text'
  follow?: boolean; // Used instead of is_followed in some places
  rel_attributes?: string[]; // Used in link details
  nofollow?: boolean; // Used in some cases
  link_location?: string;
  link_text?: string;
  link_type?: string;
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

// Crawl heading data
export interface CrawlHeading {
  id: string;
  crawl_id: string;
  page_id: string;
  heading_type: string; // h1, h2, h3, etc.
  content: string;
  position: number;
  created_at: string;
  page_url?: string;
  seo_crawler_pages?: { url: string };
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
