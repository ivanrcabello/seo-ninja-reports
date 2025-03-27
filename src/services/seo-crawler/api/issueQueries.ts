
import { supabase } from '@/integrations/supabase/client';
import { CrawlIssue } from '../types';
import { debugIssuesData } from './debugUtils';

/**
 * Get all issues for a specific page
 */
export async function getPageIssues(pageId: string): Promise<CrawlIssue[]> {
  try {
    console.log(`Fetching issues for page ID: ${pageId}`);
    const { data, error } = await supabase
      .from('seo_crawler_issues')
      .select('*, seo_crawler_pages(url)')
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
      page_url: issue.page_url || (issue.seo_crawler_pages ? issue.seo_crawler_pages.url : ''),
      issue_type: issue.issue_type,
      description: issue.description,
      severity: issue.severity || 'info', // Add default severity if not set
      recommended_fix: issue.recommended_fix,
      element: issue.element,
      fix_suggestion: issue.fix_suggestion,
      category: issue.category || '',
      created_at: issue.created_at || new Date().toISOString(),
      // Add seo_crawler_pages property explicitly
      seo_crawler_pages: issue.seo_crawler_pages || { url: issue.page_url || '' }
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
        page_url: pageUrl || '',
        issue_type: issue.issue_type,
        description: issue.description,
        severity: issue.severity || 'info', // Default to 'info' if severity is not set
        recommended_fix: issue.recommended_fix,
        element: issue.element,
        fix_suggestion: issue.fix_suggestion,
        category: issue.category || '',
        created_at: issue.created_at || new Date().toISOString(),
        // Add seo_crawler_pages property explicitly to match the interface
        seo_crawler_pages: issue.seo_crawler_pages || { url: pageUrl || '' }
      };
    });
    
    return issues;
  } catch (error) {
    console.error('Error fetching crawl issues:', error);
    return [];
  }
}
