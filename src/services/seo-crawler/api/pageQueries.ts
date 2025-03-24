
import { supabase } from '@/integrations/supabase/client';
import { CrawlIssue, CrawlLink } from '../types';

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
    
    return (data || []).map((issue: any) => ({
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
    
    return (data || []).map((link: any) => ({
      id: link.id,
      page_id: link.page_id,
      url: link.url,
      anchor_text: link.anchor_text || '',
      is_internal: link.is_internal,
      is_broken: link.is_broken,
      status_code: link.status_code,
      follow: link.follow,
      rel_attributes: typeof link.rel_attributes === 'string' ? link.rel_attributes : null
    }));
  } catch (error) {
    console.error('Error fetching page links:', error);
    return [];
  }
}
