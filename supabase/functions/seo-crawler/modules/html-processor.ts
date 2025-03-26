
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
    console.log(`Processing HTML for URL: ${url}, HTML length: ${html.length} characters`);
    
    // Create a page record in the database - using existing columns only
    console.log(`Creating page record in database for crawl_id: ${crawlId}`);
    const { data: pageData, error: pageError } = await supabase
      .from('seo_crawler_pages')
      .insert({
        crawl_id: crawlId,
        url: url,
        status_code: 200,
        content_type: 'text/html'
        // Using existing fields only, removed analyzed_at
      })
      .select('id')
      .single();
    
    if (pageError) {
      console.error(`Error inserting page record: ${pageError.message}`, pageError);
      console.error(`SQL: ${pageError.details || 'No details'}, Hint: ${pageError.hint || 'No hint'}`);
      await registerCrawlerError(supabase, crawlId, url, `Error inserting page record: ${pageError.message}`);
      return null;
    }
    
    if (!pageData) {
      console.error('No page data returned from insert operation');
      await registerCrawlerError(supabase, crawlId, url, 'No page data returned from insert operation');
      return null;
    }
    
    const pageId = pageData.id;
    console.log(`Created page record with ID: ${pageId}`);
    
    console.log('Starting regex-based HTML analysis');
    
    // Since we don't have DOMParser in Deno environment, we'll use regex for analysis
    // Example: Check for title tag
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : null;
    console.log(`Title extracted: ${title || 'Not found'}`);
    
    // Check for meta description
    const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i) || 
                          html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i);
    const metaDescription = metaDescMatch ? metaDescMatch[1].trim() : null;
    console.log(`Meta description extracted: ${metaDescription ? (metaDescription.substring(0, 50) + '...') : 'Not found'}`);
    
    // Check for h1 tags
    const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
    const h1 = h1Match ? h1Match[1].trim() : null;
    console.log(`H1 extracted: ${h1 || 'Not found'}`);
    
    // Initialize issues counter
    let issuesCount = 0;
    console.log('Starting SEO issue analysis');
    
    // Check for missing title
    if (!title || title.length === 0) {
      issuesCount++;
      console.log('Issue detected: missing title');
      
      // Record the issue in the database
      try {
        const { error: issueError } = await supabase
          .from('seo_crawler_issues')
          .insert({
            page_id: pageId,
            crawl_id: crawlId,
            issue_type: 'missing_title',
            severity: 'high',
            description: 'The page is missing a title tag'
          });
          
        if (issueError) {
          console.error(`Error recording missing title issue: ${issueError.message}`);
        }
      } catch (err) {
        console.error('Exception recording missing title issue:', err);
      }
    } else if (title.length < 10 || title.length > 60) {
      issuesCount++;
      console.log(`Issue detected: title length (${title.length} characters)`);
      
      // Record the issue in the database
      try {
        const { error: issueError } = await supabase
          .from('seo_crawler_issues')
          .insert({
            page_id: pageId,
            crawl_id: crawlId,
            issue_type: 'title_length',
            severity: 'medium',
            description: `The title tag length (${title.length} characters) is ${title.length < 10 ? 'too short' : 'too long'}`
          });
          
        if (issueError) {
          console.error(`Error recording title length issue: ${issueError.message}`);
        }
      } catch (err) {
        console.error('Exception recording title length issue:', err);
      }
    }
    
    // Check for missing meta description
    if (!metaDescription || metaDescription.length === 0) {
      issuesCount++;
      console.log('Issue detected: missing meta description');
      
      try {
        const { error: issueError } = await supabase
          .from('seo_crawler_issues')
          .insert({
            page_id: pageId,
            crawl_id: crawlId,
            issue_type: 'missing_meta_description',
            severity: 'medium',
            description: 'The page is missing a meta description tag'
          });
          
        if (issueError) {
          console.error(`Error recording missing meta description issue: ${issueError.message}`);
        }
      } catch (err) {
        console.error('Exception recording missing meta description issue:', err);
      }
    } else if (metaDescription.length < 50 || metaDescription.length > 160) {
      issuesCount++;
      console.log(`Issue detected: meta description length (${metaDescription.length} characters)`);
      
      try {
        const { error: issueError } = await supabase
          .from('seo_crawler_issues')
          .insert({
            page_id: pageId,
            crawl_id: crawlId,
            issue_type: 'meta_description_length',
            severity: 'low',
            description: `The meta description length (${metaDescription.length} characters) is ${metaDescription.length < 50 ? 'too short' : 'too long'}`
          });
          
        if (issueError) {
          console.error(`Error recording meta description length issue: ${issueError.message}`);
        }
      } catch (err) {
        console.error('Exception recording meta description length issue:', err);
      }
    }
    
    // Check for missing h1
    if (!h1 || h1.length === 0) {
      issuesCount++;
      console.log('Issue detected: missing H1');
      
      try {
        const { error: issueError } = await supabase
          .from('seo_crawler_issues')
          .insert({
            page_id: pageId,
            crawl_id: crawlId,
            issue_type: 'missing_h1',
            severity: 'medium',
            description: 'The page is missing an H1 heading'
          });
          
        if (issueError) {
          console.error(`Error recording missing H1 issue: ${issueError.message}`);
        }
      } catch (err) {
        console.error('Exception recording missing H1 issue:', err);
      }
    }
    
    // Update the page record with the analyzed content
    console.log('Updating page record with analysis results');
    try {
      const { error: updateError } = await supabase
        .from('seo_crawler_pages')
        .update({
          title: title || '',
          meta_description: metaDescription || '',
          h1: h1 || '',
          issues_count: issuesCount
        })
        .eq('id', pageId);
        
      if (updateError) {
        console.error(`Error updating page record: ${updateError.message}`);
      }
    } catch (err) {
      console.error('Exception updating page record:', err);
    }
    
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
    console.error(`Error processing HTML: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error(`Stack trace: ${error instanceof Error ? error.stack : 'No stack trace'}`);
    await registerCrawlerError(supabase, crawlId, url, error instanceof Error ? error.message : String(error));
    return null;
  }
}
