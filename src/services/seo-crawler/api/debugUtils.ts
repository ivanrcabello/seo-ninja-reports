
/**
 * Debug utility functions for SEO crawler data
 */

/**
 * Logs issue data to console to help debug structure
 */
export function debugIssuesData(data: any) {
  if (!data || data.length === 0) {
    console.log('No issues data to debug');
    return;
  }
  
  // Log the structure of the first item
  console.log('Issues data sample structure:', {
    sample: data[0],
    keys: Object.keys(data[0]),
    hasDetails: data[0].hasOwnProperty('details'),
    hasCreatedAt: data[0].hasOwnProperty('created_at'),
    relations: data[0].seo_crawler_pages ? 'Present' : 'Not present'
  });
}

/**
 * Logs link data to console to help debug structure
 */
export function debugLinksData(data: any) {
  if (!data || data.length === 0) {
    console.log('No links data to debug');
    return;
  }
  
  // Log the structure of the first item
  console.log('Links data sample structure:', {
    sample: data[0],
    keys: Object.keys(data[0]),
    hasRelAttributes: data[0].hasOwnProperty('rel_attributes'),
    hasCreatedAt: data[0].hasOwnProperty('created_at')
  });
}

/**
 * Logs crawl data to console to help debug structure
 */
export function debugCrawlData(data: any) {
  if (!data) {
    console.log('No crawl data to debug');
    return;
  }
  
  console.log('Crawl data structure:', {
    keys: Object.keys(data),
    hasTotalTimeSeconds: data.hasOwnProperty('total_time_seconds'),
    hasInsertedAt: data.hasOwnProperty('inserted_at'),
    hasCreatedAt: data.hasOwnProperty('created_at')
  });
}
