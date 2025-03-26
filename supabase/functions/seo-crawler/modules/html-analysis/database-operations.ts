
// Database operations for HTML analysis module
import { SupabaseInstance, SeoIssue } from '../../types.ts';

/**
 * Create a new page record in the database
 */
export async function createPageRecord(
  supabase: SupabaseInstance,
  crawlId: string,
  url: string
): Promise<string | null> {
  try {
    // Build insert object with only guaranteed fields
    const pageInsert = {
      crawl_id: crawlId,
      url: url,
      status_code: 200,
      content_type: 'text/html'
    };
    
    console.log('Inserting page with data:', JSON.stringify(pageInsert));
    
    const { data: pageData, error: pageError } = await supabase
      .from('seo_crawler_pages')
      .insert(pageInsert)
      .select('id')
      .single();
    
    if (pageError) {
      console.error(`Error inserting page record: ${pageError.message}`, pageError);
      console.error(`SQL: ${pageError.details || 'No details'}, Hint: ${pageError.hint || 'No hint'}`);
      return null;
    }
    
    if (!pageData) {
      console.error('No page data returned from insert operation');
      return null;
    }
    
    const pageId = pageData.id;
    console.log(`Created page record with ID: ${pageId}`);
    
    return pageId;
  } catch (error) {
    console.error('Exception creating page record:', error);
    return null;
  }
}

/**
 * Save detected SEO issues to the database
 */
export async function saveIssues(
  supabase: SupabaseInstance,
  issues: SeoIssue[]
): Promise<boolean> {
  if (issues.length === 0) {
    return true;
  }
  
  try {
    const { error: issuesError } = await supabase
      .from('seo_crawler_issues')
      .insert(issues);
      
    if (issuesError) {
      console.error(`Error recording issues: ${issuesError.message}`);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Exception recording issues:', err);
    return false;
  }
}

/**
 * Save extracted links to the database
 */
export async function saveLinks(
  supabase: SupabaseInstance,
  crawlId: string,
  pageId: string,
  links: string[],
  baseUrl: string
): Promise<boolean> {
  if (links.length === 0) {
    return true;
  }
  
  try {
    // Prepare links for insertion (limit to 100 to avoid overloading)
    const linksToInsert = links.slice(0, 100).map(link => ({
      crawl_id: crawlId,
      page_id: pageId,
      url: link,
      is_internal: link.includes(new URL(baseUrl).hostname),
      is_broken: false
    }));
    
    if (linksToInsert.length > 0) {
      const { error: linksError } = await supabase
        .from('seo_crawler_links')
        .insert(linksToInsert);
        
      if (linksError) {
        console.error(`Error saving links: ${linksError.message}`);
        return false;
      } else {
        console.log(`Saved ${linksToInsert.length} links to database`);
        return true;
      }
    }
    
    return true;
  } catch (err) {
    console.error('Exception saving links:', err);
    return false;
  }
}

/**
 * Update page record with analysis results
 */
export async function updatePageWithAnalysisResults(
  supabase: SupabaseInstance,
  pageId: string,
  data: {
    title: string | null,
    metaDescription: string | null,
    h1: string | null,
    issuesCount: number,
    internalLinksCount: number,
    externalLinksCount: number
  }
): Promise<boolean> {
  try {
    const updateObject = {
      title: data.title || '',
      meta_description: data.metaDescription || '',
      h1: data.h1 || '',
      issues_count: data.issuesCount,
      internal_links_count: data.internalLinksCount,
      external_links_count: data.externalLinksCount
    };
    
    console.log('Updating page with data:', JSON.stringify(updateObject));
    
    const { error: updateError } = await supabase
      .from('seo_crawler_pages')
      .update(updateObject)
      .eq('id', pageId);
      
    if (updateError) {
      console.error(`Error updating page record: ${updateError.message}`);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Exception updating page record:', err);
    return false;
  }
}
