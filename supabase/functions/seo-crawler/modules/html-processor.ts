
// HTML processor main module
import { SupabaseInstance, PageCrawlResult } from '../types.ts';
import { registerCrawlerError } from '../utils.ts';
import { processHtml as analyzeHtml } from './html-analysis/index.ts';

/**
 * Process HTML content from a crawled page
 */
export async function processHtml(
  supabase: SupabaseInstance, 
  url: string, 
  crawlId: string, 
  html: string
): Promise<PageCrawlResult | null> {
  try {
    console.log(`[HTML Processor] Processing HTML for URL: ${url}`);
    console.log(`[HTML Processor] HTML length: ${html.length} characters`);
    
    // Validate HTML content
    if (!html || html.length < 100) {
      console.error('[HTML Processor] HTML content is too short or empty');
      await registerCrawlerError(supabase, crawlId, url, 'HTML content is too short or empty');
      return null;
    }
    
    // Check for error pages
    if (html.includes('Access Denied') || html.includes('Request Rejected')) {
      console.error('[HTML Processor] Access denied or request rejected content detected');
      await registerCrawlerError(supabase, crawlId, url, 'Access denied or request rejected by target server');
      return null;
    }
    
    // Process the HTML content
    console.log('[HTML Processor] Calling HTML analysis module...');
    const result = await analyzeHtml(supabase, url, crawlId, html);
    
    // Log result
    if (result) {
      console.log(`[HTML Processor] Analysis completed successfully for ${url}`);
      console.log(`[HTML Processor] Found ${result.issues || 0} issues`);
    } else {
      console.error('[HTML Processor] HTML analysis returned null result');
    }
    
    return result;
  } catch (error) {
    console.error(`[HTML Processor] Error processing HTML: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error(`[HTML Processor] Stack trace: ${error instanceof Error ? error.stack : 'No stack trace'}`);
    await registerCrawlerError(supabase, crawlId, url, error instanceof Error ? error.message : String(error));
    return null;
  }
}
