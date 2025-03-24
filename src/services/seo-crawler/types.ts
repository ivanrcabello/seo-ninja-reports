
export interface CrawlResult {
  id: string;
  client_id: string;
  url: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  started_at: string;
  completed_at: string | null;
  error_message: string | null;
  total_pages: number;
  total_issues: number;
  total_links: number;
  total_internal_links: number;
  total_external_links: number;
  total_broken_links: number;
  pages_crawled: number;
  settings: CrawlSettings;
  summary?: CrawlSummary;
  inserted_at: string;
  updated_at: string;
  domain: string;
}

export interface CrawlSettings {
  max_pages: number;
  exclude_urls: string[];
  include_urls: string[];
  respect_robots_txt: boolean;
  user_agent: string;
  custom_headers?: Record<string, string>;
  max_depth?: number;
  crawl_sitemap?: boolean;
  follow_links?: boolean;
}

export interface CrawlSummary {
  total_pages: number;
  total_issues: number;
  total_links: number;
  broken_links: number;
  redirects: number;
  critical_issues: number;
  major_issues: number;
  minor_issues: number;
  internal_links: number;
  external_links: number;
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
  is_indexable: boolean;
  redirect_url: string | null;
  level: number;
  internal_links_count: number;
  external_links_count: number;
  word_count: number;
  content_length: number;
  text_ratio: number;
  load_time_ms: number;
  image_count: number;
  h2_count: number;
  h3_count: number;
  has_schema_markup: boolean;
  hreflang_count: number;
  content_type: string;
  issues_count: number;
  crawled_at: string;
}

export interface CrawlIssue {
  id: string;
  page_id: string;
  issue_type: string;
  description: string;
  severity: string;
  recommended_fix: string;
  element: string | null;
  fix_suggestion: string | null;
  page_url?: string;
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
  rel_attributes: string[] | null;
}

export interface SavedCrawlSettings {
  id: string;
  client_id: string;
  domain: string;
  max_pages: number;
  exclude_patterns: string[];
  include_patterns: string[];
  follow_external_links: boolean;
  respect_robots_txt: boolean;
  user_agent: string;
  max_depth: number;
  crawl_sitemap: boolean;
  follow_links: boolean;
  custom_headers?: Record<string, string>;
  created_at: string;
  updated_at: string;
}
