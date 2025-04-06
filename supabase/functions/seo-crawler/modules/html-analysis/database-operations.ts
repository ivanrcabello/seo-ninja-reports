
/**
 * Database operations for SEO crawler
 */
import { SupabaseInstance } from '../../types.ts';

interface PageData {
  title: string | null;
  metaDescription: string | null;
  h1: string | null;
  wordCount: number;
  statusCode: number;
  isIndexable: boolean;
}

interface AnalysisResults {
  issuesCount: number;
}

interface Issue {
  page_id: string;
  issue_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical' | 'info';
  description: string;
  recommended_fix?: string;
}

/**
 * Create a new page record in the database
 */
export async function createPageRecord(
  supabase: SupabaseInstance,
  crawlId: string,
  url: string,
  pageData: PageData
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('seo_crawler_pages')
      .insert({
        crawl_id: crawlId,
        url: url,
        title: pageData.title,
        meta_description: pageData.metaDescription,
        h1: pageData.h1,
        word_count: pageData.wordCount,
        status_code: pageData.statusCode,
        is_indexable: pageData.isIndexable,
        crawled_at: new Date().toISOString()
      })
      .select('id')
      .single();
      
    if (error) {
      console.error(`[DB Operations] Error creating page record: ${error.message}`);
      throw error;
    }
    
    return data?.id || null;
  } catch (error) {
    console.error(`[DB Operations] Error in createPageRecord: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
}

/**
 * Update a page record with analysis results
 */
export async function updatePageWithAnalysisResults(
  supabase: SupabaseInstance,
  pageId: string,
  results: AnalysisResults
): Promise<void> {
  try {
    const { error } = await supabase
      .from('seo_crawler_pages')
      .update({
        issues_count: results.issuesCount,
        updated_at: new Date().toISOString()
      })
      .eq('id', pageId);
      
    if (error) {
      console.error(`[DB Operations] Error updating page record: ${error.message}`);
      throw error;
    }
  } catch (error) {
    console.error(`[DB Operations] Error in updatePageWithAnalysisResults: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Save issues to the database
 */
export async function saveIssues(
  supabase: SupabaseInstance,
  crawlId: string,
  issues: Issue[]
): Promise<void> {
  if (issues.length === 0) return;
  
  try {
    const { error } = await supabase
      .from('seo_crawler_issues')
      .insert(
        issues.map(issue => ({
          crawl_id: crawlId,
          page_id: issue.page_id,
          issue_type: issue.issue_type,
          severity: issue.severity,
          description: issue.description,
          recommended_fix: issue.recommended_fix
        }))
      );
      
    if (error) {
      console.error(`[DB Operations] Error saving issues: ${error.message}`);
      throw error;
    }
  } catch (error) {
    console.error(`[DB Operations] Error in saveIssues: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Save headings to the database
 */
export async function saveHeadings(
  supabase: SupabaseInstance,
  crawlId: string,
  pageId: string,
  headings: Array<{type: string; content: string}>
): Promise<void> {
  if (headings.length === 0) return;
  
  try {
    console.log(`[DB Operations] Preparing to save ${headings.length} headings for page ${pageId}`);
    
    const formattedHeadings = headings.map((heading, index) => ({
      crawl_id: crawlId,
      page_id: pageId,
      heading_type: heading.type,
      content: heading.content,
      position: index + 1
    }));
    
    const { error } = await supabase
      .from('seo_crawler_headings')
      .insert(formattedHeadings);
      
    if (error) {
      console.error(`[DB Operations] Error saving headings: ${error.message}`);
      throw error;
    }
    
    console.log(`[DB Operations] Successfully saved ${headings.length} headings`);
  } catch (error) {
    console.error(`[DB Operations] Error in saveHeadings: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Save links to the database
 */
export async function saveLinks(
  supabase: SupabaseInstance,
  crawlId: string,
  pageId: string,
  links: Array<{url: string; text: string; isExternal: boolean}>,
  sourceUrl: string
): Promise<void> {
  if (links.length === 0) return;
  
  try {
    const { error } = await supabase
      .from('seo_crawler_links')
      .insert(
        links.map(link => ({
          crawl_id: crawlId,
          page_id: pageId,
          url: link.url,
          source_url: sourceUrl,
          anchor_text: link.text || '',
          is_internal: !link.isExternal,
          follow: true, // Default to followed links
        }))
      );
      
    if (error) {
      console.error(`[DB Operations] Error saving links: ${error.message}`);
      throw error;
    }
  } catch (error) {
    console.error(`[DB Operations] Error in saveLinks: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Save images to the database
 */
export async function saveImages(
  supabase: SupabaseInstance,
  crawlId: string,
  pageId: string,
  images: Array<{src: string; alt: string | null}>
): Promise<void> {
  if (images.length === 0) return;
  
  try {
    const { error } = await supabase
      .from('seo_crawler_images')
      .insert(
        images.map(image => ({
          crawl_id: crawlId,
          page_id: pageId,
          url: image.src,
          alt_text: image.alt
        }))
      );
      
    if (error) {
      console.error(`[DB Operations] Error saving images: ${error.message}`);
      throw error;
    }
  } catch (error) {
    console.error(`[DB Operations] Error in saveImages: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
