import { supabase } from '@/integrations/supabase/client';
import { CrawlIssue, CrawlLink, CrawlPage } from './types';

/**
 * Fetch issue types distribution for a crawl
 */
export async function fetchIssueTypesDistribution(crawlId: string) {
  try {
    const { data, error } = await supabase
      .from('seo_crawler_issues')
      .select('issue_type, severity')
      .eq('crawl_id', crawlId);

    if (error) throw error;

    // Count issues by type and severity
    const issueTypes: Record<string, { count: number, severity: string }> = {};
    
    data.forEach((issue: any) => {
      if (!issueTypes[issue.issue_type]) {
        issueTypes[issue.issue_type] = { count: 0, severity: issue.severity };
      }
      issueTypes[issue.issue_type].count++;
    });
    
    return Object.entries(issueTypes).map(([type, data]) => ({
      type,
      count: data.count,
      severity: data.severity,
    }));
  } catch (error) {
    console.error('Error fetching issue types distribution:', error);
    return [];
  }
}

/**
 * Fetch severity distribution for a crawl
 */
export async function fetchSeverityDistribution(crawlId: string) {
  try {
    const { data, error } = await supabase
      .from('seo_crawler_issues')
      .select('severity')
      .eq('crawl_id', crawlId);

    if (error) throw error;

    // Count issues by severity
    const counts = {
      critical: 0,
      major: 0,
      minor: 0,
      info: 0,
    };
    
    data.forEach((issue: any) => {
      if (counts[issue.severity as keyof typeof counts] !== undefined) {
        counts[issue.severity as keyof typeof counts]++;
      }
    });
    
    return [
      { severity: 'critical', count: counts.critical },
      { severity: 'major', count: counts.major },
      { severity: 'minor', count: counts.minor },
      { severity: 'info', count: counts.info },
    ];
  } catch (error) {
    console.error('Error fetching severity distribution:', error);
    return [];
  }
}

/**
 * Enhanced issue fetching with additional data
 */
export async function fetchIssuesWithDetails(crawlId: string): Promise<CrawlIssue[]> {
  try {
    const { data, error } = await supabase
      .from('seo_crawler_issues')
      .select('*')
      .eq('crawl_id', crawlId);

    if (error) throw error;

    return data.map((issue: any) => ({
      id: issue.id,
      page_id: issue.page_id,
      issue_type: issue.issue_type,
      description: issue.description,
      severity: issue.severity,
      recommended_fix: issue.recommended_fix,
      element: issue.element || null,
      fix_suggestion: issue.fix_suggestion || null
    }));
  } catch (error) {
    console.error('Error fetching issues with details:', error);
    return [];
  }
}

/**
 * Enhanced link fetching with additional data
 */
export async function fetchLinksWithDetails(crawlId: string): Promise<CrawlLink[]> {
  try {
    const { data, error } = await supabase
      .from('seo_crawler_links')
      .select('*')
      .eq('crawl_id', crawlId);

    if (error) throw error;

    return data.map((link: any) => ({
      id: link.id,
      page_id: link.page_id,
      url: link.url,
      anchor_text: link.anchor_text || '',
      is_internal: link.is_internal,
      is_broken: link.is_broken,
      status_code: link.status_code,
      follow: link.follow,
      rel_attributes: link.rel_attributes || null
    }));
  } catch (error) {
    console.error('Error fetching links with details:', error);
    return [];
  }
}

// Export these functions for compatibility with crawlerService.ts
export { getPageIssues as fetchCrawlIssues } from './api';
export { getPageLinks as fetchCrawlLinks } from './api';

/**
 * Get issues for a specific page
 */
export async function getPageIssues(pageId: string): Promise<CrawlIssue[]> {
  try {
    const { data, error } = await supabase
      .from('seo_crawler_issues')
      .select('*')
      .eq('page_id', pageId);

    if (error) throw error;
    
    return data.map((issue: any) => ({
      id: issue.id,
      page_id: issue.page_id,
      issue_type: issue.issue_type,
      description: issue.description,
      severity: issue.severity,
      recommended_fix: issue.recommended_fix,
      fix_suggestion: issue.fix_suggestion || null,
      element: issue.element || null
    }));
  } catch (error) {
    console.error('Error fetching page issues:', error);
    return [];
  }
}

/**
 * Get links for a specific page
 */
export async function getPageLinks(pageId: string): Promise<CrawlLink[]> {
  try {
    const { data, error } = await supabase
      .from('seo_crawler_links')
      .select('*')
      .eq('page_id', pageId);

    if (error) throw error;
    
    return data.map((link: any) => ({
      id: link.id,
      page_id: link.page_id,
      url: link.url,
      anchor_text: link.anchor_text || '',
      is_internal: link.is_internal,
      is_broken: link.is_broken,
      status_code: link.status_code,
      follow: link.follow,
      rel_attributes: link.rel_attributes || null
    }));
  } catch (error) {
    console.error('Error fetching page links:', error);
    return [];
  }
}
