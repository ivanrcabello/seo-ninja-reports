
/**
 * Debug utility to log issues data structure
 */
export function debugIssuesData(data: any[]) {
  if (!data || data.length === 0) {
    console.warn('No issues data found');
    return;
  }
  
  try {
    console.log('Issues data count:', data.length);
    console.log('First issue example:', data[0]);
    
    // Create a list of all issue types
    const issueTypes = [...new Set(data.map(issue => issue.issue_type))];
    console.log('Issue types found:', issueTypes);
    
    // Create a list of all severities
    const severities = [...new Set(data.map(issue => issue.severity))];
    console.log('Severity types found:', severities);
    
    // Count issues per page
    const issuesByPage: Record<string, number> = {};
    data.forEach(issue => {
      const pageId = issue.page_id;
      if (pageId) {
        issuesByPage[pageId] = (issuesByPage[pageId] || 0) + 1;
      }
    });
    
    console.log('Issues count by page:', issuesByPage);
    
    // Check if we have any issues with missing page_id or page_url
    const missingPageData = data.filter(issue => !issue.page_id && !issue.page_url);
    if (missingPageData.length > 0) {
      console.warn(`Found ${missingPageData.length} issues with missing page data`);
    }
  } catch (error) {
    console.error('Error while debugging issues data:', error);
  }
}

/**
 * Debug utility to log headings data structure
 */
export function debugHeadingsData(data: any[]) {
  if (!data || data.length === 0) {
    console.warn('No headings data found');
    return;
  }
  
  try {
    console.log('Headings data count:', data.length);
    console.log('First heading example:', data[0]);
    
    // Create a list of all heading types
    const headingTypes = [...new Set(data.map(heading => heading.heading_type))];
    console.log('Heading types found:', headingTypes);
    
    // Count headings per page
    const headingsByPage: Record<string, number> = {};
    data.forEach(heading => {
      const pageId = heading.page_id;
      if (pageId) {
        headingsByPage[pageId] = (headingsByPage[pageId] || 0) + 1;
      }
    });
    
    console.log('Headings count by page:', headingsByPage);
    
    // Check if we have the expected structure
    const hasPageUrl = data.some(heading => heading.page_url || (heading.seo_crawler_pages && heading.seo_crawler_pages.url));
    if (!hasPageUrl) {
      console.warn('No page_url found in headings data');
    }
  } catch (error) {
    console.error('Error while debugging headings data:', error);
  }
}
