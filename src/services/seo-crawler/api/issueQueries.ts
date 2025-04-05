
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
      .select('*, seo_crawler_pages:page_id(url)')
      .eq('page_id', pageId);
    
    if (error) {
      console.error('Error from Supabase:', error);
      throw error;
    }
    
    // Debug issue data to identify structure issues
    debugIssuesData(data);
    
    // Process the severity field to ensure it's a valid value
    return (data || []).map(issue => {
      // Validate severity to ensure it matches the allowed values
      let normalizedSeverity: 'low' | 'medium' | 'high' | 'critical' | 'info' = 'info';
      
      if (issue.severity) {
        const severityStr = String(issue.severity).toLowerCase();
        if (['low', 'medium', 'high', 'critical', 'info'].includes(severityStr)) {
          normalizedSeverity = severityStr as 'low' | 'medium' | 'high' | 'critical' | 'info';
        }
      }
      
      return {
        id: issue.id,
        crawl_id: issue.crawl_id,
        page_id: issue.page_id,
        page_url: issue.page_url || (issue.seo_crawler_pages ? issue.seo_crawler_pages.url : null),
        issue_type: issue.issue_type,
        type: issue.issue_type, // Required by CrawlIssue type
        severity: normalizedSeverity,
        description: issue.description,
        details: {}, // Provide default as this property is missing
        element: issue.element || '',
        fix_suggestion: issue.fix_suggestion || issue.recommended_fix || '',
        recommended_fix: issue.recommended_fix || '',
        category: issue.category || 'other',
        created_at: issue.created_at || new Date().toISOString()
      };
    });
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
      .select('*, seo_crawler_pages:page_id(url)')
      .eq('crawl_id', crawlId);
    
    if (error) {
      console.error('Error from Supabase:', error);
      throw error;
    }
    
    // Debug issue data to identify structure issues
    debugIssuesData(data);
    
    // Process the severity field to ensure it's a valid value
    return (data || []).map(issue => {
      // Validate severity to ensure it matches the allowed values
      let normalizedSeverity: 'low' | 'medium' | 'high' | 'critical' | 'info' = 'info';
      
      if (issue.severity) {
        const severityStr = String(issue.severity).toLowerCase();
        if (['low', 'medium', 'high', 'critical', 'info'].includes(severityStr)) {
          normalizedSeverity = severityStr as 'low' | 'medium' | 'high' | 'critical' | 'info';
        }
      }
      
      return {
        id: issue.id,
        crawl_id: issue.crawl_id,
        page_id: issue.page_id,
        page_url: issue.page_url || (issue.seo_crawler_pages ? issue.seo_crawler_pages.url : null),
        issue_type: issue.issue_type,
        type: issue.issue_type, // Required by CrawlIssue type
        severity: normalizedSeverity,
        description: issue.description,
        details: {}, // Provide default as this property is missing
        element: issue.element || '',
        fix_suggestion: issue.fix_suggestion || issue.recommended_fix || '',
        recommended_fix: issue.recommended_fix || '',
        category: issue.category || 'other',
        created_at: issue.created_at || new Date().toISOString()
      };
    });
  } catch (error) {
    console.error('Error fetching crawl issues:', error);
    return [];
  }
}
