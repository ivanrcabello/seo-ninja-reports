
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
  console.log(`Processing HTML for URL: ${url}, HTML length: ${html.length} characters`);
  
  // Validate HTML content
  if (!html || html.length < 100) {
    console.warn(`Warning: HTML content is too short or empty (${html?.length || 0} chars)`);
    // Try to extract simple HTML if it exists
    if (html && (html.includes('<html') || html.includes('<body'))) {
      console.log('HTML is short but appears to be valid HTML structure');
    } else {
      // Create a basic HTML structure for testing/debugging
      console.log('Creating placeholder HTML structure for URL:', url);
      html = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>No content for ${url}</title>
            <meta name="description" content="No proper HTML content could be retrieved for this URL">
          </head>
          <body>
            <h1>Page Content Not Available</h1>
            <p>The HTML content for ${url} could not be properly retrieved.</p>
          </body>
        </html>
      `;
    }
  }
  
  try {
    // Pass to the HTML analysis module for detailed processing
    return await processHtmlAnalysis(supabase, url, crawlId, html);
  } catch (error) {
    console.error(`Error in processHtml: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error(`Stack trace: ${error instanceof Error ? error.stack : 'No stack trace'}`);
    return null;
  }
}
