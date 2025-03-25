
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

    console.log('Crawl record created:', crawlRecord.id);

    // Get Bright Data credentials from localStorage
    let brightDataUsername = localStorage.getItem('bright_data_username') || '';
    let brightDataPassword = localStorage.getItem('bright_data_password') || '';
    
    console.log(`Using Bright Data credentials - Username: ${brightDataUsername ? 'Available' : 'Not available'}, Password: ${brightDataPassword ? 'Available' : 'Not available'}`);

    // Call the Edge Function to start the crawl
    try {
      const { data, error } = await supabase.functions.invoke('seo-crawler', {
        body: { 
          crawlId: crawlRecord.id,
          url, 
          settings: mergedSettings,
          brightDataUsername,
          brightDataPassword
        }
      });

      console.log('Edge function response:', data);
      
      if (error) {
        console.error('Edge function error:', error);
        
        // Update the crawl record to reflect the error
        await supabase
          .from('seo_crawler_crawls')
          .update({ 
            status: 'failed',
            error_message: `Edge function error: ${error.message || 'Unknown error'}`
          })
          .eq('id', crawlRecord.id);
          
        throw new Error(`Edge function error: ${error.message}`);
      }
      
      // The status will be updated by the edge function, but we set it to processing here
      // in case there's a delay before the edge function starts
      const { error: updateError } = await supabase
        .from('seo_crawler_crawls')
        .update({ status: 'processing' })
        .eq('id', crawlRecord.id);
      
      if (updateError) console.error('Error updating crawl status:', updateError);
      
    } catch (invokeFunctionError) {
      console.error('Error invoking edge function:', invokeFunctionError);
      
      // Update the crawl record to reflect the error
      await supabase
        .from('seo_crawler_crawls')
        .update({ 
          status: 'failed',
          error_message: invokeFunctionError instanceof Error 
            ? invokeFunctionError.message 
            : 'Error invoking the SEO crawler edge function'
        })
        .eq('id', crawlRecord.id);
        
      throw invokeFunctionError;
    }
    
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
