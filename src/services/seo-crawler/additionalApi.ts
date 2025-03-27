
import { supabase } from '@/integrations/supabase/client';
import { CrawlIssue, CrawlLink } from './types';
import { mapApiIssueToCrawlIssue, mapApiLinkToCrawlLink } from './api/mappers';

/**
 * Get issues for a specific crawl grouped by page URL
 */
export async function getIssuesByPage(crawlId: string): Promise<Record<string, CrawlIssue[]>> {
  try {
    // First, get all issues for this crawl
    const { data, error } = await supabase
      .from('seo_crawler_issues')
      .select('*, seo_crawler_pages(url)')
      .eq('crawl_id', crawlId);
    
    if (error) {
      console.error('Error fetching issues by page:', error);
      throw error;
    }
    
    // Group issues by page URL
    const issuesByPage: Record<string, CrawlIssue[]> = {};
    
    for (const issue of data || []) {
      const pageUrl = issue.seo_crawler_pages?.url || 'unknown';
      
      if (!issuesByPage[pageUrl]) {
        issuesByPage[pageUrl] = [];
      }
      
      issuesByPage[pageUrl].push(mapApiIssueToCrawlIssue(issue));
    }
    
    return issuesByPage;
  } catch (error) {
    console.error('Error fetching issues by page:', error);
    return {};
  }
}

/**
 * Get issues for a specific crawl grouped by issue type
 */
export async function getIssuesByType(crawlId: string): Promise<Record<string, CrawlIssue[]>> {
  try {
    // First, get all issues for this crawl
    const { data, error } = await supabase
      .from('seo_crawler_issues')
      .select('*, seo_crawler_pages(url)')
      .eq('crawl_id', crawlId);
    
    if (error) {
      console.error('Error fetching issues by type:', error);
      throw error;
    }
    
    // Group issues by issue type
    const issuesByType: Record<string, CrawlIssue[]> = {};
    
    for (const issue of data || []) {
      const issueType = issue.issue_type || 'unknown';
      
      if (!issuesByType[issueType]) {
        issuesByType[issueType] = [];
      }
      
      issuesByType[issueType].push(mapApiIssueToCrawlIssue(issue));
    }
    
    return issuesByType;
  } catch (error) {
    console.error('Error fetching issues by type:', error);
    return {};
  }
}

/**
 * Get links for a specific crawl grouped by page URL
 */
export async function getLinksByPage(crawlId: string): Promise<Record<string, CrawlLink[]>> {
  try {
    // First, get all links for this crawl
    const { data, error } = await supabase
      .from('seo_crawler_links')
      .select('*')
      .eq('crawl_id', crawlId);
    
    if (error) {
      console.error('Error fetching links by page:', error);
      throw error;
    }
    
    // Group links by page ID
    const linksByPageId: Record<string, CrawlLink[]> = {};
    
    for (const link of data || []) {
      const pageId = link.page_id || 'unknown';
      
      if (!linksByPageId[pageId]) {
        linksByPageId[pageId] = [];
      }
      
      linksByPageId[pageId].push(mapApiLinkToCrawlLink(link));
    }
    
    // Now, we need to get the page URLs for each page ID
    const pageIds = Object.keys(linksByPageId);
    
    if (pageIds.length > 0) {
      const { data: pagesData, error: pagesError } = await supabase
        .from('seo_crawler_pages')
        .select('id, url')
        .in('id', pageIds);
      
      if (pagesError) {
        console.error('Error fetching page URLs:', pagesError);
        throw pagesError;
      }
      
      // Create a mapping from page ID to page URL
      const pageIdToUrl: Record<string, string> = {};
      
      for (const page of pagesData || []) {
        pageIdToUrl[page.id] = page.url;
      }
      
      // Replace page IDs with page URLs in the links by page mapping
      const linksByPage: Record<string, CrawlLink[]> = {};
      
      for (const [pageId, links] of Object.entries(linksByPageId)) {
        const pageUrl = pageIdToUrl[pageId] || 'unknown';
        linksByPage[pageUrl] = links;
      }
      
      return linksByPage;
    }
    
    return {};
  } catch (error) {
    console.error('Error fetching links by page:', error);
    return {};
  }
}
