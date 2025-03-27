
import { supabase } from '@/integrations/supabase/client';
import { CrawlResult } from '../types';
import { CrawlSettings } from '../types';
import { CrawlStartResponse } from './responseTypes';

// Function to start a new crawl
export async function startCrawl(clientId: string, url: string, settings?: Partial<CrawlSettings>): Promise<CrawlStartResponse> {
  try {
    console.log(`Starting crawl for client ${clientId} and URL ${url}`);
    
    // Make sure the URL has a protocol
    let normalizedUrl = url;
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }
    
    // Build the request payload
    const payload = {
      client_id: clientId,
      url: normalizedUrl,
      settings
    };
    
    // Call the Edge Function
    const { data, error } = await supabase.functions.invoke('seo-crawler', {
      body: JSON.stringify(payload)
    });
    
    console.log('Edge function response:', data, error);
    
    if (error) {
      console.error('Edge function error:', error);
      throw new Error(`Error calling crawler: ${error.message}`);
    }
    
    if (!data) {
      throw new Error('No data returned from crawler function');
    }
    
    return data as CrawlStartResponse;
  } catch (error: any) {
    console.error('Error starting crawl:', error);
    return {
      success: false,
      message: error.message || 'Unknown error occurred'
    };
  }
}

// Function to cancel a crawl
export async function cancelCrawl(crawlId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke('seo-crawler-cancel', {
      body: JSON.stringify({ crawl_id: crawlId })
    });
    
    if (error) {
      throw error;
    }
    
    return data?.success || false;
  } catch (error) {
    console.error('Error cancelling crawl:', error);
    return false;
  }
}

// Function to retry a failed crawl
export async function retryCrawl(crawlId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke('seo-crawler-retry', {
      body: JSON.stringify({ crawl_id: crawlId })
    });
    
    if (error) {
      throw error;
    }
    
    return data?.success || false;
  } catch (error) {
    console.error('Error retrying crawl:', error);
    return false;
  }
}

// Function to get the crawler status
export async function getCrawlerStatus(): Promise<{ enabled: boolean; message?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('seo-crawler-status');
    
    if (error) {
      throw error;
    }
    
    return {
      enabled: data?.enabled || false,
      message: data?.message
    };
  } catch (error) {
    console.error('Error getting crawler status:', error);
    return { enabled: false, message: 'Error checking crawler status' };
  }
}

// Mock function for starting a crawl (for development purposes)
export async function mockStartCrawl(clientId: string, url: string): Promise<CrawlStartResponse> {
  console.log(`[MOCK] Starting crawl for client ${clientId} and URL ${url}`);
  
  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const mockCrawlId = `mock-${Date.now()}`;
  
  // Create a mock crawl record in the database
  const { error } = await supabase.from('seo_crawler_crawls').insert({
    id: mockCrawlId,
    client_id: clientId,
    url,
    domain: url.replace(/^https?:\/\//, '').split('/')[0],
    status: 'processing',
    started_at: new Date().toISOString(),
    pages_crawled: 0,
    total_pages: 0
  });
  
  if (error) {
    console.error('[MOCK] Error creating mock crawl:', error);
    return {
      success: false,
      message: `Error creating mock crawl: ${error.message}`
    };
  }
  
  return {
    success: true,
    message: 'Mock crawl started successfully',
    crawl_id: mockCrawlId
  };
}
