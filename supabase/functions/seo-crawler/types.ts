
// Type definitions for SEO Crawler
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

export type SupabaseInstance = SupabaseClient;

export interface PageCrawlResult {
  pageId: string;
  url: string;
  issues: number;
}

export interface CrawlOptions {
  maxDepth: number;
  maxPages: number;
  followExternalLinks: boolean;
}

export interface LinkInfo {
  url: string;
  text: string;
  isInternal: boolean;
}

export interface ImageInfo {
  url: string;
  alt: string | null;
  hasAlt: boolean;
}
