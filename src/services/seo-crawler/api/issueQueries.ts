
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
    
    // Debug the issues data
    debugIssuesData(data || []);
    
    return (data || []).map((issue: any) => ({
      id: issue.id,
      crawl_id: issue.crawl_id,
      page_id: issue.page_id,
      type: issue.issue_type, // Map issue_type to type
      issue_type: issue.issue_type, // Keep original for backward compatibility
      page_url: issue.page_url || (issue.seo_crawler_pages ? issue.seo_crawler_pages.url : ''),
      severity: issue.severity || 'info',
      description: issue.description,
      created_at: issue.created_at || new Date().toISOString(),
      element: issue.element,
      fix_suggestion: issue.fix_suggestion,
      recommended_fix: issue.recommended_fix,
      category: issue.category,
      seo_crawler_pages: issue.seo_crawler_pages
    }));
  } catch (error) {
    console.error('Error fetching page issues:', error);
    return [];
  }
}

/**
 * Get all issues for a specific page by URL
 */
export async function getPageIssuesByUrl(crawlId: string, pageUrl: string): Promise<CrawlIssue[]> {
  try {
    console.log(`Fetching issues for page URL: ${pageUrl} in crawl: ${crawlId}`);
    
    // First, find the page ID
    const { data: pageData, error: pageError } = await supabase
      .from('seo_crawler_pages')
      .select('id')
      .eq('crawl_id', crawlId)
      .eq('url', pageUrl)
      .single();
    
    if (pageError) {
      console.error('Error finding page:', pageError);
      return [];
    }
    
    if (!pageData) {
      console.log(`No page found with URL: ${pageUrl}`);
      return [];
    }
    
    // Get issues for this page
    return await getPageIssues(pageData.id);
  } catch (error) {
    console.error('Error fetching page issues by URL:', error);
    return [];
  }
}

/**
 * Get all issues for a specific crawl
 */
export async function getCrawlIssues(crawlId: string): Promise<CrawlIssue[]> {
  try {
    console.log(`Fetching issues for crawl ID: ${crawlId}`);
    const { data, error } = await supabase
      .from('seo_crawler_issues')
      .select('*, seo_crawler_pages(url)')
      .eq('crawl_id', crawlId);

    if (error) {
      console.error('Error from Supabase:', error);
      throw error;
    }
    
    console.log(`Found ${data?.length || 0} issues for crawl ${crawlId}`);
    
    // Debug the issues data 
    debugIssuesData(data || []);
    
    return (data || []).map((issue: any) => ({
      id: issue.id,
      crawl_id: issue.crawl_id,
      page_id: issue.page_id,
      type: issue.issue_type, // Map issue_type to type
      issue_type: issue.issue_type, // Keep original for backward compatibility
      page_url: issue.page_url || (issue.seo_crawler_pages ? issue.seo_crawler_pages.url : ''),
      severity: issue.severity || 'info',
      description: issue.description,
      created_at: issue.created_at || new Date().toISOString(),
      element: issue.element,
      fix_suggestion: issue.fix_suggestion,
      recommended_fix: issue.recommended_fix,
      category: issue.category,
      seo_crawler_pages: issue.seo_crawler_pages
    }));
  } catch (error) {
    console.error('Error fetching crawl issues:', error);
    return [];
  }
}
