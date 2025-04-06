
// Type definitions for SEO Crawler

export interface SupabaseInstance {
  from: (table: string) => any;
  storage: any;
  functions: {
    invoke: (name: string, options?: any) => Promise<any>;
  };
}

export interface PageCrawlResult {
  pageId: string;
  url: string;
  title: string;
  metaDescription: string;
  h1: string;
  issues: number;
  statusCode: number;
  links: string[];
}

export interface SEOIssue {
  crawl_id: string;
  page_id: string;
  issue_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical' | 'info';
  description: string;
  details?: any;
}

export interface Heading {
  type: string;  // h1, h2, etc.
  content: string;
  position: number;
}

export interface Link {
  url: string;
  text?: string;
  is_internal: boolean;
  is_followed: boolean;
}

export interface Image {
  src: string;
  alt: string | null;
  has_alt: boolean;
}

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

export interface CrawlQueue {
  url: string;
  depth: number;
  parentUrl?: string;
}
