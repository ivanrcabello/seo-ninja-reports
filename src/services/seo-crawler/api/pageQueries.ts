
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
export const getPageLinks = async (pageId: string) => {
  console.log(`[PageQueries] Fetching links for page ID: ${pageId}`);
  
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
  const formattedLinks = (data || []).map(link => {
    // First create a base object with all the properties from the link
    const baseLink = { ...link };
    
    // Then explicitly add the required properties for CrawlLink
    return {
      ...baseLink,
      text: baseLink.anchor_text || baseLink.link_text || '',
      is_followed: typeof baseLink.follow === 'boolean' ? baseLink.follow : true,
      created_at: now, // Add a default created_at since it doesn't exist in the database
      page_url: ''  // Empty string as default
    } as CrawlLink; // Use type assertion to ensure compatibility
  });
  
  return formattedLinks;
};

/**
 * Get all links for an entire crawl
 */
export const getCrawlLinks = async (crawlId: string) => {
  console.log(`[PageQueries] Fetching links for crawl ID: ${crawlId}`);
  
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
  const formattedLinks = (data || []).map(link => {
    // Create a base object with all properties from link
    const baseLink = { ...link };
    
    // Add required properties for CrawlLink
    return {
      ...baseLink,
      page_url: baseLink.page?.url || '',
      anchor_text: baseLink.anchor_text || baseLink.link_text || '',
      text: baseLink.anchor_text || baseLink.link_text || '',
      is_followed: baseLink.follow !== undefined ? baseLink.follow : true,
      created_at: now // Add default created_at
    } as CrawlLink; // Use type assertion
  });
  
  return formattedLinks;
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
