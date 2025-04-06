
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
  custom_headers: Record<string, string>;
}

// Result of a crawl operation
export interface CrawlResult {
  id: string;
  client_id: string;
  url: string;
  domain: string;
  start_url: string; // Required property for crawlFormatter.ts
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'pending';
  error_message?: string | null;
  started_at?: string;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
  inserted_at?: string; // Database field
  total_pages?: number;
  pages_crawled?: number;
  total_issues?: number;
  total_links?: number;
  settings: CrawlSettings;
  
  // Additional properties with default values
  success?: boolean;
  message?: string;
  total_time_seconds?: number;
  total_internal_links?: number;
  total_external_links?: number;
  total_broken_links?: number;
  avg_page_load_time_ms?: number;
  crawl_depth?: number;
  duplicate_content_count?: number; 
  mobile_friendly_score?: number;
  performance_score?: number;
  schema_markup_count?: number;
  summary?: any;
  
  // Add compatibility properties required by components
  pages_count?: number;
  issues_count?: number;
  crawled_pages?: number;
  errors_count?: number;
  max_pages?: number;
  options?: any;
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
  issues_count: number;
  internal_links_count?: number;
  external_links_count?: number;
  
  // Required fields with default values when receiving from API
  is_internal: boolean;
  is_crawled: boolean;
  created_at: string;
  updated_at: string;
  
  // Optional fields based on database schema
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
  content_similarity_score?: number;
}

// Crawl issue data
export interface CrawlIssue {
  id: string;
  crawl_id: string;
  page_id: string;
  issue_type: string;
  type?: string; // Alias for 'issue_type' for backward compatibility
  severity: 'low' | 'medium' | 'high' | 'critical' | 'info';
  description: string;
  created_at: string;
  
  // Additional fields from database schema
  page_url?: string;
  recommended_fix?: string;
  element?: string;
  fix_suggestion?: string;
  category?: string;
  details?: any;
}

// Crawl link data
export interface CrawlLink {
  id: string;
  crawl_id: string;
  page_id: string;
  url: string;
  text?: string;
  anchor_text?: string; // Alias for 'text'
  is_internal: boolean;
  is_followed: boolean;
  follow?: boolean; // Alias for is_followed
  is_broken?: boolean;
  status_code?: number;
  created_at: string;
  
  // Additional fields from database schema
  rel_attributes?: string[];
  nofollow?: boolean;
  link_location?: string;
  link_text?: string;
  link_type?: string;
}

// Crawl heading data
export interface CrawlHeading {
  id: string;
  crawl_id: string;
  page_id: string;
  heading_type: string;
  content: string;
  position: number;
  created_at?: string;
  page_url?: string;
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
