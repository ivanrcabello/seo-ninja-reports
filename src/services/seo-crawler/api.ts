
import { supabase } from '@/integrations/supabase/client';
import { CrawlResult, CrawlPage, CrawlIssue, CrawlLink, CrawlSettings } from './types';

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
    
    return crawlRecord as CrawlResult;
  } catch (error) {
    console.error('Error starting crawl:', error);
    throw error;
  }
}

/**
 * Get all crawl results for a given client
 */
export async function getCrawlResults(clientId: string): Promise<CrawlResult[]> {
  try {
    const { data, error } = await supabase
      .from('seo_crawler_crawls')
      .select('*')
      .eq('client_id', clientId)
      .order('inserted_at', { ascending: false });

    if (error) throw error;
    
    return data as CrawlResult[];
  } catch (error) {
    console.error('Error fetching crawl results:', error);
    return [];
  }
}

/**
 * Get a specific crawl result by ID
 */
export async function getCrawlResult(crawlId: string): Promise<CrawlResult | null> {
  try {
    const { data, error } = await supabase
      .from('seo_crawler_crawls')
      .select('*')
      .eq('id', crawlId)
      .single();

    if (error) throw error;
    
    return data as CrawlResult;
  } catch (error) {
    console.error('Error fetching crawl result:', error);
    return null;
  }
}

/**
 * Get all pages for a specific crawl
 */
export async function getCrawlPages(crawlId: string): Promise<CrawlPage[]> {
  try {
    const { data, error } = await supabase
      .from('seo_crawler_pages')
      .select('*')
      .eq('crawl_id', crawlId)
      .order('level', { ascending: true });

    if (error) throw error;
    
    return data.map((page: any) => ({
      id: page.id,
      crawl_id: page.crawl_id,
      url: page.url,
      status_code: page.status_code,
      title: page.title || '',
      meta_description: page.meta_description || '',
      h1: page.h1 || '',
      canonical_url: page.canonical_url || '',
      is_indexable: page.is_indexable,
      redirect_url: page.redirect_url,
      level: page.level,
      internal_links_count: page.internal_links_count,
      external_links_count: page.external_links_count,
      word_count: page.word_count,
      content_length: page.content_length,
      text_ratio: page.text_ratio,
      load_time_ms: page.load_time_ms,
      image_count: page.image_count,
      h2_count: page.h2_count,
      h3_count: page.h3_count,
      has_schema_markup: page.has_schema_markup,
      hreflang_count: page.hreflang_count || 0,
      content_type: page.content_type || '',
      issues_count: page.issues_count || 0,
      crawled_at: page.crawled_at || page.inserted_at
    }));
  } catch (error) {
    console.error('Error fetching crawl pages:', error);
    return [];
  }
}

/**
 * Get issues for a specific page
 */
export async function getPageIssues(pageId: string): Promise<CrawlIssue[]> {
  try {
    const { data, error } = await supabase
      .from('seo_crawler_issues')
      .select('*')
      .eq('page_id', pageId);

    if (error) throw error;
    
    return data.map((issue: any) => ({
      id: issue.id,
      page_id: issue.page_id,
      issue_type: issue.issue_type,
      description: issue.description,
      severity: issue.severity,
      recommended_fix: issue.recommended_fix,
      fix_suggestion: issue.fix_suggestion || null,
      element: issue.element || null
    }));
  } catch (error) {
    console.error('Error fetching page issues:', error);
    return [];
  }
}

/**
 * Get links for a specific page
 */
export async function getPageLinks(pageId: string): Promise<CrawlLink[]> {
  try {
    const { data, error } = await supabase
      .from('seo_crawler_links')
      .select('*')
      .eq('page_id', pageId);

    if (error) throw error;
    
    return data.map((link: any) => ({
      id: link.id,
      page_id: link.page_id,
      url: link.url,
      anchor_text: link.anchor_text || '',
      is_internal: link.is_internal,
      is_broken: link.is_broken,
      status_code: link.status_code,
      follow: link.follow,
      rel_attributes: link.rel_attributes || null
    }));
  } catch (error) {
    console.error('Error fetching page links:', error);
    return [];
  }
}

/**
 * Delete a crawl record
 */
export async function deleteCrawlRecord(crawlId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('seo_crawler_crawls')
      .delete()
      .eq('id', crawlId);

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting crawl record:', error);
    return false;
  }
}

/**
 * Save crawler settings
 */
export async function saveSettings(
  clientId: string, 
  settings: Partial<CrawlSettings>
): Promise<boolean> {
  try {
    // Extract domain from settings or use a default
    const domain = settings.include_urls && settings.include_urls.length > 0 
      ? new URL(settings.include_urls[0]).hostname 
      : 'default-domain.com';
      
    const { error } = await supabase
      .from('seo_crawler_settings')
      .upsert({
        client_id: clientId,
        domain: domain,
        max_pages: settings.max_pages || 100,
        exclude_patterns: settings.exclude_urls || [],
        include_patterns: settings.include_urls || [],
        follow_external_links: settings.follow_links || false,
        respect_robots_txt: settings.respect_robots_txt || true,
        user_agent: settings.user_agent || 'Mozilla/5.0 (compatible; SeoAuditBot/1.0)',
        max_depth: settings.max_depth || 5,
        crawl_sitemap: settings.crawl_sitemap || true,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error saving crawler settings:', error);
    return false;
  }
}

/**
 * Get crawler settings for a client
 */
export async function getSettings(
  clientId: string
): Promise<CrawlSettings | null> {
  try {
    const { data, error } = await supabase
      .from('seo_crawler_settings')
      .select('*')
      .eq('client_id', clientId)
      .order('updated_at', { ascending: false })
      .limit(1);

    if (error) throw error;
    
    if (!data || data.length === 0) {
      // No settings found, return default settings
      return {
        max_pages: 100,
        exclude_urls: [],
        include_urls: [],
        respect_robots_txt: true,
        user_agent: 'Mozilla/5.0 (compatible; SeoAuditBot/1.0)',
        crawl_sitemap: true,
        follow_links: true,
        max_depth: 5
      };
    }
    
    // Convert from DB format to the CrawlSettings format
    return {
      max_pages: data[0].max_pages,
      exclude_urls: data[0].exclude_patterns || [],
      include_urls: data[0].include_patterns || [],
      respect_robots_txt: data[0].respect_robots_txt,
      user_agent: data[0].user_agent,
      crawl_sitemap: data[0].crawl_sitemap,
      follow_links: data[0].follow_external_links,
      max_depth: data[0].max_depth,
      custom_headers: data[0].custom_headers
    };
  } catch (error) {
    console.error('Error fetching crawler settings:', error);
    return null;
  }
}
