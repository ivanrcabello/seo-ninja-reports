
import { supabase } from '@/integrations/supabase/client';
import { CrawlIssue, CrawlLink } from '../types';

/**
 * Get all issues for a specific page
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
      crawl_id: issue.crawl_id,
      page_id: issue.page_id,
      page_url: issue.page_url,
      issue_type: issue.issue_type,
      description: issue.description,
      severity: issue.severity,
      recommended_fix: issue.recommended_fix,
      element: issue.element,
      fix_suggestion: issue.fix_suggestion
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
    const { data, error } = await supabase
      .from('seo_crawler_issues')
      .select('*')
      .eq('crawl_id', crawlId);

    if (error) throw error;
    
    return (data || []).map((issue: any) => ({
      id: issue.id,
      crawl_id: issue.crawl_id,
      page_id: issue.page_id,
      page_url: issue.page_url,
      issue_type: issue.issue_type,
      description: issue.description,
      severity: issue.severity,
      recommended_fix: issue.recommended_fix,
      element: issue.element,
      fix_suggestion: issue.fix_suggestion
    }));
  } catch (error) {
    console.error('Error fetching crawl issues:', error);
    return [];
  }
}

/**
 * Get all links for a specific page
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
      crawl_id: link.crawl_id,
      page_id: link.page_id,
      url: link.url,
      anchor_text: link.anchor_text,
      is_internal: link.is_internal,
      is_broken: link.is_broken,
      status_code: link.status_code,
      follow: link.follow,
      rel_attributes: link.rel_attributes
    }));
  } catch (error) {
    console.error('Error fetching page links:', error);
    return [];
  }
}

/**
 * Get all links for a specific crawl
 */
export async function getCrawlLinks(crawlId: string): Promise<CrawlLink[]> {
  try {
    const { data, error } = await supabase
      .from('seo_crawler_links')
      .select('*')
      .eq('crawl_id', crawlId);

    if (error) throw error;
    
    return (data || []).map((link: any) => ({
      id: link.id,
      crawl_id: link.crawl_id,
      page_id: link.page_id,
      url: link.url,
      anchor_text: link.anchor_text,
      is_internal: link.is_internal,
      is_broken: link.is_broken,
      status_code: link.status_code,
      follow: link.follow,
      rel_attributes: link.rel_attributes
    }));
  } catch (error) {
    console.error('Error fetching crawl links:', error);
    return [];
  }
}
