
// Main HTML analysis module - entry point
import { SupabaseInstance, PageCrawlResult } from '../../types.ts';
import { registerCrawlerError, isInternalUrl } from '../../utils.ts';
import { 
  extractTitle, 
  extractMetaDescription, 
  extractH1, 
  extractLinks,
  categorizeLinks,
  extractHeadings,
  extractImages,
  extractWordCount
} from './extractors.ts';
import { detectAllIssues } from './issue-detector.ts';
import {
  createPageRecord,
  saveIssues,
  saveLinks,
  saveHeadings,
  saveImages,
  updatePageWithAnalysisResults
} from './database-operations.ts';

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
    console.log(`[HTML Analysis] Processing HTML for URL: ${url}, HTML length: ${html.length} characters`);
    
    // First, create the page record in the database
    console.log(`[HTML Analysis] Creating initial page record for crawl_id: ${crawlId}, url: ${url}`);
    const pageId = await createPageRecord(supabase, crawlId, url);
    
    if (!pageId) {
      console.error(`[HTML Analysis] Failed to create page record for ${url}`);
      await registerCrawlerError(supabase, crawlId, url, 'Failed to create page record in database');
      return null;
    }
    
    console.log(`[HTML Analysis] Page record created with ID: ${pageId}`);
    console.log('[HTML Analysis] Starting extraction of page elements');
    
    // Extract data from HTML
    const title = extractTitle(html);
    const metaDescription = extractMetaDescription(html);
    const h1 = extractH1(html);
    
    // Log extracted data
    console.log(`[HTML Analysis] Extracted title: "${title || 'Not found'}"`);
    console.log(`[HTML Analysis] Extracted meta description: "${metaDescription ? (metaDescription.substring(0, 50) + '...') : 'Not found'}"`);
    console.log(`[HTML Analysis] Extracted H1: "${h1 || 'Not found'}"`);
    
    // Extract word count
    const wordCount = extractWordCount(html);
    console.log(`[HTML Analysis] Word count: ${wordCount}`);
    
    // Extract and save headings
    const headings = extractHeadings(html);
    console.log(`[HTML Analysis] Found ${headings.length} headings on the page`);
    
    if (headings.length > 0) {
      console.log('[HTML Analysis] Saving headings to database');
      await saveHeadings(supabase, crawlId, pageId, headings);
    }
    
    // Extract and save images
    const images = extractImages(html, url);
    console.log(`[HTML Analysis] Found ${images.length} images on the page`);
    
    if (images.length > 0) {
      console.log('[HTML Analysis] Saving images to database');
      await saveImages(supabase, crawlId, pageId, images);
    }
    
    // Extract and categorize links
    console.log('[HTML Analysis] Extracting links');
    const links = extractLinks(html, url);
    console.log(`[HTML Analysis] Found ${links.length} links on the page`);
    
    const { internalLinks, externalLinks } = categorizeLinks(links, url);
    console.log(`[HTML Analysis] Internal links: ${internalLinks.length}, External links: ${externalLinks.length}`);
    
    // Detect SEO issues
    console.log('[HTML Analysis] Starting SEO issue detection');
    
    const { issues, count: issuesCount } = detectAllIssues(pageId, {
      title,
      metaDescription,
      h1,
      wordCount,
      images
    });
    
    console.log(`[HTML Analysis] Detected ${issues.length} issues with count ${issuesCount}`);
    
    // Save issues to database
    if (issues.length > 0) {
      console.log('[HTML Analysis] Saving issues to database');
      await saveIssues(supabase, issues);
    }
    
    // Save links to database
    if (links.length > 0) {
      console.log('[HTML Analysis] Saving links to database');
      await saveLinks(supabase, crawlId, pageId, links, url);
    }
    
    // Update the page record with analysis results
    console.log('[HTML Analysis] Updating page record with analysis results');
    
    await updatePageWithAnalysisResults(supabase, pageId, {
      title,
      metaDescription,
      h1,
      wordCount,
      issuesCount,
      internalLinksCount: internalLinks.length,
      externalLinksCount: externalLinks.length,
      imageCount: images.length,
      imagesWithoutAlt: images.filter(img => !img.alt).length
    });
    
    console.log(`[HTML Analysis] Analysis complete for ${url}: Found ${issuesCount} issues`);
    
    // Return the page result with links
    return {
      pageId,
      url,
      title: title || '',
      metaDescription: metaDescription || '',
      h1: h1 || '',
      issues: issuesCount,
      statusCode: 200,
      links: links // Return all links, not just internal
    };
    
  } catch (error) {
    console.error(`[HTML Analysis] Error processing HTML: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error(`[HTML Analysis] Stack trace: ${error instanceof Error ? error.stack : 'No stack trace'}`);
    await registerCrawlerError(supabase, crawlId, url, error instanceof Error ? error.message : String(error));
    
    try {
      // Create a minimal page record for the failure case
      console.log(`[HTML Analysis] Creating minimal page record for error case: ${url}`);
      const { data, error: pageError } = await supabase
        .from('seo_crawler_pages')
        .insert({
          crawl_id: crawlId,
          url: url,
          status_code: 500,
          is_indexable: false,
          title: `Error analyzing ${url}`,
          meta_description: `Analysis error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          h1: 'Error page',
          issues_count: 1
        })
        .select('id')
        .single();
        
      if (pageError) {
        console.error(`[HTML Analysis] Failed to create error page record: ${pageError.message}`);
        return null;
      }
      
      // Add an error issue
      await supabase
        .from('seo_crawler_issues')
        .insert({
          crawl_id: crawlId,
          page_id: data.id,
          issue_type: 'analysis_error',
          description: `Error during HTML analysis: ${error instanceof Error ? error.message : 'Unknown error'}`,
          severity: 'high'
        });
      
      return {
        pageId: data.id,
        url,
        title: `Error analyzing ${url}`,
        metaDescription: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        h1: 'Error page',
        issues: 1,
        statusCode: 500,
        links: []
      };
    } catch (dbError) {
      console.error(`[HTML Analysis] Error creating fallback page record: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`);
      return null;
    }
  }
}
