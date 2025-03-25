
// Type definitions for SEO crawler
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

// Supabase instance type
export type SupabaseInstance = SupabaseClient;

// Page crawl result
export interface PageCrawlResult {
  pageId: string;
  url: string;
  statusCode: number;
  issues: number;
}

// SEO issue definition
export interface SeoIssue {
  page_id: string;
  issue_type: string;
  description: string;
  severity: 'critical' | 'major' | 'minor' | 'info';
  recommended_fix?: string;
  element?: string;
}

// Crawl settings
export interface CrawlSettings {
  max_pages: number;
  exclude_urls: string[];
  include_urls: string[];
  respect_robots_txt: boolean;
  user_agent: string;
  crawl_sitemap: boolean;
  follow_links: boolean;
  max_depth: number;
}
