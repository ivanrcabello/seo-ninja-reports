
// This file provides type definitions for the API response structures
// to improve type safety when mapping from API responses to our domain models

export interface ApiCrawlResult {
  id: string;
  client_id: string;
  domain: string;
  url: string;
  status: string;
  started_at?: string;
  completed_at?: string;
  pages_crawled: number;
  total_pages: number;
  total_issues: number;
  total_links: number;
  total_internal_links: number;
  total_external_links: number;
  total_broken_links: number;
  inserted_at?: string;
  total_time_seconds?: number;
  error_message?: string;
  settings?: Record<string, any>;
  [key: string]: any; // Allow for additional properties
}

export interface ApiCrawlPage {
  id: string;
  crawl_id: string;
  url: string;
  status_code: number;
  title?: string;
  meta_description?: string;
  h1?: string;
  canonical_url?: string;
  is_indexable?: boolean;
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
  issues_count?: number;
  crawled_at?: string;
  inserted_at?: string;
  meta_robots?: string;
  robots_directives?: string;
  mobile_friendly?: boolean;
  page_size_kb?: number;
  images_without_alt?: number;
  [key: string]: any; // Allow for additional properties
}

export interface ApiCrawlIssue {
  id: string;
  crawl_id: string;
  page_id: string;
  page_url?: string;
  issue_type: string;
  description: string;
  element?: string;
  severity?: string;
  fix_suggestion?: string;
  recommended_fix?: string;
  category?: string;
  created_at?: string;
  inserted_at?: string;
  seo_crawler_pages?: {
    url: string;
  };
  [key: string]: any; // Allow for additional properties
}

export interface ApiCrawlLink {
  id: string;
  crawl_id: string;
  page_id: string;
  url?: string;
  anchor_text?: string;
  is_internal: boolean;
  is_broken: boolean;
  status_code?: number;
  follow?: boolean;
  rel_attributes?: string | string[]; // Accept both string and string[]
  created_at?: string;
  inserted_at?: string;
  [key: string]: any; // Allow for additional properties
}

export interface ApiCrawlHeading {
  id: string;
  crawl_id: string;
  page_id: string;
  page_url?: string;
  heading_type?: string;
  content?: string;
  position?: number;
  created_at?: string;
  inserted_at?: string;
  seo_crawler_pages?: {
    url: string;
  };
  [key: string]: any; // Allow for additional properties
}

// Success response type for the startCrawl operation
export interface CrawlStartResponse {
  success: boolean;
  message?: string;
  crawl_id?: string;
  error?: string;
}
