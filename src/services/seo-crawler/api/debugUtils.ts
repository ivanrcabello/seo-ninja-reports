
import { Json } from '@/integrations/supabase/types';

/**
 * Debug crawl data to identify structure issues
 */
export function debugCrawlData(data: any): void {
  if (!data) {
    console.log('No crawl data to debug');
    return;
  }
  
  console.log('Data keys:', Object.keys(data));
  console.log('Settings type:', typeof data.settings);
  
  // Check if settings is present and its structure
  if (data.settings) {
    if (typeof data.settings === 'string') {
      console.log('Settings is a string, attempting to parse...');
      try {
        const parsedSettings = JSON.parse(data.settings);
        console.log('Parsed settings:', parsedSettings);
      } catch (e) {
        console.log('Failed to parse settings string:', data.settings);
      }
    } else {
      console.log('Settings object keys:', Object.keys(data.settings));
    }
  }
  
  // Check other critical properties
  if (data.started_at && data.completed_at) {
    console.log('Crawl duration information:');
    console.log(`Started at: ${data.started_at}`);
    console.log(`Completed at: ${data.completed_at}`);
    
    try {
      const startDate = new Date(data.started_at);
      const endDate = new Date(data.completed_at);
      const durationSeconds = Math.round((endDate.getTime() - startDate.getTime()) / 1000);
      console.log(`Calculated duration: ${durationSeconds} seconds`);
    } catch (e) {
      console.log('Error calculating duration:', e);
    }
  }
  
  // Check for status and error information
  console.log(`Crawl status: ${data.status || 'unknown'}`);
  if (data.error_message) {
    console.log(`Error message: ${data.error_message}`);
  }
}

/**
 * Debug issues data to identify structure issues
 */
export function debugIssuesData(data: any[]): void {
  if (!data || data.length === 0) {
    console.log('No issues data to debug');
    return;
  }
  
  console.log('First issue keys:', Object.keys(data[0]));
  console.log('First issue type:', data[0].issue_type);
  console.log('First issue severity:', data[0].severity);
}

/**
 * Debug headings data to identify structure issues
 */
export function debugHeadingsData(data: any[]): void {
  if (!data || data.length === 0) {
    console.log('No headings data to debug');
    return;
  }
  
  console.log('First heading keys:', Object.keys(data[0]));
  console.log('First heading type:', data[0].heading_type);
}

/**
 * Ensure settings object conforms to CrawlSettings interface
 */
export function normalizeSettings(settingsData: any): {
  max_pages: number;
  exclude_urls: string[];
  include_urls: string[];
  respect_robots_txt: boolean;
  user_agent: string;
  crawl_sitemap: boolean;
  follow_links: boolean;
  max_depth: number;
  custom_headers: Record<string, string>;
} {
  // Handle case where settings is a string (try to parse it)
  let settings = settingsData;
  
  if (typeof settingsData === 'string') {
    try {
      settings = JSON.parse(settingsData);
    } catch (e) {
      console.log('Failed to parse settings string, using defaults');
      settings = {};
    }
  }
  
  // If settings is still not an object, use an empty object
  if (typeof settings !== 'object' || settings === null) {
    settings = {};
  }
  
  // Return normalized settings with defaults
  return {
    max_pages: settings.max_pages || 100,
    exclude_urls: Array.isArray(settings.exclude_urls) ? settings.exclude_urls : [],
    include_urls: Array.isArray(settings.include_urls) ? settings.include_urls : [],
    respect_robots_txt: settings.respect_robots_txt === false ? false : true,
    user_agent: settings.user_agent || 'Mozilla/5.0 (compatible; SeoAuditBot/1.0)',
    crawl_sitemap: settings.crawl_sitemap === false ? false : true,
    follow_links: settings.follow_links === false ? false : true,
    max_depth: settings.max_depth || 5,
    custom_headers: (settings.custom_headers && typeof settings.custom_headers === 'object') 
      ? settings.custom_headers as Record<string, string>
      : {}
  };
}

/**
 * Add missing properties to ensure consistent structure
 */
export function addMissingProperties(obj: any, defaultProps: Record<string, any>): any {
  if (!obj) return defaultProps;
  
  const result = { ...obj };
  
  for (const [key, value] of Object.entries(defaultProps)) {
    if (result[key] === undefined) {
      result[key] = value;
    }
  }
  
  return result;
}
