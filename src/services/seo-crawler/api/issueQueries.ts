
import { supabase } from '@/integrations/supabase/client';
import { CrawlIssue } from '../types';
import { debugIssuesData } from './debugUtils';
import { mapApiIssueToCrawlIssue } from './mappers';

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
    
    return (data || []).map(mapApiIssueToCrawlIssue);
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
    
    // Try to use the standard query approach
    try {
      const { data: issuesData, error: issuesError } = await supabase
        .from('seo_crawler_issues')
        .select('*, seo_crawler_pages(url)')
        .eq('crawl_id', crawlId);
        
      if (!issuesError && issuesData) {
        console.log(`Found ${issuesData.length} issues using standard query for crawl ${crawlId}`);
        
        // Debug received data
        debugIssuesData(issuesData);
        
        return issuesData.map(mapApiIssueToCrawlIssue);
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
    
    return (data || []).map(mapApiIssueToCrawlIssue);
  } catch (error) {
    console.error('Error fetching crawl issues:', error);
    return [];
  }
}
