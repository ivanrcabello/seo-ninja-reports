
import { SupabaseInstance, Heading, Image, Link, SEOIssue } from "../../types.ts";

/**
 * Create a page record in the database
 */
export async function createPageRecord(
  supabase: SupabaseInstance, 
  crawlId: string, 
  url: string
): Promise<string | null> {
  try {
    console.log(`Creating page record for URL: ${url}, crawl_id: ${crawlId}`);
    
    const { data, error } = await supabase
      .from('seo_crawler_pages')
      .insert({
        crawl_id: crawlId,
        url: url,
        status_code: 200,
        crawled_at: new Date().toISOString(),
      })
      .select('id')
      .single();
    
    if (error) {
      console.error(`Error inserting page record: ${error.message}`, error);
      
      // The error is likely an RLS issue, let's try to update the crawl with this information
      await supabase
        .from('seo_crawler_crawls')
        .update({
          error_message: `Database permission error: ${error.message}. This may be a Row Level Security (RLS) issue.`,
        })
        .eq('id', crawlId);
        
      return null;
    }
    
    return data.id;
  } catch (error) {
    console.error(`Exception creating page record: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

/**
 * Save SEO issues to the database
 */
export async function saveIssues(
  supabase: SupabaseInstance, 
  issues: SEOIssue[]
): Promise<void> {
  if (issues.length === 0) return;
  
  try {
    const { error } = await supabase
      .from('seo_crawler_issues')
      .insert(issues);
    
    if (error) {
      console.error(`Error inserting issues: ${error.message}`, error);
    }
  } catch (error) {
    console.error(`Exception saving issues: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Save links to the database
 */
export async function saveLinks(
  supabase: SupabaseInstance, 
  crawlId: string,
  pageId: string, 
  links: Link[], 
  sourceUrl: string
): Promise<void> {
  if (links.length === 0) return;
  
  try {
    const linksToInsert = links.map((link, index) => ({
      crawl_id: crawlId,
      page_id: pageId,
      url: link.url,
      text: link.text || '',
      is_internal: link.is_internal,
      is_followed: link.is_followed,
      source_url: sourceUrl,
      position: index + 1,
    }));
    
    const { error } = await supabase
      .from('seo_crawler_links')
      .insert(linksToInsert);
    
    if (error) {
      console.error(`Error inserting links: ${error.message}`, error);
    }
  } catch (error) {
    console.error(`Exception saving links: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Save headings to the database
 */
export async function saveHeadings(
  supabase: SupabaseInstance, 
  crawlId: string,
  pageId: string, 
  headings: Heading[]
): Promise<void> {
  if (headings.length === 0) return;
  
  try {
    const headingsToInsert = headings.map(heading => ({
      crawl_id: crawlId,
      page_id: pageId,
      type: heading.type,
      content: heading.content,
      position: heading.position,
    }));
    
    const { error } = await supabase
      .from('seo_crawler_headings')
      .insert(headingsToInsert);
    
    if (error) {
      console.error(`Error inserting headings: ${error.message}`, error);
    }
  } catch (error) {
    console.error(`Exception saving headings: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Save images to the database
 */
export async function saveImages(
  supabase: SupabaseInstance, 
  crawlId: string,
  pageId: string, 
  images: Image[]
): Promise<void> {
  if (images.length === 0) return;
  
  try {
    const imagesToInsert = images.map((image, index) => ({
      crawl_id: crawlId,
      page_id: pageId,
      src: image.src,
      alt: image.alt,
      has_alt: image.has_alt,
      position: index + 1,
    }));
    
    const { error } = await supabase
      .from('seo_crawler_images')
      .insert(imagesToInsert);
    
    if (error) {
      console.error(`Error inserting images: ${error.message}`, error);
    }
  } catch (error) {
    console.error(`Exception saving images: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Update a page record with analysis results
 */
export async function updatePageWithAnalysisResults(
  supabase: SupabaseInstance,
  pageId: string,
  results: {
    title: string;
    metaDescription: string;
    h1: string;
    wordCount: number;
    issuesCount: number;
    internalLinksCount: number;
    externalLinksCount: number;
    imageCount: number;
    imagesWithoutAlt: number;
  }
): Promise<void> {
  try {
    const { error } = await supabase
      .from('seo_crawler_pages')
      .update({
        title: results.title || '',
        meta_description: results.metaDescription || '',
        h1: results.h1 || '',
        word_count: results.wordCount || 0,
        issues_count: results.issuesCount || 0,
        internal_links_count: results.internalLinksCount || 0,
        external_links_count: results.externalLinksCount || 0,
        images_count: results.imageCount || 0,
        images_without_alt_count: results.imagesWithoutAlt || 0,
        updated_at: new Date().toISOString()
      })
      .eq('id', pageId);
    
    if (error) {
      console.error(`Error updating page record: ${error.message}`, error);
    }
  } catch (error) {
    console.error(`Exception updating page: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Update crawl summary with aggregate data
 */
export async function updateCrawlSummary(
  supabase: SupabaseInstance,
  crawlId: string,
  data: {
    totalPages: number;
    totalIssues: number;
    totalLinks: number;
    totalInternalLinks: number;
    totalExternalLinks: number;
    totalBrokenLinks: number;
    pagesCrawled: number;
  }
): Promise<void> {
  try {
    const { error } = await supabase
      .from('seo_crawler_crawls')
      .update({
        total_pages: data.totalPages,
        total_issues: data.totalIssues,
        total_links: data.totalLinks,
        total_internal_links: data.totalInternalLinks,
        total_external_links: data.totalExternalLinks,
        total_broken_links: data.totalBrokenLinks,
        pages_crawled: data.pagesCrawled,
        updated_at: new Date().toISOString()
      })
      .eq('id', crawlId);
    
    if (error) {
      console.error(`Error updating crawl summary: ${error.message}`, error);
    }
  } catch (error) {
    console.error(`Exception updating crawl summary: ${error instanceof Error ? error.message : String(error)}`);
  }
}
