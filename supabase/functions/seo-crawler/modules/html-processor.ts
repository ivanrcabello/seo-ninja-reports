
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
  if (!html) {
    console.warn(`Warning: HTML content is empty for ${url}`);
    html = createFallbackHtml(url, "No HTML content retrieved");
    return null;
  }
  
  if (html.length < 500) {
    console.warn(`Warning: HTML content is suspiciously short (${html.length} chars) for ${url}`);
    
    // Check if it's at least valid HTML structure
    if (html.includes('<html') || html.includes('<body')) {
      console.log('HTML is short but appears to be valid HTML structure');
    } else {
      console.log('Creating placeholder HTML structure for URL:', url);
      html = createFallbackHtml(url, "HTML content was too short or invalid");
    }
  }
  
  try {
    // Pass to the HTML analysis module for detailed processing
    return await processHtmlAnalysis(supabase, url, crawlId, html);
  } catch (error) {
    console.error(`Error in processHtml: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error(`Stack trace: ${error instanceof Error ? error.stack : 'No stack trace'}`);
    
    try {
      // Create a basic record to at least register the page was visited
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
        
      if (pageError) throw pageError;
      
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
      console.error(`Error creating fallback page record: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`);
      return null;
    }
  }
}

/**
 * Create a fallback HTML document when the original fetch fails
 */
function createFallbackHtml(url: string, reason: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Fallback for ${url}</title>
        <meta name="description" content="Fallback page created by SEO crawler: ${reason}">
      </head>
      <body>
        <h1>SEO Crawler Fallback Page</h1>
        <p>The crawler could not retrieve proper HTML for ${url}</p>
        <p>Reason: ${reason}</p>
      </body>
    </html>
  `;
}
