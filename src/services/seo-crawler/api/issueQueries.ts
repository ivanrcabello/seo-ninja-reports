
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
    
    return (data || []).map((issue: any) => ({
      id: issue.id,
      crawl_id: issue.crawl_id,
      page_id: issue.page_id,
      page_url: issue.seo_crawler_pages ? issue.seo_crawler_pages.url : '',
      issue_type: issue.issue_type,
      description: issue.description,
      element: issue.element || '',
      severity: issue.severity || 'medium',
      fix_suggestion: issue.fix_suggestion || '',
      recommended_fix: issue.recommended_fix || '',
      category: issue.category || 'General',
      // Add the seo_crawler_pages object to match the interface
      seo_crawler_pages: {
        url: issue.seo_crawler_pages ? issue.seo_crawler_pages.url : ''
      }
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
    
    // Try to use the specialized DB function if available
    try {
      // First, validate if the RPC function exists using a direct query approach instead
      const { data: issuesData, error: issuesError } = await supabase
        .from('seo_crawler_issues')
        .select('*, seo_crawler_pages(url)')
        .eq('crawl_id', crawlId);
        
      if (!issuesError && issuesData) {
        console.log(`Found ${issuesData.length} issues using standard query for crawl ${crawlId}`);
        
        // Debug received data
        debugIssuesData(issuesData);
        
        return issuesData.map((issue: any) => ({
          id: issue.id,
          crawl_id: issue.crawl_id,
          page_id: issue.page_id,
          page_url: issue.seo_crawler_pages ? issue.seo_crawler_pages.url : '',
          issue_type: issue.issue_type,
          description: issue.description,
          element: issue.element || '',
          severity: issue.severity || 'medium',
          fix_suggestion: issue.fix_suggestion || '',
          recommended_fix: issue.recommended_fix || '',
          category: issue.category || 'General',
          // Add the seo_crawler_pages object to match the interface
          seo_crawler_pages: {
            url: issue.seo_crawler_pages ? issue.seo_crawler_pages.url : ''
          }
        }));
      }
    } catch (rpcError) {
      console.log('Standard query had an error, falling back to direct query:', rpcError);
    }
    
    // Fallback to standard query if RPC function fails
    const { data, error } = await supabase
      .from('seo_crawler_issues')
      .select('*, seo_crawler_pages(url)')
      .eq('crawl_id', crawlId);

    if (error) {
      console.error('Error from Supabase:', error);
      throw error;
    }
    
    console.log(`Found ${data?.length || 0} issues for crawl ${crawlId}`);
    
    return (data || []).map((issue: any) => ({
      id: issue.id,
      crawl_id: issue.crawl_id,
      page_id: issue.page_id,
      page_url: issue.seo_crawler_pages ? issue.seo_crawler_pages.url : '',
      issue_type: issue.issue_type,
      description: issue.description,
      element: issue.element || '',
      severity: issue.severity || 'medium',
      fix_suggestion: issue.fix_suggestion || '',
      recommended_fix: issue.recommended_fix || '',
      category: issue.category || 'General',
      // Add the seo_crawler_pages object to match the interface
      seo_crawler_pages: {
        url: issue.seo_crawler_pages ? issue.seo_crawler_pages.url : ''
      }
    }));
  } catch (error) {
    console.error('Error fetching crawl issues:', error);
    return [];
  }
}
