
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
      const { data: functionData, error: functionError } = await supabase
        .rpc('get_crawl_issues', { crawl_id_param: crawlId });
        
      if (!functionError && functionData && functionData.length > 0) {
        console.log(`Found ${functionData.length} issues using RPC function for crawl ${crawlId}`);
        
        // Debug received data
        debugIssuesData(functionData);
        
        return functionData.map((issue: any) => ({
          id: issue.id,
          crawl_id: issue.crawl_id,
          page_id: issue.page_id,
          page_url: issue.page_url,
          issue_type: issue.issue_type,
          description: issue.description,
          element: issue.element || '',
          severity: issue.severity || 'medium',
          fix_suggestion: issue.fix_suggestion || '',
          recommended_fix: issue.recommended_fix || '',
          category: issue.category || 'General',
          // Add the seo_crawler_pages object to match the interface
          seo_crawler_pages: {
            url: issue.page_url || ''
          }
        }));
      }
    } catch (rpcError) {
      console.log('RPC function not available, falling back to standard query:', rpcError);
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
