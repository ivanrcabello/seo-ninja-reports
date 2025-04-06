
import { supabase } from '@/integrations/supabase/client';
import { CrawlResult, CrawlSettings } from '../types';
import { debugCrawlData } from './debugUtils';

// Helper function to ensure URL has proper protocol
function normalizeUrl(url: string): string {
  if (!url) return '';
  
  // Check if URL already has a protocol
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    // Add https:// as default protocol
    return `https://${url}`;
  }
  
  return url;
}

/**
 * Start a new crawl for a given client
 */
export async function startCrawl(
  clientId: string, 
  url: string, 
  settings: Partial<CrawlSettings> = {}
): Promise<CrawlResult> {
  try {
    // Normalize the URL to ensure it has a protocol
    const normalizedUrl = normalizeUrl(url);
    
    if (!normalizedUrl) {
      throw new Error('URL inválida. Por favor, introduce una URL válida.');
    }
    
    console.log(`Starting crawl for normalized URL: ${normalizedUrl}`);
    
    // Merge default settings with custom settings
    const defaultSettings: CrawlSettings = {
      max_pages: 100,
      exclude_urls: [],
      include_urls: [],
      respect_robots_txt: true,
      user_agent: 'Mozilla/5.0 (compatible; SeoAuditBot/1.0)',
      crawl_sitemap: true,
      follow_links: true,
      max_depth: 5,
      custom_headers: {}
    };

    const mergedSettings = { ...defaultSettings, ...settings };
    
    // First, create a crawl record
    const { data: crawlRecord, error: insertError } = await supabase
      .from('seo_crawler_crawls')
      .insert({
        client_id: clientId,
        url: normalizedUrl,
        domain: new URL(normalizedUrl).hostname,
        status: 'queued',
        settings: mergedSettings
      })
      .select()
      .single();
    
    if (insertError) throw new Error(`Failed to create crawl record: ${insertError.message}`);
    if (!crawlRecord) throw new Error('Failed to create crawl record: No data returned');

    console.log('Crawl record created:', crawlRecord.id);
    
    // Debug crawl record data
    debugCrawlData(crawlRecord);

    // Get the credentials from localStorage
    const brightDataUsername = localStorage.getItem('bright_data_username') || 
      'brd-customer-hl_2a8d2c33-zone-web_unlocker';
    const brightDataPassword = localStorage.getItem('bright_data_password') || 
      'obz0lal9qh4g';
    const brightDataApiKey = localStorage.getItem('bright_data_api_key') || '';
    
    console.log(`Using Bright Data credentials for crawl`);
    console.log(`Username: ${brightDataUsername.substring(0, 10)}... (${brightDataUsername.length} chars)`);
    console.log(`Password: ${brightDataPassword ? '*** (set)' : '(not set)'}`);
    console.log(`API Key: ${brightDataApiKey ? '*** (set)' : '(not set)'}`);
    
    // Set crawl to processing state immediately to show progress to user
    await supabase
      .from('seo_crawler_crawls')
      .update({ 
        status: 'processing',
        started_at: new Date().toISOString()
      })
      .eq('id', crawlRecord.id);
      
    console.log(`Updated crawl status to 'processing' for crawl ID: ${crawlRecord.id}`);

    // Call the edge function to start the crawl
    try {
      const { data, error } = await supabase.functions.invoke('seo-crawler', {
        body: { 
          crawlId: crawlRecord.id,
          url: normalizedUrl, 
          settings: mergedSettings,
          brightDataUsername,
          brightDataPassword,
          brightDataApiKey
        }
      });

      console.log('Edge function response:', data);
      
      if (error) {
        console.error('Edge function error:', error);
        
        // Update the crawl with error message but keep processing status
        await supabase
          .from('seo_crawler_crawls')
          .update({ 
            error_message: `Edge function error: ${error.message}, but crawl will continue in background`
          })
          .eq('id', crawlRecord.id);
          
        console.log(`Updated crawl with error message, but keeping status as 'processing'`);
      }
    } catch (invokeFunctionError) {
      console.error('Error invoking edge function:', invokeFunctionError);
      
      // Update crawl with error message but keep processing
      await supabase
        .from('seo_crawler_crawls')
        .update({ 
          error_message: 'Edge function invocation failed, but crawl will continue in background'
        })
        .eq('id', crawlRecord.id);
        
      console.log(`Failed to invoke edge function but keeping status as 'processing'`);
    }
    
    // Map database record to our CrawlResult type with normalized field names
    const result: CrawlResult = {
      id: crawlRecord.id,
      client_id: crawlRecord.client_id,
      url: crawlRecord.url,
      domain: crawlRecord.domain,
      status: 'processing', // Use processing status since we already updated it
      started_at: new Date().toISOString(), // Use current time since we just started
      start_time: new Date().toISOString(),
      completed_at: null,
      created_at: crawlRecord.inserted_at || new Date().toISOString(),
      updated_at: crawlRecord.updated_at || crawlRecord.inserted_at || new Date().toISOString(),
      total_pages: 0,
      pages_crawled: 0,
      total_issues: 0,
      error_message: "Crawl started. The process will continue in the background.",
      settings: mergedSettings, // Use the merged settings instead of db record
      success: true,
      message: 'Crawl started. It will continue in the background.',
      
      // Include additional properties with default values
      total_time_seconds: 0,
      total_links: 0,
      total_internal_links: 0,
      total_external_links: 0,
      total_broken_links: 0,
      inserted_at: crawlRecord.inserted_at || new Date().toISOString(),
      avg_page_load_time_ms: 0,
      crawl_depth: 0,
      duplicate_content_count: 0,
      mobile_friendly_score: 0,
      performance_score: 0,
      schema_markup_count: 0,
      summary: null
    };
    
    console.log(`Returning CrawlResult with ID: ${result.id} and status: ${result.status}`);
    return result;
  } catch (error) {
    console.error('Error starting crawl:', error);
    throw error;
  }
}
