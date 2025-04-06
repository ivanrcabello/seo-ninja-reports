
// HTML processor main module
import { SupabaseInstance, PageCrawlResult } from '../types.ts';
import { registerCrawlerError } from '../utils.ts';
import { processHtml as analyzeHtml } from './html-analysis/index.ts';
import * as cheerio from 'https://esm.sh/cheerio@1.0.0-rc.12';

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
    
    // Determine if we received HTML or JSON
    let processedHtml = html;
    let isJson = false;
    
    // First try to detect HTML by checking for common tags
    const hasHtmlTag = html.includes('<html') || html.includes('<!DOCTYPE') || html.includes('<body');
    
    if (!hasHtmlTag) {
      // This might be JSON, try to parse it
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
          } else if (jsonData.results && jsonData.results.content) {
            console.log('[HTML Processor] Found HTML content in JSON results.content field');
            processedHtml = jsonData.results.content;
          } else if (jsonData.error || jsonData.message) {
            const errorMessage = `Bright Data returned JSON error: ${jsonData.error || jsonData.message}`;
            console.error('[HTML Processor] ' + errorMessage);
            await registerCrawlerError(supabase, crawlId, url, errorMessage);
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
    }
    
    // Check if the HTML is meaningful by attempting to load with cheerio
    let isValidHtml = true;
    try {
      const $ = cheerio.load(processedHtml);
      const title = $('title').text().trim();
      const h1 = $('h1').text().trim();
      const links = $('a').length;
      
      console.log(`[HTML Processor] Cheerio test: Title: "${title}", H1: "${h1}", Links: ${links}`);
      
      if (!title && !h1 && links === 0) {
        console.warn('[HTML Processor] HTML content might be missing core elements');
        
        // Check if there's any visible content at all
        const bodyText = $('body').text().trim();
        if (!bodyText || bodyText.length < 50) {
          console.warn('[HTML Processor] HTML content appears to be empty or invalid');
          isValidHtml = false;
        }
      }
    } catch (cheerioError) {
      console.error('[HTML Processor] Error parsing HTML with cheerio:', cheerioError);
      isValidHtml = false;
    }
    
    // If HTML appears to be invalid or empty, create a better fallback
    if (!isValidHtml || !processedHtml || processedHtml.length < 100) {
      console.error('[HTML Processor] HTML content is invalid or too short, generating fallback content');
      
      // Generate a more useful fallback HTML for analysis
      processedHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Page analysis for ${url}</title>
          <meta name="description" content="The page content could not be properly retrieved. This is a generated placeholder.">
        </head>
        <body>
          <h1>Content Not Available</h1>
          <p>The content for <a href="${url}">${url}</a> could not be properly retrieved.</p>
          <p>This may be due to one of the following reasons:</p>
          <ul>
            <li>The website uses advanced JavaScript that requires browser rendering</li>
            <li>The website has protective measures against automated access</li>
            <li>The website content loads dynamically after the initial page load</li>
            <li>There might be connectivity issues with Bright Data's services</li>
          </ul>
          <p>You may want to try again later or check the website manually.</p>
          
          <h2>Technical Details</h2>
          <p>URL: ${url}</p>
          <p>Crawl ID: ${crawlId}</p>
          <p>Response length: ${html.length} characters</p>
          
          <div style="display:none">
            <!-- Additional metadata for analysis -->
            <p>Original content preview: ${html.substring(0, 300).replace(/</g, '&lt;').replace(/>/g, '&gt;')}...</p>
          </div>
        </body>
        </html>
      `;
      
      console.log('[HTML Processor] Created enhanced fallback HTML');
    }
    
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
