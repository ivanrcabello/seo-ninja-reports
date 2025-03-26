
import { supabase } from '@/integrations/supabase/client';
import { CrawlIssue, CrawlLink, CrawlHeading } from '../types';

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

    if (error) throw error;
    console.log(`Found ${data?.length || 0} issues for page ${pageId}`);
    
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
      fix_suggestion: issue.fix_suggestion
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
    const { data, error } = await supabase
      .from('seo_crawler_issues')
      .select('*')
      .eq('crawl_id', crawlId);

    if (error) throw error;
    console.log(`Found ${data?.length || 0} issues for crawl ${crawlId}`);
    
    // Transform the data and ensure all fields are present
    const issues = (data || []).map((issue: any) => ({
      id: issue.id,
      crawl_id: issue.crawl_id,
      page_id: issue.page_id,
      page_url: issue.page_url,
      issue_type: issue.issue_type,
      description: issue.description,
      severity: issue.severity || 'info', // Default to 'info' if severity is not set
      recommended_fix: issue.recommended_fix,
      element: issue.element,
      fix_suggestion: issue.fix_suggestion
    }));
    
    console.log('Transformed issues data:', issues);
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

    if (error) throw error;
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

    if (error) throw error;
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
    // Using a raw SQL query via rpc to avoid type issues
    const { data, error } = await supabase
      .rpc('get_page_headings', { page_id_param: pageId });

    if (error) throw error;
    console.log(`Found ${data?.length || 0} headings for page ${pageId}`);
    
    return (data || []).map((heading: any) => ({
      id: heading.id,
      crawl_id: heading.crawl_id,
      page_id: heading.page_id,
      heading_type: heading.heading_type || 'h2',
      content: heading.content || '',
      position: heading.heading_position || 0,
      page_url: heading.page_url
    }));
  } catch (error) {
    console.error('Error fetching page headings:', error);
    return [];
  }
}

/**
 * Get all headings for a specific crawl
 */
export async function getCrawlHeadings(crawlId: string): Promise<CrawlHeading[]> {
  try {
    console.log(`Fetching all headings for crawl ID: ${crawlId}`);
    // Using a raw SQL query via rpc to avoid type issues
    const { data, error } = await supabase
      .rpc('get_crawl_headings', { crawl_id_param: crawlId });

    if (error) throw error;
    console.log(`Found ${data?.length || 0} headings for crawl ${crawlId}`);
    
    return (data || []).map((heading: any) => ({
      id: heading.id,
      crawl_id: heading.crawl_id,
      page_id: heading.page_id,
      page_url: heading.page_url,
      heading_type: heading.heading_type || 'h2',
      content: heading.content || '',
      position: heading.heading_position || 0
    }));
  } catch (error) {
    console.error('Error fetching crawl headings:', error);
    return [];
  }
}
