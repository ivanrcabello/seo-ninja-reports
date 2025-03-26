
/**
 * Utility functions for debugging SEO crawler data
 */

/**
 * Write detailed logs about issues data
 */
export function debugIssuesData(data: any[]) {
  console.log(`Issues data count: ${data?.length || 0}`);
  
  if (data && data.length > 0) {
    console.log('Sample issue:', data[0]);
    
    // Count issues by page_id
    const issuesByPage: Record<string, number> = {};
    data.forEach(issue => {
      if (!issuesByPage[issue.page_id]) {
        issuesByPage[issue.page_id] = 0;
      }
      issuesByPage[issue.page_id]++;
    });
    
    console.log('Issues by page:', issuesByPage);
    
    // Count issues by type
    const issuesByType: Record<string, number> = {};
    data.forEach(issue => {
      if (!issuesByType[issue.issue_type]) {
        issuesByType[issue.issue_type] = 0;
      }
      issuesByType[issue.issue_type]++;
    });
    
    console.log('Issues by type:', issuesByType);
  } else {
    console.warn('No issues data found');
  }
}

/**
 * Write detailed logs about headings data
 */
export function debugHeadingsData(data: any[]) {
  console.log(`Headings data count: ${data?.length || 0}`);
  
  if (data && data.length > 0) {
    console.log('Sample heading:', data[0]);
    
    // Count headings by page_id
    const headingsByPage: Record<string, number> = {};
    data.forEach(heading => {
      if (!headingsByPage[heading.page_id]) {
        headingsByPage[heading.page_id] = 0;
      }
      headingsByPage[heading.page_id]++;
    });
    
    console.log('Headings by page:', headingsByPage);
    
    // Count headings by type
    const headingsByType: Record<string, number> = {};
    data.forEach(heading => {
      if (!headingsByType[heading.heading_type]) {
        headingsByType[heading.heading_type] = 0;
      }
      headingsByType[heading.heading_type]++;
    });
    
    console.log('Headings by type:', headingsByType);
  } else {
    console.warn('No headings data found');
  }
}
