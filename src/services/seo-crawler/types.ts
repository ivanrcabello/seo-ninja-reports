
export interface CrawlResult {
  id: string;
  client_id: string;
  domain: string;
  url: string;
  status: string;
  started_at: string;
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
}

export interface CrawlPage {
  id: string;
  crawl_id: string;
  url: string;
  title: string;
  status_code: number;
  content_type: string;
  meta_description: string;
  h1: string;
  is_indexable: boolean;
  word_count: number;
  load_time_ms: number;
  content_length: number;
  created_at: string;
}

export interface CrawlIssue {
  id: string;
  crawl_id: string;
  page_id: string;
  url: string;
  issue_type: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  created_at: string;
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
}

export interface CrawlHeading {
  id: string;
  crawl_id: string;
  page_id: string;
  url: string;
  level: number;
  text: string;
  created_at: string;
}
