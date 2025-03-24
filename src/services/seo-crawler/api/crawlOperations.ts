
import { supabase } from '@/integrations/supabase/client';
import { CrawlResult, CrawlSettings } from '../types';

/**
 * Start a new crawl for a given client
 */
export async function startCrawl(
  clientId: string, 
  url: string, 
  settings: Partial<CrawlSettings> = {}
): Promise<CrawlResult> {
  try {
    // Merge default settings with custom settings
    const defaultSettings: CrawlSettings = {
      max_pages: 100,
      exclude_urls: [],
      include_urls: [],
      respect_robots_txt: true,
      user_agent: 'Mozilla/5.0 (compatible; SeoAuditBot/1.0)',
      crawl_sitemap: true,
      follow_links: true,
      max_depth: 5
    };

    const mergedSettings = { ...defaultSettings, ...settings };
    
    // First, create a crawl record
    const { data: crawlRecord, error: insertError } = await supabase
      .from('seo_crawler_crawls')
      .insert({
        client_id: clientId,
        url: url,
        domain: new URL(url.startsWith('http') ? url : `https://${url}`).hostname,
        status: 'queued',
        settings: mergedSettings
      })
      .select()
      .single();
    
    if (insertError) throw new Error(`Failed to create crawl record: ${insertError.message}`);
    if (!crawlRecord) throw new Error('Failed to create crawl record: No data returned');

    // Call the Edge Function to start the crawl
    const { data, error } = await supabase.functions.invoke('seo-crawler', {
      body: { 
        crawlId: crawlRecord.id,
        url, 
        settings: mergedSettings 
      }
    });

    if (error) throw new Error(`Edge function error: ${error.message}`);
    
    // Update the crawl record with processing status
    const { error: updateError } = await supabase
      .from('seo_crawler_crawls')
      .update({ status: 'processing' })
      .eq('id', crawlRecord.id);
    
    if (updateError) console.error('Error updating crawl status:', updateError);
    
    // Add success and message properties for the component to use
    return {
      ...crawlRecord as unknown as CrawlResult,
      success: true,
      message: 'Crawl started successfully'
    };
  } catch (error) {
    console.error('Error starting crawl:', error);
    throw error;
  }
}
