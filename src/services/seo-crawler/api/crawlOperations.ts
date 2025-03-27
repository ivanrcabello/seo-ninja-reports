
import { supabase } from '@/integrations/supabase/client';
import { CrawlResult, CrawlSettings, ApiSuccessResponse } from '../types';
import { toast } from 'sonner';
import { ApiCrawlResult } from './responseTypes';

/**
 * Start a crawl for a specific client and URL
 */
export async function startCrawl(clientId: string, url: string): Promise<ApiSuccessResponse> {
  try {
    console.log(`Starting crawl for URL: ${url}, client: ${clientId}`);
    
    // Extract domain from URL
    const domainMatch = url.match(/^https?:\/\/([^/:]+)/i);
    const domain = domainMatch ? domainMatch[1] : url.split('/')[0];
    
    // Create a new crawl record
    const { data: crawlData, error: crawlError } = await supabase
      .from('seo_crawler_crawls')
      .insert({
        client_id: clientId,
        url: url,
        domain: domain,
        status: 'queued',
        started_at: new Date().toISOString(),
        pages_crawled: 0,
        total_pages: 0,
        settings: getDefaultCrawlSettings() // Include default settings
      })
      .select()
      .single();
    
    if (crawlError) {
      console.error('Error creating crawl record:', crawlError);
      throw new Error(`Error creating crawl record: ${crawlError.message}`);
    }
    
    if (!crawlData) {
      throw new Error('No crawl data returned after insertion');
    }
    
    console.log('Crawl record created:', crawlData);
    
    // Get Bright Data credentials from settings
    const brightDataUsername = localStorage.getItem('bright_data_username');
    const brightDataPassword = localStorage.getItem('bright_data_password');
    
    if (!brightDataUsername || !brightDataPassword) {
      await supabase
        .from('seo_crawler_crawls')
        .update({ 
          status: 'failed', 
          error_message: 'Missing Bright Data credentials. Please add them in Settings.',
          completed_at: new Date().toISOString()
        })
        .eq('id', crawlData.id);
      
      return {
        success: false,
        message: 'Missing Bright Data credentials. Please add them in Settings.'
      };
    }
    
    // Call the edge function to start the crawl
    const edgeFunctionUrl = `${window.location.origin}/api/seo-crawler`;
    
    console.log(`Calling edge function at: ${edgeFunctionUrl}`);
    
    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: url,
        crawlId: crawlData.id,
        brightDataUsername,
        brightDataPassword,
        settings: crawlData.settings
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Edge function error:', errorText);
      throw new Error(`Edge function error: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('Edge function response:', result);
    
    return result as ApiSuccessResponse;
  } catch (error) {
    console.error('Error starting crawl:', error);
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message
      };
    }
    return {
      success: false,
      message: 'Unknown error starting crawl'
    };
  }
}

/**
 * Delete a crawl record and all associated data
 */
export async function deleteCrawlRecord(crawlId: string): Promise<boolean> {
  try {
    // Due to cascading deletes, we only need to delete the main crawl record
    const { error } = await supabase
      .from('seo_crawler_crawls')
      .delete()
      .eq('id', crawlId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting crawl record:', error);
    throw error;
  }
}

// Get default crawl settings
export function getDefaultCrawlSettings(): CrawlSettings {
  return {
    max_pages: 100,
    exclude_urls: [],
    include_urls: [],
    respect_robots_txt: true,
    user_agent: 'Mozilla/5.0 (compatible; SEOcrawler/1.0; +https://example.com/bot)',
    crawl_sitemap: true,
    follow_links: true,
    max_depth: 10
  };
}
