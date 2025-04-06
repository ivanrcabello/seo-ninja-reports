
import { supabase } from '@/integrations/supabase/client';
import { CrawlResult, CrawlPage } from '../types';
import { formatCrawlResult } from './crawlFormatter';

// Export functions from other files
export { 
  getCrawlResult, 
  getCrawlResults, 
  getCrawlPages,
  deleteCrawlRecord 
} from './crawlQueries';

export {
  getPageIssues,
  getCrawlIssues
} from './issueQueries';

export {
  getPageLinks,
  getCrawlLinks
} from './linkQueries';

export {
  getPageHeadings,
  getCrawlHeadings
} from './headingQueries';

export {
  saveCrawlSettings,
  getCrawlSettings
} from './settingsOperations';

/**
 * Start a new crawl
 */
export const startCrawl = async (
  clientId: string, 
  url: string, 
  settings?: any
): Promise<{ success: boolean; crawlId?: string; error?: string }> => {
  try {
    // Normalize URL
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }
    
    // Extract domain from URL
    const domain = new URL(url).hostname;
    
    // Default settings if not provided
    const defaultSettings = {
      max_pages: 100,
      exclude_urls: [
        '/wp-admin', 
        '/wp-login', 
        '/logout',
        '/cart', 
        '/checkout',
        '.jpg', 
        '.jpeg', 
        '.png', 
        '.gif',
        '.css', 
        '.js', 
        '.pdf'
      ],
      include_urls: [],
      respect_robots_txt: true,
      user_agent: 'Mozilla/5.0 (compatible; SeoAuditBot/1.0)',
      crawl_sitemap: true,
      follow_links: true,
      max_depth: 5,
      custom_headers: {}
    };
    
    const crawlSettings = settings || defaultSettings;
    
    // Create a new crawl record
    const { data: crawl, error: createError } = await supabase
      .from('seo_crawler_crawls')
      .insert({
        client_id: clientId,
        url: url,
        domain: domain,
        status: 'pending',
        settings: crawlSettings
      })
      .select()
      .single();
    
    if (createError) {
      console.error('Error creating crawl:', createError);
      return { 
        success: false, 
        error: `Error creating crawl: ${createError.message}` 
      };
    }
    
    // Call the Edge Function to start the crawl
    const { data: response, error: functionError } = await supabase.functions.invoke(
      'seo-crawler',
      {
        body: {
          crawlId: crawl.id,
          url: url,
          settings: crawlSettings,
          brightDataUsername: 'brd-customer-hl_cbc2d791-zone-web_unlocker1',
          brightDataPassword: '5d024usr515b',
          brightDataApiKey: '16dc9468b0aafcdaf27d0e878e71e079b2db99792012e1a1d9cf79ed2265230b'
        }
      }
    );
    
    if (functionError) {
      console.error('Error calling seo-crawler function:', functionError);
      return { 
        success: false, 
        error: `Error starting crawl: ${functionError.message}` 
      };
    }
    
    return { 
      success: true, 
      crawlId: crawl.id 
    };
    
  } catch (error: any) {
    console.error('Error in startCrawl:', error);
    return { 
      success: false, 
      error: `Error starting crawl: ${error.message}` 
    };
  }
};

/**
 * Restart a failed crawl
 */
export const restartCrawl = async (
  crawlId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Get the existing crawl
    const { data: crawl, error: getError } = await supabase
      .from('seo_crawler_crawls')
      .select('*')
      .eq('id', crawlId)
      .single();
    
    if (getError) {
      console.error('Error getting crawl for restart:', getError);
      return { 
        success: false, 
        error: `Error getting crawl: ${getError.message}` 
      };
    }
    
    // Update the crawl status to pending
    const { error: updateError } = await supabase
      .from('seo_crawler_crawls')
      .update({
        status: 'pending',
        error_message: null,
        started_at: null,
        completed_at: null,
        total_pages: 0,
        total_issues: 0,
        total_links: 0,
        pages_crawled: 0
      })
      .eq('id', crawlId);
    
    if (updateError) {
      console.error('Error updating crawl for restart:', updateError);
      return { 
        success: false, 
        error: `Error updating crawl: ${updateError.message}` 
      };
    }
    
    // Delete any existing pages, issues, links, headings, images
    const { error: deleteError } = await supabase
      .from('seo_crawler_pages')
      .delete()
      .eq('crawl_id', crawlId);
    
    if (deleteError) {
      console.error('Error deleting existing pages:', deleteError);
      // Continue anyway as this isn't critical
    }
    
    // Call the Edge Function to restart the crawl
    const { data: response, error: functionError } = await supabase.functions.invoke(
      'seo-crawler',
      {
        body: {
          crawlId: crawlId,
          url: crawl.url,
          settings: crawl.settings,
          brightDataUsername: 'brd-customer-hl_cbc2d791-zone-web_unlocker1',
          brightDataPassword: '5d024usr515b',
          brightDataApiKey: '16dc9468b0aafcdaf27d0e878e71e079b2db99792012e1a1d9cf79ed2265230b'
        }
      }
    );
    
    if (functionError) {
      console.error('Error calling seo-crawler function for restart:', functionError);
      return { 
        success: false, 
        error: `Error restarting crawl: ${functionError.message}` 
      };
    }
    
    return { success: true };
    
  } catch (error: any) {
    console.error('Error in restartCrawl:', error);
    return { 
      success: false, 
      error: `Error restarting crawl: ${error.message}` 
    };
  }
};
