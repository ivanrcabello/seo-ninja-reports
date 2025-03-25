
// HTML processing module for SEO Crawler
import { SupabaseInstance, PageCrawlResult } from '../types.ts';
import { SEO_ISSUES } from '../constants.ts';
import { registerCrawlerError } from '../utils.ts';

// Function to process HTML content from a crawled page
export async function processHtml(
  supabase: SupabaseInstance, 
  url: string, 
  crawlId: string, 
  html: string
): Promise<PageCrawlResult | null> {
  try {
    console.log(`Processing HTML for URL: ${url}`);
    
    // Create a page record in the database
    const { data: pageData, error: pageError } = await supabase
      .from('seo_crawler_pages')
      .insert({
        crawl_id: crawlId,
        url: url,
        status: 'analyzed',
        content_type: 'text/html',
        analyzed_at: new Date().toISOString()
      })
      .select('id')
      .single();
    
    if (pageError) {
      console.error(`Error inserting page record: ${pageError.message}`);
      await registerCrawlerError(supabase, crawlId, url, `Error inserting page record: ${pageError.message}`);
      return null;
    }
    
    const pageId = pageData.id;
    console.log(`Created page record with ID: ${pageId}`);
    
    // Since we don't have DOMParser in Deno environment, we'll use regex for basic analysis
    // In a production environment, you'd want to use a proper HTML parser library
    
    // Example: Check for title tag
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : null;
    
    // Check for meta description
    const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i) || 
                          html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i);
    const metaDescription = metaDescMatch ? metaDescMatch[1].trim() : null;
    
    // Check for h1 tags
    const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
    const h1 = h1Match ? h1Match[1].trim() : null;
    
    // Initialize issues counter
    let issuesCount = 0;
    
    // Check for missing title
    if (!title || title.length === 0) {
      issuesCount++;
      
      // Record the issue in the database
      await supabase
        .from('seo_crawler_issues')
        .insert({
          page_id: pageId,
          crawl_id: crawlId,
          issue_type: 'missing_title',
          severity: 'high',
          description: 'The page is missing a title tag'
        });
    } else if (title.length < 10 || title.length > 60) {
      issuesCount++;
      
      // Record the issue in the database
      await supabase
        .from('seo_crawler_issues')
        .insert({
          page_id: pageId,
          crawl_id: crawlId,
          issue_type: 'title_length',
          severity: 'medium',
          description: `The title tag length (${title.length} characters) is ${title.length < 10 ? 'too short' : 'too long'}`
        });
    }
    
    // Check for missing meta description
    if (!metaDescription || metaDescription.length === 0) {
      issuesCount++;
      
      await supabase
        .from('seo_crawler_issues')
        .insert({
          page_id: pageId,
          crawl_id: crawlId,
          issue_type: 'missing_meta_description',
          severity: 'medium',
          description: 'The page is missing a meta description tag'
        });
    } else if (metaDescription.length < 50 || metaDescription.length > 160) {
      issuesCount++;
      
      await supabase
        .from('seo_crawler_issues')
        .insert({
          page_id: pageId,
          crawl_id: crawlId,
          issue_type: 'meta_description_length',
          severity: 'low',
          description: `The meta description length (${metaDescription.length} characters) is ${metaDescription.length < 50 ? 'too short' : 'too long'}`
        });
    }
    
    // Check for missing h1
    if (!h1 || h1.length === 0) {
      issuesCount++;
      
      await supabase
        .from('seo_crawler_issues')
        .insert({
          page_id: pageId,
          crawl_id: crawlId,
          issue_type: 'missing_h1',
          severity: 'medium',
          description: 'The page is missing an H1 heading'
        });
    }
    
    // Update the page record with the analyzed content
    await supabase
      .from('seo_crawler_pages')
      .update({
        title: title || '',
        meta_description: metaDescription || '',
        h1: h1 || '',
        issues_count: issuesCount
      })
      .eq('id', pageId);
    
    console.log(`Analysis complete: Found ${issuesCount} issues`);
    
    // Return the page result
    return {
      pageId,
      url,
      title: title || '',
      metaDescription: metaDescription || '',
      h1: h1 || '',
      issues: issuesCount
    };
    
  } catch (error) {
    console.error(`Error processing HTML: ${error}`);
    await registerCrawlerError(supabase, crawlId, url, error instanceof Error ? error.message : String(error));
    return null;
  }
}
