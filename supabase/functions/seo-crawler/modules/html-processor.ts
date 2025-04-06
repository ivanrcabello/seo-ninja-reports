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
    
    // Improved JSON detection
    let processedHtml = html;
    let isJson = false;
    
    try {
      if (html.trim().startsWith('{') || html.trim().startsWith('[')) {
        isJson = true;
        console.log('[HTML Processor] Content appears to be JSON instead of HTML');
        const jsonData = JSON.parse(html);
        console.log('[HTML Processor] Successfully parsed JSON:', JSON.stringify(jsonData).substring(0, 300));
        
        // Try to extract HTML from various JSON properties
        if (jsonData.body) {
          console.log('[HTML Processor] Found HTML content in JSON body field');
          processedHtml = jsonData.body;
        } else if (jsonData.html) {
          console.log('[HTML Processor] Found HTML content in JSON html field');
          processedHtml = jsonData.html;
        } else if (jsonData.content) {
          console.log('[HTML Processor] Found HTML content in JSON content field');
          processedHtml = jsonData.content;
        } else if (jsonData.data && jsonData.data.body) {
          console.log('[HTML Processor] Found HTML content in JSON data.body field');
          processedHtml = jsonData.data.body;
        } else if (jsonData.data && jsonData.data.html) {
          console.log('[HTML Processor] Found HTML content in JSON data.html field');
          processedHtml = jsonData.data.html;
        } else if (jsonData.data && typeof jsonData.data === 'string') {
          console.log('[HTML Processor] Found potential HTML content in JSON data field (string)');
          processedHtml = jsonData.data;
        } else if (jsonData.error || jsonData.message) {
          const errorMessage = `Bright Data returned JSON error: ${jsonData.error || jsonData.message}`;
          console.error('[HTML Processor] ' + errorMessage);
          await registerCrawlerError(supabase, crawlId, url, errorMessage);
          
          // Don't abort yet, just log the error
        }
        
        // Log the length of the extracted HTML
        console.log(`[HTML Processor] Extracted HTML from JSON, new length: ${processedHtml.length} characters`);
        
        // Check if what we extracted is actually HTML
        if (processedHtml && processedHtml.length > 0) {
          const htmlCheck = processedHtml.toLowerCase();
          if (!htmlCheck.includes('<html') && !htmlCheck.includes('<!doctype') && !htmlCheck.includes('<body')) {
            console.log('[HTML Processor] Extracted content does not appear to be HTML, will try to use it anyway');
          }
        }
      }
    } catch (jsonError) {
      console.log('[HTML Processor] Failed to parse content as JSON, will process as HTML:', jsonError);
    }
    
    // Check for really empty content
    if (!processedHtml || processedHtml.length === 0) {
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
    
    // Check for short content but be more lenient (20 chars instead of 50)
    if (processedHtml.length < 20) {
      console.error('[HTML Processor] HTML content is too short');
      console.log(`[HTML Processor] Full short content: ${processedHtml}`);
      await registerCrawlerError(supabase, crawlId, url, 'HTML content is too short from Bright Data');
      
      // Update crawl status to failed
      await supabase
        .from('seo_crawler_crawls')
        .update({
          status: 'failed',
          error_message: 'HTML content is too short (less than 20 characters)',
          completed_at: new Date().toISOString()
        })
        .eq('id', crawlId);
        
      return null;
    }
    
    // Check for error pages but continue anyway as we may be able to extract some data
    if (processedHtml.includes('Access Denied') || 
        processedHtml.includes('Request Rejected') || 
        processedHtml.includes('Proxy Authentication Required') ||
        processedHtml.includes('407 Proxy Authentication Required') ||
        processedHtml.includes('Unauthorized') ||
        processedHtml.includes('401 Authorization Required')) {
      console.warn('[HTML Processor] Access denied or authentication error content detected, but will continue processing');
      console.log(`[HTML Processor] Error page preview: ${processedHtml.substring(0, 300)}...`);
      
      // Log error but continue
      await registerCrawlerError(supabase, crawlId, url, 'Access denied or authentication warnings in content, but continuing analysis');
    }
    
    // Be less strict about validation - if it's not empty, we'll try to process it
    console.log('[HTML Processor] Proceeding with HTML analysis on available content');
    
    // Process the HTML content
    console.log('[HTML Processor] Calling HTML analysis module...');
    const result = await analyzeHtml(supabase, url, crawlId, processedHtml);
    
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
