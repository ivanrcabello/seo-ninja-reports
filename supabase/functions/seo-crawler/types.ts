
// Types for SEO Crawler
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

export interface SeoIssue {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  fix: string;
}

export interface SeoIssues {
  [key: string]: SeoIssue;
}

export interface PageCrawlResult {
  pageId: string;
  url: string;
  issues: number;
}

export interface CrawlLink {
  url: string;
  isInternal: boolean;
}

export type SupabaseInstance = SupabaseClient;
