
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
    console.log(`Processing HTML for URL: ${url}, HTML length: ${html.length} characters`);
    
    // Create a page record in the database
    console.log(`Creating page record in database for crawl_id: ${crawlId}`);
    
    const pageId = await createPageRecord(supabase, crawlId, url);
    
    if (!pageId) {
      await registerCrawlerError(supabase, crawlId, url, 'Failed to create page record');
      return null;
    }
    
    console.log('Starting HTML analysis for page content');
    
    // Extract data from HTML
    const title = extractTitle(html);
    console.log(`Title extracted: ${title || 'Not found'}`);
    
    const metaDescription = extractMetaDescription(html);
    console.log(`Meta description extracted: ${metaDescription ? (metaDescription.substring(0, 50) + '...') : 'Not found'}`);
    
    const h1 = extractH1(html);
    console.log(`H1 extracted: ${h1 || 'Not found'}`);
    
    // Extract word count
    const wordCount = extractWordCount(html);
    console.log(`Word count: ${wordCount}`);
    
    // Extract and save headings
    const headings = extractHeadings(html);
    console.log(`Found ${headings.length} headings on the page`);
    
    if (headings.length > 0) {
      await saveHeadings(supabase, crawlId, pageId, headings);
    }
    
    // Extract and save images
    const images = extractImages(html, url);
    console.log(`Found ${images.length} images on the page`);
    
    if (images.length > 0) {
      await saveImages(supabase, crawlId, pageId, images);
    }
    
    // Extract and categorize links
    const links = extractLinks(html, url);
    console.log(`Found ${links.length} links on the page`);
    
    const { internalLinks, externalLinks } = categorizeLinks(links, url);
    console.log(`Internal links: ${internalLinks.length}, External links: ${externalLinks.length}`);
    
    // Detect SEO issues
    console.log('Starting SEO issue analysis');
    
    const { issues, count: issuesCount } = detectAllIssues(pageId, {
      title,
      metaDescription,
      h1,
      wordCount,
      images
    });
    
    // Save issues to database
    if (issues.length > 0) {
      await saveIssues(supabase, issues);
    }
    
    // Save links to database
    if (links.length > 0) {
      await saveLinks(supabase, crawlId, pageId, links, url);
    }
    
    // Update the page record with analysis results
    console.log('Updating page record with analysis results');
    
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
    
    console.log(`Analysis complete: Found ${issuesCount} issues`);
    
    // Return the page result with links
    return {
      pageId,
      url,
      title: title || '',
      metaDescription: metaDescription || '',
      h1: h1 || '',
      issues: issuesCount,
      statusCode: 200,
      links: internalLinks.slice(0, 100) // Return only internal links, limited to 100
    };
    
  } catch (error) {
    console.error(`Error processing HTML: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error(`Stack trace: ${error instanceof Error ? error.stack : 'No stack trace'}`);
    await registerCrawlerError(supabase, crawlId, url, error instanceof Error ? error.message : String(error));
    return null;
  }
}
