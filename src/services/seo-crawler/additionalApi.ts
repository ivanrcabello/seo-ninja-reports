
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
    const counts: Record<string, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0,
    };
    
    data.forEach((issue: any) => {
      if (counts[issue.severity as keyof typeof counts] !== undefined) {
        counts[issue.severity as keyof typeof counts]++;
      } else {
        // For any other severity not in predefined list
        counts['info']++;
      }
    });
    
    return [
      { severity: 'critical', count: counts.critical },
      { severity: 'high', count: counts.high },
      { severity: 'medium', count: counts.medium },
      { severity: 'low', count: counts.low },
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
      crawl_id: issue.crawl_id,
      page_id: issue.page_id,
      page_url: issue.page_url,
      issue_type: issue.issue_type,
      description: issue.description,
      severity: issue.severity,
      recommended_fix: issue.recommended_fix,
      element: issue.element || null,
      fix_suggestion: issue.fix_suggestion || null,
      category: issue.category || '',
      seo_crawler_pages: { url: issue.page_url || '' }
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
      crawl_id: link.crawl_id,
      page_id: link.page_id,
      url: link.url,
      anchor_text: link.anchor_text || '',
      is_internal: link.is_internal,
      is_broken: link.is_broken,
      status_code: link.status_code,
      follow: link.follow,
      rel_attributes: link.rel_attributes
    }));
  } catch (error) {
    console.error('Error fetching links with details:', error);
    return [];
  }
}

// Export these functions for compatibility
export { getPageIssues, getPageLinks, getCrawlIssues, getCrawlLinks, getPageHeadings, getCrawlHeadings } from './api/pageQueries';

/**
 * Fetch all metadata for pages (titles, descriptions, h1s)
 */
export async function fetchPagesMetadata(crawlId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('seo_crawler_pages')
      .select('id, url, title, meta_description, h1, canonical_url, is_indexable, meta_robots, issues_count')
      .eq('crawl_id', crawlId);

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching pages metadata:', error);
    return [];
  }
}

/**
 * Get statistics about page metadata quality
 */
export async function getMetadataStats(crawlId: string): Promise<any> {
  try {
    const pages = await fetchPagesMetadata(crawlId);
    
    const stats = {
      totalPages: pages.length,
      missingTitle: 0,
      missingMetaDescription: 0,
      missingH1: 0,
      longTitles: 0,
      shortTitles: 0,
      longMetaDescriptions: 0,
      shortMetaDescriptions: 0,
      duplicateTitles: {} as Record<string, number>,
      duplicateMetaDescriptions: {} as Record<string, number>
    };
    
    pages.forEach(page => {
      // Check missing elements
      if (!page.title) stats.missingTitle++;
      if (!page.meta_description) stats.missingMetaDescription++;
      if (!page.h1) stats.missingH1++;
      
      // Check title length
      if (page.title && page.title.length > 60) stats.longTitles++;
      if (page.title && page.title.length < 10) stats.shortTitles++;
      
      // Check meta description length
      if (page.meta_description && page.meta_description.length > 160) stats.longMetaDescriptions++;
      if (page.meta_description && page.meta_description.length < 50) stats.shortMetaDescriptions++;
      
      // Track duplicates
      if (page.title) {
        stats.duplicateTitles[page.title] = (stats.duplicateTitles[page.title] || 0) + 1;
      }
      
      if (page.meta_description) {
        stats.duplicateMetaDescriptions[page.meta_description] = (stats.duplicateMetaDescriptions[page.meta_description] || 0) + 1;
      }
    });
    
    // Count only actual duplicates (appearing more than once)
    const duplicateTitlesCount = Object.values(stats.duplicateTitles).filter(count => count > 1).length;
    const duplicateMetaDescriptionsCount = Object.values(stats.duplicateMetaDescriptions).filter(count => count > 1).length;
    
    return {
      ...stats,
      duplicateTitlesCount,
      duplicateMetaDescriptionsCount
    };
  } catch (error) {
    console.error('Error calculating metadata stats:', error);
    return null;
  }
}
