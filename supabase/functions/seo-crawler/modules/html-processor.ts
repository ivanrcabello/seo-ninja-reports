
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
    
    // Check if the response is JSON instead of HTML
    if (html.trim().startsWith('{') || html.trim().startsWith('[')) {
      console.log('[HTML Processor] Content appears to be JSON instead of HTML');
      try {
        const jsonData = JSON.parse(html);
        console.log('[HTML Processor] Successfully parsed JSON:', JSON.stringify(jsonData).substring(0, 300));
        
        // Check if this is a Bright Data JSON response with HTML content
        if (jsonData.body) {
          console.log('[HTML Processor] Found HTML content in JSON body field');
          html = jsonData.body;
          console.log(`[HTML Processor] Extracted HTML from JSON, new length: ${html.length} characters`);
        } else if (jsonData.html) {
          console.log('[HTML Processor] Found HTML content in JSON html field');
          html = jsonData.html;
          console.log(`[HTML Processor] Extracted HTML from JSON, new length: ${html.length} characters`);
        } else if (jsonData.content) {
          console.log('[HTML Processor] Found HTML content in JSON content field');
          html = jsonData.content;
          console.log(`[HTML Processor] Extracted HTML from JSON, new length: ${html.length} characters`);
        } else if (jsonData.error || jsonData.message) {
          const errorMessage = `Bright Data returned JSON error: ${jsonData.error || jsonData.message}`;
          await registerCrawlerError(supabase, crawlId, url, errorMessage);
          
          // Update crawl status to failed
          await supabase
            .from('seo_crawler_crawls')
            .update({
              status: 'failed',
              error_message: errorMessage,
              completed_at: new Date().toISOString()
            })
            .eq('id', crawlId);
            
          return null;
        }
      } catch (e) {
        console.error('[HTML Processor] Error parsing JSON:', e);
      }
    }
    
    // Check for really empty content first
    if (!html || html.length === 0) {
      console.error('[HTML Processor] HTML content is empty');
      await registerCrawlerError(supabase, crawlId, url, 'HTML content is empty from Bright Data');
      
      // Update crawl status to failed
      await supabase
        .from('seo_crawler_crawls')
        .update({
          status: 'failed',
          error_message: 'HTML content is empty',
          completed_at: new Date().toISOString()
        })
        .eq('id', crawlId);
        
      return null;
    }
    
    // Check for short content - we'll be more lenient here (50 chars instead of 100)
    if (html.length < 50) {
      console.error('[HTML Processor] HTML content is too short');
      console.log(`[HTML Processor] Full short content: ${html}`);
      await registerCrawlerError(supabase, crawlId, url, 'HTML content is too short from Bright Data');
      
      // Update crawl status to failed
      await supabase
        .from('seo_crawler_crawls')
        .update({
          status: 'failed',
          error_message: 'HTML content is too short (less than 50 characters)',
          completed_at: new Date().toISOString()
        })
        .eq('id', crawlId);
        
      return null;
    }
    
    // Check for error pages
    if (html.includes('Access Denied') || 
        html.includes('Request Rejected') || 
        html.includes('Proxy Authentication Required') ||
        html.includes('407 Proxy Authentication Required') ||
        html.includes('Unauthorized') ||
        html.includes('401 Authorization Required')) {
      console.error('[HTML Processor] Access denied or authentication error content detected');
      console.log(`[HTML Processor] Error page preview: ${html.substring(0, 300)}...`);
      await registerCrawlerError(supabase, crawlId, url, 'Access denied, authentication required, or request rejected by target server');
      
      // Update crawl status to failed
      await supabase
        .from('seo_crawler_crawls')
        .update({
          status: 'failed',
          error_message: 'Access denied or authentication errors detected',
          completed_at: new Date().toISOString()
        })
        .eq('id', crawlId);
        
      return null;
    }
    
    // Additional validation for HTML content
    if (!html.includes('<html') && !html.includes('<!DOCTYPE')) {
      console.error('[HTML Processor] Content does not appear to be valid HTML');
      console.log(`[HTML Processor] Invalid content preview: ${html.substring(0, 300)}...`);
      
      // If content is really short, provide the full content for debugging
      if (html.length < 1000) {
        console.log(`[HTML Processor] Full content: ${html}`);
      }
      
      const errorMessage = 'Content does not appear to be valid HTML';
      await registerCrawlerError(supabase, crawlId, url, errorMessage);
      
      // Update crawl status to failed
      await supabase
        .from('seo_crawler_crawls')
        .update({
          status: 'failed',
          error_message: errorMessage,
          completed_at: new Date().toISOString()
        })
        .eq('id', crawlId);
        
      return null;
    }
    
    // Process the HTML content
    console.log('[HTML Processor] HTML validation passed, calling HTML analysis module...');
    const result = await analyzeHtml(supabase, url, crawlId, html);
    
    // Log result
    if (result) {
      console.log(`[HTML Processor] Analysis completed successfully for ${url}`);
      console.log(`[HTML Processor] Found ${result.issues || 0} issues`);
      
      // Update crawl status to completed
      await supabase
        .from('seo_crawler_crawls')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          pages_crawled: 1,
          total_issues: result.issues || 0
        })
        .eq('id', crawlId);
    } else {
      console.error('[HTML Processor] HTML analysis returned null result');
      
      // Update crawl status to failed
      await supabase
        .from('seo_crawler_crawls')
        .update({
          status: 'failed',
          error_message: 'HTML analysis returned no results',
          completed_at: new Date().toISOString()
        })
        .eq('id', crawlId);
    }
    
    return result;
  } catch (error) {
    console.error(`[HTML Processor] Error processing HTML: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error(`[HTML Processor] Stack trace: ${error instanceof Error ? error.stack : 'No stack trace'}`);
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    await registerCrawlerError(supabase, crawlId, url, errorMessage);
    
    // Update crawl status to failed
    await supabase
      .from('seo_crawler_crawls')
      .update({
        status: 'failed',
        error_message: errorMessage,
        completed_at: new Date().toISOString()
      })
      .eq('id', crawlId);
      
    return null;
  }
}
