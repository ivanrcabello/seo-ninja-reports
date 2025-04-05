
/**
 * Debug utility functions for the SEO crawler
 */

/**
 * Debug issues data - logs helpful information about the issues data structure
 */
export function debugIssuesData(issues: any[] = []): void {
  if (issues.length === 0) {
    console.log('No issues data to debug');
    return;
  }

  try {
    // Log the first issue for debugging
    console.log('Sample issue data structure:', JSON.stringify(issues[0], null, 2));
    
    // Count issues by type
    const typeCount: Record<string, number> = {};
    issues.forEach(issue => {
      const type = issue.issue_type || 'unknown';
      typeCount[type] = (typeCount[type] || 0) + 1;
    });
    
    console.log('Issues by type:', typeCount);
    
    // Count issues by severity
    const severityCount: Record<string, number> = {};
    issues.forEach(issue => {
      const severity = issue.severity || 'unknown';
      severityCount[severity] = (severityCount[severity] || 0) + 1;
    });
    
    console.log('Issues by severity:', severityCount);
  } catch (error) {
    console.error('Error debugging issues data:', error);
  }
}
