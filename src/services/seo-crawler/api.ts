
import { supabase } from '@/integrations/supabase/client';
import { CrawlResult, CrawlPage, CrawlIssue, CrawlLink } from './types';

// Start a new crawl session
export const startCrawl = async (
  domain: string, 
  clientId: string,
  brightDataUsername?: string,
  brightDataPassword?: string
) => {
  try {
    // First create a new crawl record
    const { data: crawl, error } = await supabase
      .from('seo_crawl_results')
      .insert({
        domain,
        client_id: clientId,
        status: 'processing',
        crawl_date: new Date().toISOString(),
      })
      .select()
      .single();
      
    if (error) throw error;
    
    // Then call the edge function to start the crawl
    const { data, error: fnError } = await supabase.functions.invoke('seo-crawler', {
      body: { 
        url: domain, 
        crawlId: crawl.id,
        brightDataUsername,
        brightDataPassword
      }
    });
    
    if (fnError) {
      console.error('Error calling seo-crawler function:', fnError);
      throw fnError;
    }
    
    console.log('Response from seo-crawler function:', data);
    return data;
  } catch (error) {
    console.error("Error starting SEO crawl:", error);
    throw error;
  }
};

// Get all crawl results for a client
export const fetchCrawlResults = async (clientId: string): Promise<CrawlResult[]> => {
  try {
    const { data, error } = await supabase
      .from('seo_crawl_results')
      .select('*')
      .eq('client_id', clientId)
      .order('crawl_date', { ascending: false });
      
    if (error) throw error;
    
    // Ensure data conforms to CrawlResult type by explicitly casting status
    return data.map(result => ({
      ...result,
      status: (result.status as "pending" | "processing" | "completed" | "error" | string)
    })) as CrawlResult[];
  } catch (error) {
    console.error("Error retrieving crawl results:", error);
    throw error;
  }
};

// Get a single crawl result by ID
export const getCrawlResults = async (crawlId: string): Promise<CrawlResult> => {
  try {
    const { data, error } = await supabase
      .from('seo_crawl_results')
      .select('*')
      .eq('id', crawlId)
      .single();
      
    if (error) throw error;
    
    // Cast the status field to ensure it matches the type
    return {
      ...data,
      status: (data.status as "pending" | "processing" | "completed" | "error" | string)
    } as CrawlResult;
  } catch (error) {
    console.error("Error fetching crawl result:", error);
    throw error;
  }
};

// Get crawl pages
export const getCrawlPages = async (crawlId: string): Promise<CrawlPage[]> => {
  try {
    const { data, error } = await supabase
      .from('seo_crawl_pages')
      .select('*')
      .eq('crawl_id', crawlId);
      
    if (error) throw error;
    
    // Add default values for all required properties
    const now = new Date().toISOString();
    return data.map(page => ({
      ...page,
      content_type: page.content_type || 'text/html',  // Add missing content_type property
      issues_count: page.issues_count || 0,            // Add missing issues_count property
      crawled_at: page.crawled_at || now,              // Add missing crawled_at property
      h1: page.h1 || '',
      h2_count: page.h2_count || 0,
      h3_count: page.h3_count || 0,
      word_count: page.word_count || 0,
      image_count: page.image_count || 0,
      internal_links_count: page.internal_links_count || 0,
      external_links_count: page.external_links_count || 0,
      canonical_url: page.canonical_url || '',
      robots_directives: page.robots_directives || '',
      meta_robots: page.meta_robots || '',
      is_indexable: page.is_indexable !== undefined ? page.is_indexable : true,
      page_size_kb: page.page_size_kb || 0,
      load_time_ms: page.load_time_ms || 0,
      images_without_alt: page.images_without_alt || 0,
      mobile_friendly: page.mobile_friendly !== undefined ? page.mobile_friendly : false,
      has_schema_markup: page.has_schema_markup !== undefined ? page.has_schema_markup : false,
      content_length: page.content_length || 0
    })) as CrawlPage[];
  } catch (error) {
    console.error("Error retrieving crawl pages:", error);
    throw error;
  }
};

// Get issues for a specific page
export const getPageIssues = async (pageId: string): Promise<CrawlIssue[]> => {
  try {
    const { data, error } = await supabase
      .from('seo_crawl_issues')
      .select('*')
      .eq('page_id', pageId);
      
    if (error) throw error;
    
    // Cast severity to ensure it matches the type
    return data.map(issue => ({
      ...issue,
      severity: (issue.severity as "low" | "medium" | "high" | string),
      fix_suggestion: issue.fix_suggestion || '',  // Add missing fix_suggestion property
      recommended_fix: issue.recommended_fix || '',
      element: issue.element || ''  // Add missing element property
    })) as CrawlIssue[];
  } catch (error) {
    console.error("Error retrieving page issues:", error);
    throw error;
  }
};

// Get links for a specific page
export const getPageLinks = async (pageId: string): Promise<CrawlLink[]> => {
  try {
    const { data, error } = await supabase
      .from('seo_crawl_links')
      .select('*')
      .eq('page_id', pageId);
      
    if (error) throw error;
    
    // Ensure all required fields are present
    return data.map(link => ({
      ...link,
      is_followed: link.follow !== undefined ? !!link.follow : true,
      is_broken: link.is_broken !== undefined ? link.is_broken : false,
      status_code: link.status_code || 200,
      rel_attributes: link.rel_attributes || '',  // Add missing rel_attributes property
      anchor_text: link.anchor_text || ''
    })) as CrawlLink[];
  } catch (error) {
    console.error("Error retrieving page links:", error);
    throw error;
  }
};

// Delete a crawl record and its associated data
export const deleteCrawlRecord = async (crawlId: string): Promise<void> => {
  try {
    // Delete the crawl record
    const { error } = await supabase
      .from('seo_crawl_results')
      .delete()
      .eq('id', crawlId);
      
    if (error) throw error;
    
    // Delete associated crawl pages
    const { error: pagesError } = await supabase
      .from('seo_crawl_pages')
      .delete()
      .eq('crawl_id', crawlId);
      
    if (pagesError) throw pagesError;
    
    // Delete associated crawl issues
    const { error: issuesError } = await supabase
      .from('seo_crawl_issues')
      .delete()
      .eq('page_id', crawlId);
      
    if (issuesError) throw issuesError;
    
    // Delete associated crawl links
    const { error: linksError } = await supabase
      .from('seo_crawl_links')
      .delete()
      .eq('page_id', crawlId);
      
    if (linksError) throw linksError;
  } catch (error) {
    console.error("Error deleting crawl record:", error);
    throw error;
  }
};
