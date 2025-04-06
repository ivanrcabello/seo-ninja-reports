
import { SupabaseInstance, PageCrawlResult } from '../types.ts';
import { processHtml as processHtmlAnalysis } from './html-analysis/index.ts';

/**
 * Process HTML content from a crawled page
 */
export async function processHtml(
  supabase: SupabaseInstance, 
  url: string, 
  crawlId: string, 
  html: string
): Promise<PageCrawlResult | null> {
  console.log(`[HTML Processor] Processing HTML for URL: ${url}, HTML length: ${html.length} characters`);
  
  // Validate HTML content
  if (!html) {
    console.warn(`[HTML Processor] Warning: HTML content is empty for ${url}`);
    html = createFallbackHtml(url, "No HTML content retrieved");
    // Continue processing with fallback HTML
  }
  
  if (html.length < 200) {
    console.warn(`[HTML Processor] Warning: HTML content is suspiciously short (${html.length} chars) for ${url}`);
    
    // Check if it's at least valid HTML structure
    if (html.includes('<html') || html.includes('<body')) {
      console.log('[HTML Processor] HTML is short but appears to be valid HTML structure');
    } else {
      console.log('[HTML Processor] Creating placeholder HTML structure for URL:', url);
      html = createFallbackHtml(url, "HTML content was too short or invalid");
    }
  }
  
  try {
    // Pass to the HTML analysis module for detailed processing
    console.log('[HTML Processor] Passing HTML to analysis module');
    return await processHtmlAnalysis(supabase, url, crawlId, html);
  } catch (error) {
    console.error(`[HTML Processor] Error in processHtml: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error(`[HTML Processor] Stack trace: ${error instanceof Error ? error.stack : 'No stack trace'}`);
    
    try {
      // Create a basic record to at least register the page was visited
      console.log('[HTML Processor] Creating fallback page record due to processing error');
      const { data, error: pageError } = await supabase
        .from('seo_crawler_pages')
        .insert({
          crawl_id: crawlId,
          url: url,
          status_code: 200,
          is_indexable: true,
          title: `Error processing ${url}`,
          meta_description: `This page could not be processed due to an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          issues_count: 1
        })
        .select('id')
        .single();
        
      if (pageError) {
        console.error(`[HTML Processor] Error creating fallback page record: ${pageError.message}`);
        throw pageError;
      }
      
      // Add an error issue
      await supabase
        .from('seo_crawler_issues')
        .insert({
          crawl_id: crawlId,
          page_id: data.id,
          issue_type: 'processing_error',
          description: `Error processing HTML: ${error instanceof Error ? error.message : 'Unknown error'}`,
          severity: 'high'
        });
        
      return {
        pageId: data.id,
        url,
        title: `Error processing ${url}`,
        metaDescription: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        h1: null,
        issues: 1,
        statusCode: 200,
        links: []
      };
    } catch (dbError) {
      console.error(`[HTML Processor] Error creating fallback page record: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`);
      return null;
    }
  }
}

/**
 * Create a fallback HTML document when the original fetch fails
 */
function createFallbackHtml(url: string, reason: string): string {
  console.log(`[HTML Processor] Creating fallback HTML for ${url}: ${reason}`);
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Error fetching ${url}</title>
        <meta name="description" content="This page could not be retrieved due to an error: ${reason}">
      </head>
      <body>
        <h1>Error Fetching Page</h1>
        <p>The crawler could not retrieve proper HTML for ${url}</p>
        <p>Reason: ${reason}</p>
        <a href="${url}/sample-page">Sample Page</a>
        <a href="${url}/contact">Contact</a>
        <a href="https://example.com">External Link</a>
      </body>
    </html>
  `;
}
