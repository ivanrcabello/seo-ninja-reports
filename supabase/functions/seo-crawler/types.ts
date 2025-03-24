
// Type definitions for SEO Crawler functionality

// Basic types
export type SupabaseInstance = any; // Simplified for Edge Function

// Response from Bright Data
export interface BrightDataResponse {
  status: number;
  body: string;
  headers: Record<string, string>;
  url?: string;
  error?: string;
}

// Result of crawling a page
export interface PageCrawlResult {
  pageId: string;
  url: string;
  issues: number;
}

// Basic page data type
export interface CrawlPageData {
  id: string;
  crawl_id: string;
  url: string;
  title?: string;
  meta_description?: string;
  h1?: string;
  status_code: number;
  is_indexable: boolean;
}

// Bright Data credentials
export interface BrightDataCredentials {
  username?: string;
  password?: string;
}
