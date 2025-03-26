
// Database operations for HTML analysis
import { SupabaseInstance } from '../../types.ts';

/**
 * Creates a page record in the database
 */
export async function createPageRecord(
  supabase: SupabaseInstance, 
  crawlId: string, 
  url: string
): Promise<string | null> {
  try {
    console.log(`Inserting page with data: ${JSON.stringify({
      crawl_id: crawlId,
      url: url,
      status_code: 200,
      content_type: 'text/html'
    })}`);
    
    const { data, error } = await supabase
      .from('seo_crawler_pages')
      .insert({
        crawl_id: crawlId,
        url: url,
        status_code: 200,
        content_type: 'text/html'
      })
      .select('id')
      .single();
    
    if (error) {
      console.error(`Error inserting page record: ${error.message}`, error);
      console.error(`SQL: ${error.details || 'No details'}, Hint: ${error.hint || 'No hint'}`);
      return null;
    }
    
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
    const { error } = await supabase
      .from('seo_crawler_issues')
      .insert(issues);
    
    if (error) {
      console.error(`Error saving issues: ${error.message}`);
      return false;
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
    // Convert links to proper format for insertion
    const linkRecords = links.map(link => ({
      crawl_id: crawlId,
      page_id: pageId,
      url: link,
      is_internal: isInternalUrl(link, baseUrl),
      is_broken: false // We'll update this later if needed
    }));
    
    // Insert in batches to avoid payload size limitations
    const batchSize = 100;
    for (let i = 0; i < linkRecords.length; i += batchSize) {
      const batch = linkRecords.slice(i, i + batchSize);
      const { error } = await supabase
        .from('seo_crawler_links')
        .insert(batch);
      
      if (error) {
        console.error(`Error saving links batch: ${error.message}`);
      }
    }
    
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
    const { error } = await supabase
      .from('seo_crawler_pages')
      .update({
        title: results.title,
        meta_description: results.metaDescription,
        h1: results.h1,
        issues_count: results.issuesCount,
        internal_links_count: results.internalLinksCount,
        external_links_count: results.externalLinksCount
      })
      .eq('id', pageId);
    
    if (error) {
      console.error(`Error updating page with analysis results: ${error.message}`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updatePageWithAnalysisResults:', error);
    return false;
  }
}

// Helper function to check if a URL is internal
function isInternalUrl(url: string, baseUrl: string): boolean {
  try {
    // Extract domain from the base URL
    const baseDomain = new URL(baseUrl).hostname;
    
    // If the URL starts with a slash, it's internal
    if (url.startsWith('/')) {
      return true;
    }
    
    // If it's an absolute URL, check if the domain matches
    if (url.startsWith('http')) {
      const linkDomain = new URL(url).hostname;
      return linkDomain === baseDomain || linkDomain.endsWith(`.${baseDomain}`);
    }
    
    // If it doesn't start with http or /, it's likely a relative URL
    return true;
  } catch (e) {
    // If there's an error parsing the URL, assume it's external
    return false;
  }
}
