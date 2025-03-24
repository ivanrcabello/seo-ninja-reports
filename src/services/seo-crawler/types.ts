
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
}
