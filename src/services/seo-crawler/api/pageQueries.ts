
import { supabase } from '@/integrations/supabase/client';
import { CrawlHeading, CrawlIssue, CrawlLink } from '../types';

/**
 * Get all issues for a specific page
 */
export const getPageIssues = async (pageId: string) => {
  console.log(`[PageQueries] Fetching issues for page ID: ${pageId}`);
  
  const { data, error } = await supabase
    .from('seo_crawler_issues')
    .select('*')
    .eq('page_id', pageId)
    .order('severity', { ascending: false });
  
  if (error) {
    console.error('Error fetching page issues:', error);
    throw error;
  }
  
  console.log(`[PageQueries] Found ${data?.length || 0} issues for page ID: ${pageId}`);
  return data || [];
};

/**
 * Get all issues for an entire crawl
 */
export const getCrawlIssues = async (crawlId: string) => {
  console.log(`[PageQueries] Fetching issues for crawl ID: ${crawlId}`);
  
  const { data, error } = await supabase
    .from('seo_crawler_issues')
    .select(`
      *,
      page:page_id(url)
    `)
    .eq('crawl_id', crawlId)
    .order('severity', { ascending: false });
  
  if (error) {
    console.error('Error fetching crawl issues:', error);
    throw error;
  }
  
  console.log(`[PageQueries] Found ${data?.length || 0} issues for crawl ID: ${crawlId}`);
  
  // Format the data to ensure all fields are properly set
  const formattedData = (data || []).map(issue => ({
    ...issue,
    issue_type: issue.issue_type || 'unknown',
    page_url: issue.page?.url || '',
    type: issue.issue_type || 'unknown', // Ensure 'type' field for compatibility
    severity: issue.severity || 'medium'
  }));
  
  return formattedData;
};

/**
 * Get all links for a specific page
 */
export const getPageLinks = async (pageId: string): Promise<CrawlLink[]> => {
  console.log(`[PageQueries] Fetching links for page ID: ${pageId}`);
  
  try {
    const { data, error } = await supabase
      .from('seo_crawler_links')
      .select('*')
      .eq('page_id', pageId)
      .order('is_internal', { ascending: false });
    
    if (error) {
      console.error('Error fetching page links:', error);
      throw error;
    }
    
    console.log(`[PageQueries] Found ${data?.length || 0} links for page ID: ${pageId}`);
    
    // Get the current timestamp as ISO string to use as default for created_at
    const now = new Date().toISOString();
    
    // Format the data to ensure all fields match the CrawlLink type
    const formattedLinks: CrawlLink[] = (data || []).map(link => {
      // Make a copy of the link object with default created_at
      const linkWithDefaults = {
        ...link,
        created_at: link.created_at || now
      };
      
      return {
        id: linkWithDefaults.id || '',
        crawl_id: linkWithDefaults.crawl_id || '',
        page_id: linkWithDefaults.page_id || '',
        url: linkWithDefaults.url || '',
        text: linkWithDefaults.anchor_text || linkWithDefaults.link_text || '',
        anchor_text: linkWithDefaults.anchor_text || linkWithDefaults.link_text || '',
        is_internal: typeof linkWithDefaults.is_internal === 'boolean' ? linkWithDefaults.is_internal : false,
        is_followed: typeof linkWithDefaults.follow === 'boolean' ? linkWithDefaults.follow : true,
        follow: typeof linkWithDefaults.follow === 'boolean' ? linkWithDefaults.follow : true,
        is_broken: typeof linkWithDefaults.is_broken === 'boolean' ? linkWithDefaults.is_broken : false,
        status_code: linkWithDefaults.status_code || 200,
        created_at: linkWithDefaults.created_at,
        page_url: '',
        rel_attributes: linkWithDefaults.rel_attributes || [],
        link_location: linkWithDefaults.link_location || '',
        link_type: linkWithDefaults.link_type || '',
        nofollow: linkWithDefaults.nofollow || false,
        link_text: linkWithDefaults.link_text || linkWithDefaults.anchor_text || ''
      };
    });
    
    console.log(`[PageQueries] Formatted ${formattedLinks.length} links for page ID: ${pageId}`);
    return formattedLinks;
  } catch (error) {
    console.error(`[PageQueries] Error in getPageLinks:`, error);
    return []; // Return empty array instead of throwing
  }
};

/**
 * Get all links for an entire crawl
 */
export const getCrawlLinks = async (crawlId: string): Promise<CrawlLink[]> => {
  console.log(`[PageQueries] Fetching links for crawl ID: ${crawlId}`);
  
  try {
    const { data, error } = await supabase
      .from('seo_crawler_links')
      .select(`
        *,
        page:page_id(url)
      `)
      .eq('crawl_id', crawlId)
      .order('is_internal', { ascending: false });
    
    if (error) {
      console.error('Error fetching crawl links:', error);
      throw error;
    }
    
    console.log(`[PageQueries] Found ${data?.length || 0} links for crawl ID: ${crawlId}`);
    
    // Get the current timestamp as ISO string to use as default for created_at
    const now = new Date().toISOString();
    
    // Format returned data to ensure all required properties are present
    const formattedLinks: CrawlLink[] = (data || []).map(link => {
      // Make a copy of the link object with default created_at
      const linkWithDefaults = {
        ...link,
        created_at: link.created_at || now
      };
      
      return {
        id: linkWithDefaults.id || '',
        crawl_id: linkWithDefaults.crawl_id || '',
        page_id: linkWithDefaults.page_id || '',
        url: linkWithDefaults.url || '',
        text: linkWithDefaults.anchor_text || linkWithDefaults.link_text || '',
        anchor_text: linkWithDefaults.anchor_text || linkWithDefaults.link_text || '',
        is_internal: typeof linkWithDefaults.is_internal === 'boolean' ? linkWithDefaults.is_internal : false,
        is_followed: typeof linkWithDefaults.follow === 'boolean' ? linkWithDefaults.follow : true,
        follow: typeof linkWithDefaults.follow === 'boolean' ? linkWithDefaults.follow : true,
        is_broken: typeof linkWithDefaults.is_broken === 'boolean' ? linkWithDefaults.is_broken : false,
        status_code: linkWithDefaults.status_code || 200,
        created_at: linkWithDefaults.created_at,
        page_url: linkWithDefaults.page?.url || '',
        rel_attributes: linkWithDefaults.rel_attributes || [],
        link_location: linkWithDefaults.link_location || '',
        link_type: linkWithDefaults.link_type || '',
        nofollow: linkWithDefaults.nofollow || false,
        link_text: linkWithDefaults.link_text || linkWithDefaults.anchor_text || ''
      };
    });
    
    console.log(`[PageQueries] Formatted ${formattedLinks.length} links for crawl ID: ${crawlId}`);
    return formattedLinks;
  } catch (error) {
    console.error(`[PageQueries] Error in getCrawlLinks:`, error);
    return []; // Return empty array instead of throwing
  }
};

/**
 * Get all headings for a specific page
 */
export const getPageHeadings = async (pageId: string): Promise<CrawlHeading[]> => {
  console.log(`[PageQueries] Fetching headings for page ID: ${pageId}`);
  
  const { data, error } = await supabase
    .from('seo_crawler_headings')
    .select('*')
    .eq('page_id', pageId)
    .order('position', { ascending: true });
  
  if (error) {
    console.error('Error fetching page headings:', error);
    throw error;
  }
  
  console.log(`[PageQueries] Found ${data?.length || 0} headings for page ID: ${pageId}`);
  
  // Ensure we have all required fields
  const formattedHeadings = (data || []).map(heading => ({
    id: heading.id,
    crawl_id: heading.crawl_id,
    page_id: heading.page_id,
    heading_type: heading.heading_type,
    content: heading.content,
    position: heading.position,
    page_url: '' // Add page_url property with empty string as default
  }));
  
  return formattedHeadings;
};

/**
 * Get all headings for an entire crawl
 */
export const getCrawlHeadings = async (crawlId: string): Promise<CrawlHeading[]> => {
  console.log(`[PageQueries] Fetching headings for crawl ID: ${crawlId}`);
  
  const { data, error } = await supabase
    .from('seo_crawler_headings')
    .select(`
      *,
      page:page_id(url)
    `)
    .eq('crawl_id', crawlId)
    .order('position', { ascending: true });
  
  if (error) {
    console.error('Error fetching crawl headings:', error);
    throw error;
  }
  
  console.log(`[PageQueries] Found ${data?.length || 0} headings for crawl ID: ${crawlId}`);
  
  // Format and ensure we have all required fields
  const formattedHeadings = (data || []).map(heading => ({
    id: heading.id,
    crawl_id: heading.crawl_id,
    page_id: heading.page_id,
    heading_type: heading.heading_type,
    content: heading.content,
    position: heading.position,
    page_url: heading.page?.url || ''
  }));
  
  return formattedHeadings;
};
