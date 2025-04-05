
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
    
    // Log a sample of the HTML content for debugging
    if (html && html.length > 0) {
      console.log(`[HTML Processor] HTML preview: ${html.substring(0, 300)}...`);
    }
    
    // Check for really empty content first
    if (!html || html.length === 0) {
      console.error('[HTML Processor] HTML content is empty');
      await registerCrawlerError(supabase, crawlId, url, 'HTML content is empty from Bright Data');
      return null;
    }
    
    // Check for short content - we'll be more lenient here (50 chars instead of 100)
    if (html.length < 50) {
      console.error('[HTML Processor] HTML content is too short');
      console.log(`[HTML Processor] Full short content: ${html}`);
      await registerCrawlerError(supabase, crawlId, url, 'HTML content is too short from Bright Data');
      return null;
    }
    
    // Check for error pages
    if (html.includes('Access Denied') || 
        html.includes('Request Rejected') || 
        html.includes('Proxy Authentication Required') ||
        html.includes('407 Proxy Authentication Required')) {
      console.error('[HTML Processor] Access denied or authentication error content detected');
      console.log(`[HTML Processor] Error page preview: ${html.substring(0, 300)}...`);
      await registerCrawlerError(supabase, crawlId, url, 'Access denied, authentication required, or request rejected by target server');
      return null;
    }
    
    // Additional validation for HTML content
    if (!html.includes('<html') && !html.includes('<!DOCTYPE')) {
      console.error('[HTML Processor] Content does not appear to be valid HTML');
      console.log(`[HTML Processor] Invalid content preview: ${html.substring(0, 300)}...`);
      
      // Check if it's JSON
      if (html.trim().startsWith('{') || html.trim().startsWith('[')) {
        console.log('[HTML Processor] Content appears to be JSON instead of HTML');
        try {
          const jsonData = JSON.parse(html);
          console.log('[HTML Processor] Successfully parsed JSON:', JSON.stringify(jsonData).substring(0, 300));
          
          // Check if JSON contains an error message
          if (jsonData.error || jsonData.message) {
            await registerCrawlerError(
              supabase, 
              crawlId, 
              url, 
              `Bright Data returned JSON error: ${jsonData.error || jsonData.message}`
            );
          } else {
            await registerCrawlerError(supabase, crawlId, url, 'Bright Data returned JSON instead of HTML');
          }
        } catch (e) {
          console.error('[HTML Processor] Error parsing JSON:', e);
          await registerCrawlerError(supabase, crawlId, url, 'Received invalid content from Bright Data (not HTML)');
        }
        return null;
      }
      
      // If content is really short, provide the full content for debugging
      if (html.length < 1000) {
        console.log(`[HTML Processor] Full content: ${html}`);
      }
      
      await registerCrawlerError(supabase, crawlId, url, 'Content does not appear to be valid HTML');
      return null;
    }
    
    // Process the HTML content
    console.log('[HTML Processor] HTML validation passed, calling HTML analysis module...');
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
