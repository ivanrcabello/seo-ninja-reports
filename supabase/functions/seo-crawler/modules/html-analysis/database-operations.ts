
// Database operations for HTML analysis
import { SupabaseInstance } from '../../types.ts';
import { isInternalUrl } from '../../utils.ts';

/**
 * Creates a page record in the database
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
        content_type: 'text/html',
        is_indexable: true,
        crawled_at: new Date().toISOString()
      })
      .select('id')
      .single();
    
    if (error) {
      console.error(`Error inserting page record: ${error.message}`, error);
      console.error(`SQL: ${error.details || 'No details'}, Hint: ${error.hint || 'No hint'}`);
      
      // Try to get the page if it already exists
      try {
        const { data: existingPage, error: selectError } = await supabase
          .from('seo_crawler_pages')
          .select('id')
          .eq('crawl_id', crawlId)
          .eq('url', url)
          .maybeSingle();
          
        if (selectError) {
          console.error(`Error checking for existing page: ${selectError.message}`);
          return null;
        }
        
        if (existingPage) {
          console.log(`Found existing page record with ID: ${existingPage.id}`);
          return existingPage.id;
        }
      } catch (selectErr) {
        console.error(`Error checking for existing page: ${selectErr}`);
      }
      
      return null;
    }
    
    console.log(`Created page record with ID: ${data.id}`);
    return data.id;
  } catch (error) {
    console.error('Error in createPageRecord:', error);
    return null;
  }
}

/**
 * Saves SEO issues to the database
 */
export async function saveIssues(
  supabase: SupabaseInstance, 
  issues: Array<any>
): Promise<boolean> {
  if (issues.length === 0) return true;
  
  try {
    console.log(`Saving ${issues.length} issues to database`);
    
    // Insert in batches to avoid payload size limitations
    const batchSize = 50;
    for (let i = 0; i < issues.length; i += batchSize) {
      const batch = issues.slice(i, i + batchSize);
      const { error } = await supabase
        .from('seo_crawler_issues')
        .insert(batch);
      
      if (error) {
        console.error(`Error saving issues batch: ${error.message}`, error);
        console.error(`SQL: ${error.details || 'No details'}, Hint: ${error.hint || 'No hint'}`);
      } else {
        console.log(`Successfully saved batch of ${batch.length} issues`);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in saveIssues:', error);
    return false;
  }
}

/**
 * Saves links found on the page to the database
 */
export async function saveLinks(
  supabase: SupabaseInstance, 
  crawlId: string, 
  pageId: string, 
  links: Array<string>, 
  baseUrl: string
): Promise<boolean> {
  if (links.length === 0) return true;
  
  try {
    console.log(`Saving ${links.length} links to database for page ${pageId}`);
    
    // Convert links to proper format for insertion
    const linkRecords = links.map(link => ({
      crawl_id: crawlId,
      page_id: pageId,
      url: link,
      is_internal: isInternalUrl(link, baseUrl),
      is_broken: false // We'll update this later if needed
    }));
    
    // Insert in batches to avoid payload size limitations
    const batchSize = 50;
    for (let i = 0; i < linkRecords.length; i += batchSize) {
      const batch = linkRecords.slice(i, i + batchSize);
      const { error } = await supabase
        .from('seo_crawler_links')
        .insert(batch);
      
      if (error) {
        console.error(`Error saving links batch: ${error.message}`, error);
        console.error(`SQL: ${error.details || 'No details'}, Hint: ${error.hint || 'No hint'}`);
      } else {
        console.log(`Successfully saved batch of ${batch.length} links`);
      }
    }
    
    // Update crawl record with link counts
    const internalLinks = linkRecords.filter(link => link.is_internal).length;
    const externalLinks = linkRecords.length - internalLinks;
    
    await supabase
      .from('seo_crawler_crawls')
      .update({
        total_links: linkRecords.length,
        total_internal_links: internalLinks,
        total_external_links: externalLinks
      })
      .eq('id', crawlId);
    
    return true;
  } catch (error) {
    console.error('Error in saveLinks:', error);
    return false;
  }
}

/**
 * Updates the page record with analysis results
 */
export async function updatePageWithAnalysisResults(
  supabase: SupabaseInstance, 
  pageId: string, 
  results: {
    title?: string;
    metaDescription?: string;
    h1?: string;
    issuesCount: number;
    internalLinksCount: number;
    externalLinksCount: number;
  }
): Promise<boolean> {
  try {
    console.log(`Updating page ${pageId} with analysis results`);
    
    const { error } = await supabase
      .from('seo_crawler_pages')
      .update({
        title: results.title || null,
        meta_description: results.metaDescription || null,
        h1: results.h1 || null,
        issues_count: results.issuesCount || 0,
        internal_links_count: results.internalLinksCount || 0,
        external_links_count: results.externalLinksCount || 0,
        crawled_at: new Date().toISOString()
      })
      .eq('id', pageId);
    
    if (error) {
      console.error(`Error updating page with analysis results: ${error.message}`, error);
      console.error(`SQL: ${error.details || 'No details'}, Hint: ${error.hint || 'No hint'}`);
      return false;
    }
    
    console.log(`Successfully updated page ${pageId} with analysis results`);
    return true;
  } catch (error) {
    console.error('Error in updatePageWithAnalysisResults:', error);
    return false;
  }
}
