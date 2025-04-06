
import { SupabaseInstance } from '../../types.ts';

/**
 * Create a page record in the database and return the page ID
 */
export async function createPageRecord(
  supabase: SupabaseInstance, 
  crawlId: string, 
  url: string, 
  data: any
): Promise<string | null> {
  try {
    const { data: pageData, error } = await supabase
      .from('seo_crawler_pages')
      .insert({
        crawl_id: crawlId,
        url: url,
        title: data.title,
        meta_description: data.metaDescription,
        h1: data.h1,
        status_code: data.statusCode,
        is_indexable: data.isIndexable,
        word_count: data.wordCount,
        robots_directives: data.robotsDirectives,
        has_schema_markup: data.hasSchemaMarkup,
        mobile_friendly: data.mobileFriendly,
        canonical_url: data.canonicalUrl,
        crawled_at: new Date().toISOString()
      })
      .select('id')
      .single();
    
    if (error) {
      console.error(`[Database] Error creating page record for ${url}:`, error);
      return null;
    }
    
    return pageData?.id || null;
  } catch (error) {
    console.error(`[Database] Exception creating page record for ${url}:`, error);
    return null;
  }
}

/**
 * Save headings to the database
 */
export async function saveHeadings(
  supabase: SupabaseInstance, 
  crawlId: string, 
  pageId: string, 
  headings: any[]
): Promise<void> {
  try {
    if (headings.length === 0) return;
    
    const headingsToInsert = headings.map(heading => ({
      crawl_id: crawlId,
      page_id: pageId,
      heading_type: heading.type || heading.heading_type,
      content: heading.content,
      position: heading.position
    }));
    
    const { error } = await supabase
      .from('seo_crawler_headings')
      .insert(headingsToInsert);
    
    if (error) {
      console.error(`[Database] Error saving headings for page ${pageId}:`, error);
    }
  } catch (error) {
    console.error(`[Database] Exception saving headings for page ${pageId}:`, error);
  }
}

/**
 * Save links to the database
 */
export async function saveLinks(
  supabase: SupabaseInstance, 
  crawlId: string, 
  pageId: string, 
  links: any[],
  sourceUrl: string
): Promise<void> {
  try {
    if (links.length === 0) return;
    
    const linksToInsert = links.map(link => ({
      crawl_id: crawlId,
      page_id: pageId,
      url: link.url,
      anchor_text: link.text || link.anchor_text || '',
      is_internal: link.is_internal === true,
      is_followed: link.is_followed !== undefined ? link.is_followed : (link.follow !== undefined ? link.follow : true),
      nofollow: link.is_followed === false || link.follow === false,
      is_broken: link.is_broken === true,
      rel_attributes: link.rel_attributes || [],
      link_text: link.text || link.anchor_text || '',
      status_code: link.status_code || null
    }));
    
    // Insert in batches to avoid hitting size limits
    const batchSize = 100;
    for (let i = 0; i < linksToInsert.length; i += batchSize) {
      const batch = linksToInsert.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('seo_crawler_links')
        .insert(batch);
      
      if (error) {
        console.error(`[Database] Error saving links batch for page ${pageId}:`, error);
      }
    }
  } catch (error) {
    console.error(`[Database] Exception saving links for page ${pageId}:`, error);
  }
}

/**
 * Save images to the database
 */
export async function saveImages(
  supabase: SupabaseInstance, 
  crawlId: string, 
  pageId: string, 
  images: any[]
): Promise<void> {
  try {
    // For now, we're just updating the page record with image stats
    // We could create a separate table for images if needed
    
    const imagesWithoutAlt = images.filter(img => !img.has_alt).length;
    
    await supabase
      .from('seo_crawler_pages')
      .update({
        image_count: images.length,
        images_without_alt: imagesWithoutAlt
      })
      .eq('id', pageId);
  } catch (error) {
    console.error(`[Database] Exception saving images for page ${pageId}:`, error);
  }
}

/**
 * Save issues to the database
 */
export async function saveIssues(
  supabase: SupabaseInstance, 
  crawlId: string, 
  issues: any[]
): Promise<void> {
  try {
    if (issues.length === 0) return;
    
    // Insert in batches to avoid hitting size limits
    const batchSize = 50;
    for (let i = 0; i < issues.length; i += batchSize) {
      const batch = issues.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('seo_crawler_issues')
        .insert(batch.map(issue => ({
          ...issue,
          crawl_id: crawlId
        })));
      
      if (error) {
        console.error(`[Database] Error saving issues batch:`, error);
      }
    }
  } catch (error) {
    console.error(`[Database] Exception saving issues:`, error);
  }
}

/**
 * Update page record with analysis results
 */
export async function updatePageWithAnalysisResults(
  supabase: SupabaseInstance, 
  pageId: string, 
  data: any
): Promise<void> {
  try {
    const { error } = await supabase
      .from('seo_crawler_pages')
      .update({
        issues_count: data.issuesCount || 0,
        internal_links_count: data.internalLinksCount || 0,
        external_links_count: data.externalLinksCount || 0,
        h1_count: data.h1Count,
        h2_count: data.h2Count,
        h3_count: data.h3Count
      })
      .eq('id', pageId);
    
    if (error) {
      console.error(`[Database] Error updating page analysis results for ${pageId}:`, error);
    }
  } catch (error) {
    console.error(`[Database] Exception updating page analysis results for ${pageId}:`, error);
  }
}
