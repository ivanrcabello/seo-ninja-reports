
import { supabase } from '@/integrations/supabase/client';
import { CrawlIssue } from '../types';
import { debugIssuesData } from './debugUtils';

/**
 * Get issues for a specific page
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
    
    // Debug issues data to help identify structure issues
    debugIssuesData(data);
    
    // Map to our CrawlIssue type with the required fields
    return (data || []).map(issue => ({
      id: issue.id,
      crawl_id: issue.crawl_id,
      page_id: issue.page_id,
      type: issue.issue_type || '', // Required by CrawlIssue interface
      page_url: issue.page_url || issue.seo_crawler_pages?.url,
      issue_type: issue.issue_type,
      description: issue.description,
      severity: issue.severity as 'low' | 'medium' | 'high' | 'critical' | 'info',
      details: issue.details,
      recommended_fix: issue.recommended_fix,
      element: issue.element,
      fix_suggestion: issue.fix_suggestion,
      category: issue.category,
      seo_crawler_pages: issue.seo_crawler_pages,
      created_at: issue.created_at || new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error fetching page issues:', error);
    return [];
  }
}

/**
 * Get all issues for a crawl
 */
export async function getCrawlIssues(crawlId: string): Promise<CrawlIssue[]> {
  try {
    console.log(`Fetching all issues for crawl ID: ${crawlId}`);
    
    const { data, error } = await supabase
      .from('seo_crawler_issues')
      .select('*, seo_crawler_pages(url)')
      .eq('crawl_id', crawlId);
    
    if (error) {
      console.error('Error from Supabase:', error);
      throw error;
    }
    
    // Debug issues data to help identify structure issues
    debugIssuesData(data);
    
    // Map to our CrawlIssue type with the required fields
    return (data || []).map(issue => ({
      id: issue.id,
      crawl_id: issue.crawl_id,
      page_id: issue.page_id,
      type: issue.issue_type || '', // Required by CrawlIssue interface
      page_url: issue.page_url || issue.seo_crawler_pages?.url,
      issue_type: issue.issue_type,
      description: issue.description,
      severity: issue.severity as 'low' | 'medium' | 'high' | 'critical' | 'info',
      details: issue.details,
      recommended_fix: issue.recommended_fix,
      element: issue.element,
      fix_suggestion: issue.fix_suggestion,
      category: issue.category,
      seo_crawler_pages: issue.seo_crawler_pages,
      created_at: issue.created_at || new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error fetching crawl issues:', error);
    return [];
  }
}
