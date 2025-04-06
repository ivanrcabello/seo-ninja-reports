
import { SupabaseInstance } from '../../types.ts';

/**
 * Create a new page record in the database
 */
export async function createPageRecord(
  supabase: SupabaseInstance,
  crawlId: string,
  url: string
): Promise<string | null> {
  try {
    console.log(`Creating page record for URL: ${url} in crawl: ${crawlId}`);
    
    const { data, error } = await supabase
      .from('seo_crawler_pages')
      .insert({
        crawl_id: crawlId,
        url: url,
        status_code: 200, // Assume success since we have HTML content
        is_indexable: true,
        crawled_at: new Date().toISOString()
      })
      .select('id')
      .single();
    
    if (error) {
      console.error(`Error creating page record: ${error.message}`);
      return null;
    }
    
    console.log(`Created page record with ID: ${data.id}`);
    return data.id;
  } catch (error) {
    console.error(`Error in createPageRecord: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

/**
 * Save SEO issues to the database
 */
export async function saveIssues(
  supabase: SupabaseInstance,
  issues: Array<{
    crawl_id: string;
    page_id: string;
    issue_type: string;
    description: string;
    severity: string;
    page_url?: string;
    recommended_fix?: string;
  }>
): Promise<void> {
  if (issues.length === 0) return;
  
  try {
    console.log(`Saving ${issues.length} issues to database`);
    
    const { error } = await supabase
      .from('seo_crawler_issues')
      .insert(issues);
    
    if (error) {
      console.error(`Error saving issues: ${error.message}`);
    } else {
      console.log(`Successfully saved ${issues.length} issues`);
    }
  } catch (error) {
    console.error(`Error in saveIssues: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Save links to the database
 */
export async function saveLinks(
  supabase: SupabaseInstance,
  crawlId: string,
  pageId: string,
  links: string[],
  baseUrl: string
): Promise<void> {
  if (links.length === 0) return;
  
  try {
    console.log(`Saving ${links.length} links to database for page ${pageId}`);
    
    const linkRecords = links.map(url => {
      // Determine if link is internal or external
      let isInternal = false;
      try {
        const linkHost = new URL(url.startsWith('http') ? url : new URL(url, baseUrl).href).hostname;
        const baseHost = new URL(baseUrl).hostname;
        isInternal = linkHost === baseHost;
      } catch (e) {
        // If we can't parse the URL, assume it's internal
        isInternal = true;
      }
      
      return {
        crawl_id: crawlId,
        page_id: pageId,
        url: url,
        is_internal: isInternal
      };
    });
    
    // Split into chunks if there are too many links
    const chunkSize = 100;
    for (let i = 0; i < linkRecords.length; i += chunkSize) {
      const chunk = linkRecords.slice(i, i + chunkSize);
      
      const { error } = await supabase
        .from('seo_crawler_links')
        .insert(chunk);
      
      if (error) {
        console.error(`Error saving links chunk ${i / chunkSize + 1}: ${error.message}`);
      }
    }
    
    console.log(`Successfully saved links for page ${pageId}`);
  } catch (error) {
    console.error(`Error in saveLinks: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Save headings to the database
 */
export async function saveHeadings(
  supabase: SupabaseInstance,
  crawlId: string,
  pageId: string,
  headings: Array<{
    heading_type: string;
    content: string;
    position: number;
  }>
): Promise<void> {
  if (headings.length === 0) return;
  
  try {
    console.log(`Saving ${headings.length} headings to database for page ${pageId}`);
    
    const headingRecords = headings.map(heading => ({
      crawl_id: crawlId,
      page_id: pageId,
      heading_type: heading.heading_type,
      content: heading.content,
      position: heading.position
    }));
    
    const { error } = await supabase
      .from('seo_crawler_headings')
      .insert(headingRecords);
    
    if (error) {
      console.error(`Error saving headings: ${error.message}`);
    } else {
      console.log(`Successfully saved ${headings.length} headings`);
    }
  } catch (error) {
    console.error(`Error in saveHeadings: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Save images to the database
 */
export async function saveImages(
  supabase: SupabaseInstance,
  crawlId: string,
  pageId: string,
  images: Array<{
    src: string;
    alt: string | null;
  }>
): Promise<void> {
  // Check if there's a table for images, if not we'll just skip this
  try {
    // We don't actually have an images table in the schema yet, so we'll just log
    console.log(`Would save ${images.length} images to database for page ${pageId}`);
    
    // Count images without alt text
    const imagesWithoutAlt = images.filter(img => !img.alt).length;
    
    // Update the page record with image stats
    await supabase
      .from('seo_crawler_pages')
      .update({
        image_count: images.length,
        images_without_alt: imagesWithoutAlt,
        image_data: images
      })
      .eq('id', pageId);
    
    console.log(`Updated page record with image stats`);
  } catch (error) {
    console.error(`Error in saveImages: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Update page record with analysis results
 */
export async function updatePageWithAnalysisResults(
  supabase: SupabaseInstance,
  pageId: string,
  results: {
    title: string | null;
    metaDescription: string | null;
    h1: string | null;
    wordCount: number;
    issuesCount: number;
    internalLinksCount: number;
    externalLinksCount: number;
    imageCount: number;
    imagesWithoutAlt: number;
  }
): Promise<void> {
  try {
    console.log(`Updating page ${pageId} with analysis results`);
    
    const { error } = await supabase
      .from('seo_crawler_pages')
      .update({
        title: results.title,
        meta_description: results.metaDescription,
        h1: results.h1,
        word_count: results.wordCount,
        issues_count: results.issuesCount,
        internal_links_count: results.internalLinksCount,
        external_links_count: results.externalLinksCount,
        image_count: results.imageCount,
        images_without_alt: results.imagesWithoutAlt
      })
      .eq('id', pageId);
    
    if (error) {
      console.error(`Error updating page with analysis results: ${error.message}`);
    } else {
      console.log(`Successfully updated page ${pageId} with analysis results`);
    }
  } catch (error) {
    console.error(`Error in updatePageWithAnalysisResults: ${error instanceof Error ? error.message : String(error)}`);
  }
}
