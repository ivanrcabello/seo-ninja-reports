
// Type definitions for SEO crawler
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

export type SupabaseInstance = SupabaseClient;

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
  page_id: string;
  issue_type: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  created_at: string;
}
