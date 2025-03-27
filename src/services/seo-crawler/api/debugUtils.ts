
/**
 * Debug helper for API issues data
 */
export function debugIssuesData(data: any[]): void {
  if (!data || data.length === 0) {
    console.log('No issues data to debug');
    return;
  }
  
  // Log the first issue as a sample
  const sampleIssue = data[0];
  console.log('Sample issue structure:', {
    id: typeof sampleIssue.id,
    crawl_id: typeof sampleIssue.crawl_id,
    page_id: typeof sampleIssue.page_id,
    issue_type: typeof sampleIssue.issue_type,
    description: typeof sampleIssue.description,
    severity: sampleIssue.severity,
    has_page_url: !!sampleIssue.page_url,
    has_seo_crawler_pages: !!sampleIssue.seo_crawler_pages,
    seo_crawler_pages_url: sampleIssue.seo_crawler_pages ? !!sampleIssue.seo_crawler_pages.url : false
  });
}
