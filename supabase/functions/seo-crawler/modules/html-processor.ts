
// Redirecting file - this is kept for backward compatibility
// and redirects to the new modular structure
import { SupabaseInstance, PageCrawlResult } from '../types.ts';
import { processHtml as processHtmlModular } from './html-analysis/index.ts';

// Re-export the processHtml function from the new modular structure
export async function processHtml(
  supabase: SupabaseInstance, 
  url: string, 
  crawlId: string, 
  html: string
): Promise<PageCrawlResult | null> {
  return processHtmlModular(supabase, url, crawlId, html);
}
