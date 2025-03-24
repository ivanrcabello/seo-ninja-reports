
import { supabase } from '@/integrations/supabase/client';

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
export const getCrawlResults = async (crawlId: string) => {
  try {
    const { data, error } = await supabase
      .from('seo_crawl_results')
      .select('*')
      .eq('id', crawlId)
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error retrieving crawl results:", error);
    throw error;
  }
};

// Get a single crawl result by ID
export const fetchCrawlResult = async (crawlId: string) => {
  try {
    const { data, error } = await supabase
      .from('seo_crawl_results')
      .select('*')
      .eq('id', crawlId)
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error fetching crawl result:", error);
    throw error;
  }
};

// Get crawl pages
export const getCrawlPages = async (crawlId: string) => {
  try {
    const { data, error } = await supabase
      .from('seo_crawl_pages')
      .select('*')
      .eq('crawl_id', crawlId);
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error retrieving crawl pages:", error);
    throw error;
  }
};

// Get issues for a specific page
export const fetchCrawlIssues = async (pageId: string) => {
  try {
    const { data, error } = await supabase
      .from('seo_crawl_issues')
      .select('*')
      .eq('page_id', pageId);
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error retrieving page issues:", error);
    throw error;
  }
};

// Get links for a specific page
export const fetchCrawlLinks = async (pageId: string) => {
  try {
    const { data, error } = await supabase
      .from('seo_crawl_links')
      .select('*')
      .eq('page_id', pageId);
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error retrieving page links:", error);
    throw error;
  }
};
