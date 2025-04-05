
/**
 * Debug utilities for SEO crawler API
 */

/**
 * Logs debug information about issues data
 */
export function debugIssuesData(data: any[]): void {
  try {
    console.log(`Debug issues data: Found ${data.length} issues`);
    
    // Sample the first 2 issues to avoid excessive logging
    const sampleSize = Math.min(2, data.length);
    for (let i = 0; i < sampleSize; i++) {
      const issue = data[i];
      console.log(`Issue sample ${i + 1}:`);
      console.log(`- ID: ${issue.id}`);
      console.log(`- Type: ${issue.issue_type}`);
      console.log(`- Severity: ${issue.severity}`);
      console.log(`- Page ID: ${issue.page_id}`);
      console.log(`- Has page reference: ${!!issue.seo_crawler_pages}`);
    }
    
    // Issue type stats
    const typeStats: Record<string, number> = {};
    data.forEach(issue => {
      const type = issue.issue_type || 'unknown';
      typeStats[type] = (typeStats[type] || 0) + 1;
    });
    
    console.log('Issue type statistics:', typeStats);
    
    // Severity stats
    const severityStats: Record<string, number> = {};
    data.forEach(issue => {
      const severity = issue.severity || 'unknown';
      severityStats[severity] = (severityStats[severity] || 0) + 1;
    });
    
    console.log('Issue severity statistics:', severityStats);
  } catch (error) {
    console.error('Error in debugIssuesData:', error);
  }
}
