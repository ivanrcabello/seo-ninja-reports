
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
  extractWordCount,
  extractRobotsMeta,
  extractSchemaMarkup,
  detectMobileFriendly,
  extractCanonicalUrl
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
  console.log(`[HTML Analysis] Starting analysis for URL: ${url}`);
  
  try {
    // Extract core page data
    const title = extractTitle(html);
    const metaDescription = extractMetaDescription(html);
    const h1 = extractH1(html);
    const wordCount = extractWordCount(html);
    const images = extractImages(html, url);
    const robotsMeta = extractRobotsMeta(html);
    const schemaMarkup = extractSchemaMarkup(html);
    const hasSchemaMarkup = schemaMarkup.length > 0;
    const mobileFriendly = detectMobileFriendly(html);
    const canonicalUrl = extractCanonicalUrl(html);

    console.log(`[HTML Analysis] Extracted core data - Title: ${title ? 'Yes' : 'No'}, Meta: ${metaDescription ? 'Yes' : 'No'}, H1: ${h1 ? 'Yes' : 'No'}, Words: ${wordCount}`);
    console.log(`[HTML Analysis] Advanced data - Schema Markup: ${hasSchemaMarkup ? 'Yes' : 'No'}, Mobile Friendly: ${mobileFriendly ? 'Yes' : 'No'}, Robots: ${robotsMeta || 'None'}, Canonical: ${canonicalUrl || 'None'}`);

    // Create the page record and get the page ID
    console.log(`[HTML Analysis] Creating page record for: ${url}`);
    const pageId = await createPageRecord(supabase, crawlId, url, {
      title,
      metaDescription,
      h1,
      wordCount,
      statusCode: 200,
      isIndexable: !robotsMeta?.includes('noindex'),
      robotsDirectives: robotsMeta,
      hasSchemaMarkup,
      mobileFriendly,
      canonicalUrl
    });
    
    if (!pageId) {
      throw new Error('Failed to create page record in database');
    }
    
    console.log(`[HTML Analysis] Page record created with ID: ${pageId}`);
    
    // Extract and save headings
    const headings = extractHeadings(html);
    console.log(`[HTML Analysis] Extracted ${headings.length} headings (H1s: ${headings.filter(h => h.type === 'h1').length}, H2s: ${headings.filter(h => h.type === 'h2').length}, H3+: ${headings.filter(h => !['h1', 'h2'].includes(h.type)).length})`);
    
    if (headings.length > 0) {
      console.log(`[HTML Analysis] Saving ${headings.length} headings`);
      await saveHeadings(supabase, crawlId, pageId, headings);
    }
    
    // Extract and process links
    const links = extractLinks(html, url);
    const { 
      internalLinks, 
      externalLinks 
    } = categorizeLinks(links, url);
    
    console.log(`[HTML Analysis] Extracted ${links.length} links (internal: ${internalLinks.length}, external: ${externalLinks.length})`);
    
    if (links.length > 0) {
      console.log(`[HTML Analysis] Saving ${links.length} links`);
      await saveLinks(supabase, crawlId, pageId, links, url);
    }
    
    // Save images if found
    if (images.length > 0) {
      console.log(`[HTML Analysis] Saving ${images.length} images`);
      await saveImages(supabase, crawlId, pageId, images);
    }
    
    // Detect issues and save them
    const pageData = {
      title,
      metaDescription,
      h1,
      wordCount,
      images,
      robotsMeta,
      hasSchemaMarkup,
      mobileFriendly,
      canonicalUrl,
      headings
    };
    
    const { issues, count } = detectAllIssues(pageId, pageData);
    console.log(`[HTML Analysis] Detected ${count} issues`);
    
    if (issues.length > 0) {
      console.log(`[HTML Analysis] Saving ${issues.length} issues`);
      await saveIssues(supabase, crawlId, issues);
    }
    
    // Calculate counts for headings by type
    const h1Count = headings.filter(h => h.type === 'h1').length;
    const h2Count = headings.filter(h => h.type === 'h2').length;
    const h3Count = headings.filter(h => h.type === 'h3').length;
    
    // Update the page record with analysis results
    await updatePageWithAnalysisResults(supabase, pageId, {
      issuesCount: count,
      internalLinksCount: internalLinks.length,
      externalLinksCount: externalLinks.length,
      h1Count,
      h2Count,
      h3Count
    });
    
    console.log(`[HTML Analysis] Analysis completed for: ${url}`);
    
    // Return data for the crawler to continue
    return {
      pageId,
      url,
      title: title || null,
      metaDescription: metaDescription || null,
      h1: h1 || null,
      issues: count,
      statusCode: 200,
      links: internalLinks.map(link => link.url)
    };
  } catch (error) {
    console.error(`[HTML Analysis] Error processing HTML for ${url}:`, error);
    
    // Register the error in database
    try {
      await registerCrawlerError(
        supabase,
        crawlId,
        `HTML analysis error for ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } catch (dbError) {
      console.error(`[HTML Analysis] Failed to register error in database:`, dbError);
    }
    
    return null;
  }
}
