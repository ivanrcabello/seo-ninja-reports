import { supabase } from '@/integrations/supabase/client';
import { CrawlIssue, CrawlLink, CrawlHeading } from '../types';
import { debugIssuesData, debugHeadingsData } from './debugUtils';

/**
 * Get all issues for a specific page
 */
export async function getPageIssues(pageId: string): Promise<CrawlIssue[]> {
  try {
    console.log(`Fetching issues for page ID: ${pageId}`);
    const { data, error } = await supabase
      .from('seo_crawler_issues')
      .select('*')
      .eq('page_id', pageId);

    if (error) {
      console.error('Error from Supabase:', error);
      throw error;
    }
    
    console.log(`Found ${data?.length || 0} issues for page ${pageId}`);
    
    // Debug the data to see what we're getting
    if (data) debugIssuesData(data);
    
    return (data || []).map((issue: any) => ({
      id: issue.id,
      crawl_id: issue.crawl_id,
      page_id: issue.page_id,
      page_url: issue.page_url,
      issue_type: issue.issue_type,
      description: issue.description,
      severity: issue.severity || 'info', // Add default severity if not set
      recommended_fix: issue.recommended_fix,
      element: issue.element,
      fix_suggestion: issue.fix_suggestion,
      created_at: issue.created_at || new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error fetching page issues:', error);
    return [];
  }
}

/**
 * Get all issues for a specific crawl
 */
export async function getCrawlIssues(crawlId: string): Promise<CrawlIssue[]> {
  try {
    console.log(`Fetching all issues for crawl ID: ${crawlId}`);
    
    // First try with a direct query to the issues table
    let { data, error } = await supabase
      .from('seo_crawler_issues')
      .select('*, seo_crawler_pages!inner(url)')
      .eq('crawl_id', crawlId);

    // If there's an error or no data from direct query, try querying just the issues table
    if (error || !data || data.length === 0) {
      console.log('Error or no data from joined query, trying simple query:', error);
      const result = await supabase
        .from('seo_crawler_issues')
        .select('*')
        .eq('crawl_id', crawlId);
        
      if (result.error) {
        console.error('Error from simple query:', result.error);
        return [];
      }
      
      data = result.data;
    }
    
    console.log(`Found ${data?.length || 0} issues for crawl ${crawlId}`);
    
    // Debug the data to see what we're getting
    if (data) debugIssuesData(data);
    
    // Transform the data and ensure all fields are present
    const issues = (data || []).map((issue: any) => {
      // Handle join result or direct result
      const pageUrl = issue.seo_crawler_pages ? issue.seo_crawler_pages.url : issue.page_url;
      
      return {
        id: issue.id,
        crawl_id: issue.crawl_id,
        page_id: issue.page_id,
        page_url: pageUrl,
        issue_type: issue.issue_type,
        description: issue.description,
        severity: issue.severity || 'info', // Default to 'info' if severity is not set
        recommended_fix: issue.recommended_fix,
        element: issue.element,
        fix_suggestion: issue.fix_suggestion,
        created_at: issue.created_at || new Date().toISOString()
      };
    });
    
    return issues;
  } catch (error) {
    console.error('Error fetching crawl issues:', error);
    return [];
  }
}

/**
 * Get all links for a specific page
 */
export async function getPageLinks(pageId: string): Promise<CrawlLink[]> {
  try {
    console.log(`Fetching links for page ID: ${pageId}`);
    const { data, error } = await supabase
      .from('seo_crawler_links')
      .select('*')
      .eq('page_id', pageId);

    if (error) {
      console.error('Error from Supabase:', error);
      throw error;
    }
    
    console.log(`Found ${data?.length || 0} links for page ${pageId}`);
    
    return (data || []).map((link: any) => ({
      id: link.id,
      crawl_id: link.crawl_id,
      page_id: link.page_id,
      url: link.url,
      anchor_text: link.anchor_text || 'Sin texto ancla', // Provide a default value
      is_internal: link.is_internal,
      is_broken: link.is_broken,
      status_code: link.status_code,
      follow: link.follow,
      rel_attributes: link.rel_attributes
    }));
  } catch (error) {
    console.error('Error fetching page links:', error);
    return [];
  }
}

/**
 * Get all links for a specific crawl
 */
export async function getCrawlLinks(crawlId: string): Promise<CrawlLink[]> {
  try {
    console.log(`Fetching all links for crawl ID: ${crawlId}`);
    const { data, error } = await supabase
      .from('seo_crawler_links')
      .select('*')
      .eq('crawl_id', crawlId);

    if (error) {
      console.error('Error from Supabase:', error);
      throw error;
    }
    
    console.log(`Found ${data?.length || 0} links for crawl ${crawlId}`);
    
    return (data || []).map((link: any) => ({
      id: link.id,
      crawl_id: link.crawl_id,
      page_id: link.page_id,
      url: link.url,
      anchor_text: link.anchor_text || 'Sin texto ancla', // Provide a default value
      is_internal: link.is_internal,
      is_broken: link.is_broken,
      status_code: link.status_code,
      follow: link.follow,
      rel_attributes: link.rel_attributes
    }));
  } catch (error) {
    console.error('Error fetching crawl links:', error);
    return [];
  }
}

/**
 * Get headings for a specific page (H1, H2, H3)
 */
export async function getPageHeadings(pageId: string): Promise<CrawlHeading[]> {
  try {
    console.log(`Fetching headings for page ID: ${pageId}`);
    
    // Direct query first (since RPC might not be properly set up)
    let { data, error } = await supabase
      .from('seo_crawler_headings')
      .select('*, seo_crawler_pages!inner(url)')
      .eq('page_id', pageId)
      .order('position', { ascending: true });
    
    // If direct query fails or returns no results, try RPC
    if (error || !data || data.length === 0) {
      console.log('Direct query failed or empty, trying RPC function');
      // Using the RPC function to get page headings
      const rpcResult = await supabase
        .rpc('get_page_headings', { page_id_param: pageId });
        
      if (rpcResult.error) {
        console.error('Error from RPC get_page_headings:', rpcResult.error);
        // If RPC also fails, fallback to generating placeholder headings
        return generatePlaceholderHeadings(pageId);
      }
      
      data = rpcResult.data;
    }

    console.log(`Found ${data?.length || 0} headings for page ${pageId}`);
    
    // Debug the data to see what we're getting
    if (data) debugHeadingsData(data);
    
    if (data) {
      // Handle data from direct query
      if (data[0] && data[0].seo_crawler_pages) {
        return data.map((heading: any) => ({
          id: heading.id,
          crawl_id: heading.crawl_id,
          page_id: heading.page_id,
          page_url: heading.seo_crawler_pages.url,
          heading_type: heading.heading_type || 'h2',
          content: heading.content || '',
          position: heading.position || 0,
          created_at: heading.created_at || new Date().toISOString()
        }));
      }
      
      // Handle data from RPC
      return data.map((heading: any) => ({
        id: heading.id,
        crawl_id: heading.crawl_id,
        page_id: heading.page_id,
        page_url: heading.page_url || '',
        heading_type: heading.heading_type || 'h2',
        content: heading.content || '',
        position: heading.heading_position || heading.position || 0,
        created_at: heading.created_at || new Date().toISOString(),
        // Add a dummy seo_crawler_pages property to satisfy TypeScript
        seo_crawler_pages: { url: heading.page_url || '' }
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching page headings:', error);
    
    // Return placeholder data in case of error
    return generatePlaceholderHeadings(pageId);
  }
}

/**
 * Get all headings for a specific crawl
 */
export async function getCrawlHeadings(crawlId: string): Promise<CrawlHeading[]> {
  try {
    console.log(`Fetching all headings for crawl ID: ${crawlId}`);
    
    // Direct query first (since RPC might not be properly set up)
    let { data, error } = await supabase
      .from('seo_crawler_headings')
      .select('*, seo_crawler_pages!inner(url)')
      .eq('crawl_id', crawlId)
      .order('page_id', { ascending: true })
      .order('position', { ascending: true });
    
    // If direct query fails or returns no results, try RPC
    if (error || !data || data.length === 0) {
      console.log('Direct query failed or empty, trying RPC function');
      // Using the RPC function to get crawl headings
      const rpcResult = await supabase
        .rpc('get_crawl_headings', { crawl_id_param: crawlId });
        
      if (rpcResult.error) {
        console.error('Error from RPC get_crawl_headings:', rpcResult.error);
        // Try to get at least some headings for pages
        return await getHeadingsFromPages(crawlId);
      }
      
      data = rpcResult.data;
    }

    console.log(`Found ${data?.length || 0} headings for crawl ${crawlId}`);
    
    // Debug the data to see what we're getting
    if (data) debugHeadingsData(data);
    
    if (data) {
      // Handle data from direct query
      if (data[0] && data[0].seo_crawler_pages) {
        return data.map((heading: any) => ({
          id: heading.id,
          crawl_id: heading.crawl_id,
          page_id: heading.page_id,
          page_url: heading.seo_crawler_pages.url,
          heading_type: heading.heading_type || 'h2',
          content: heading.content || '',
          position: heading.position || 0,
          created_at: heading.created_at || new Date().toISOString()
        }));
      }
      
      // Handle data from RPC
      return data.map((heading: any) => ({
        id: heading.id,
        crawl_id: heading.crawl_id,
        page_id: heading.page_id,
        page_url: heading.page_url || '',
        heading_type: heading.heading_type || 'h2',
        content: heading.content || '',
        position: heading.heading_position || heading.position || 0,
        created_at: heading.created_at || new Date().toISOString(),
        // Add a dummy seo_crawler_pages property to satisfy TypeScript
        seo_crawler_pages: { url: heading.page_url || '' }
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching crawl headings:', error);
    
    // Try to get at least some headings for pages
    return await getHeadingsFromPages(crawlId);
  }
}

/**
 * Generate placeholder headings for a page when no real data is available
 */
function generatePlaceholderHeadings(pageId: string): CrawlHeading[] {
  return [{
    id: `placeholder-${pageId}`,
    page_id: pageId,
    heading_type: 'h1',
    content: 'No se encontraron encabezados para esta página',
    position: 0,
    page_url: '',
    created_at: new Date().toISOString()
  }];
}

/**
 * Extract headings from pages when the dedicated headings table has no data
 */
async function getHeadingsFromPages(crawlId: string): Promise<CrawlHeading[]> {
  try {
    // Get pages for this crawl
    const { data: pages, error } = await supabase
      .from('seo_crawler_pages')
      .select('id, url, h1, title')
      .eq('crawl_id', crawlId);
      
    if (error) throw error;
    
    // Generate headings based on page data
    const headings: CrawlHeading[] = [];
    
    pages?.forEach(page => {
      // Add H1 if available
      if (page.h1) {
        headings.push({
          id: `generated-h1-${page.id}`,
          crawl_id: crawlId,
          page_id: page.id,
          page_url: page.url,
          heading_type: 'h1',
          content: page.h1,
          position: 0
        });
      } 
      // Add title as H1 if no H1 available
      else if (page.title) {
        headings.push({
          id: `generated-title-${page.id}`,
          crawl_id: crawlId,
          page_id: page.id,
          page_url: page.url,
          heading_type: 'h1',
          content: page.title,
          position: 0
        });
      }
    });
    
    // Generate or extract issues from HTML data
    await populateHeadingsTable(crawlId, headings);
    
    return headings;
  } catch (error) {
    console.error('Error extracting headings from pages:', error);
    return [];
  }
}

/**
 * Populate headings table with extracted data
 */
async function populateHeadingsTable(crawlId: string, headings: CrawlHeading[]): Promise<void> {
  try {
    if (!headings || headings.length === 0) return;
    
    console.log(`Attempting to populate headings table with ${headings.length} headings`);
    
    // Map to the format expected by the database table
    const headingsForDb = headings.map((heading) => ({
      crawl_id: crawlId,
      page_id: heading.page_id,
      heading_type: heading.heading_type,
      content: heading.content,
      position: heading.position
    }));
    
    // Insert headings into the table
    const { error } = await supabase
      .from('seo_crawler_headings')
      .insert(headingsForDb);
      
    if (error) {
      console.error('Error populating headings table:', error);
    } else {
      console.log('Successfully populated headings table');
    }
  } catch (error) {
    console.error('Error in populateHeadingsTable:', error);
  }
}
