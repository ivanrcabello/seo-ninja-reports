
export interface CrawlResult {
  id: string;
  client_id: string;
  domain: string;
  url: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  started_at: string;
  completed_at?: string;
  pages_crawled: number;
  total_pages: number;
  total_issues: number;
  total_links: number;
  total_internal_links: number;
  total_external_links: number;
  total_broken_links: number;
  performance_score?: number;
  mobile_friendly_score?: number;
  avg_page_load_time_ms?: number;
  schema_markup_count?: number;
  duplicate_content_count?: number;
  createdAt?: string;
  updatedAt?: string;
  
  // Additional properties used in the API and UI
  success?: boolean;
  message?: string;
  inserted_at?: string;
  total_time_seconds?: number;
  error_message?: string;
  issues_count?: number;
  settings?: CrawlSettings;
}

export interface CrawlPage {
  id: string;
  crawl_id: string;
  url: string;
  title?: string;
  status_code: number;
  content_type?: string;
  meta_description?: string;
  h1?: string;
  is_indexable?: boolean;
  word_count?: number;
  load_time_ms?: number;
  content_length?: number;
  created_at?: string;
  
  // Additional properties used in API responses
  canonical_url?: string;
  redirect_url?: string;
  level?: number;
  internal_links_count?: number;
  external_links_count?: number;
  text_ratio?: number;
  image_count?: number;
  h2_count?: number;
  h3_count?: number;
  has_schema_markup?: boolean;
  hreflang_count?: number;
  issues_count?: number;
  crawled_at?: string;
  meta_robots?: string;
  robots_directives?: string;
  mobile_friendly?: boolean;
  page_size_kb?: number;
  images_without_alt?: number;
}

export interface CrawlIssue {
  id: string;
  crawl_id: string;
  page_id: string;
  url: string;
  issue_type: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info'; // Updated to include all possible values
  created_at: string;
  
  // Additional properties used in API responses
  page_url?: string;
  element?: string;
  fix_suggestion?: string;
  recommended_fix?: string;
  category?: string;
  
  // To accommodate API structure
  seo_crawler_pages?: {
    url: string;
  };
}

export interface CrawlLink {
  id: string;
  crawl_id: string;
  page_id: string;
  source_url: string;
  target_url: string;
  text: string;
  is_internal: boolean;
  is_broken: boolean;
  status_code: number;
  created_at: string;
  
  // Additional properties used in API responses
  url?: string;
  anchor_text?: string;
  follow?: boolean;
  rel_attributes?: string;
}

export interface CrawlHeading {
  id: string;
  crawl_id: string;
  page_id: string;
  url: string;
  level: number;
  text: string;
  created_at: string;
  
  // Additional properties used in API responses
  heading_type?: string;
  content?: string;
  position?: number;
  page_url?: string;
  
  // To accommodate API structure
  seo_crawler_pages?: {
    url: string;
  };
}

// Add CrawlSettings interface
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

// Type for API success responses
export interface ApiSuccessResponse {
  success: boolean;
  message?: string;
  crawl_id?: string;
  error?: string;
}
