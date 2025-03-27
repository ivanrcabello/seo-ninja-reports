
/**
 * Utility function to debug issues data
 */
export function debugIssuesData(data: any[]) {
  if (!data || data.length === 0) {
    console.log('No issues data to debug');
    return;
  }
  
  // Log the first issue to see its structure
  console.log('First issue data structure:', JSON.stringify(data[0], null, 2));
  
  // Count issues by type
  const typeCounts: Record<string, number> = {};
  data.forEach(issue => {
    const type = issue.issue_type || 'unknown';
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });
  
  console.log('Issue types count:', typeCounts);
  
  // Check for missing required fields
  const missingFields: Record<string, number> = {};
  const requiredFields = [
    'id', 'crawl_id', 'page_id', 'issue_type', 
    'description', 'severity'
  ];
  
  data.forEach(issue => {
    requiredFields.forEach(field => {
      if (issue[field] === undefined || issue[field] === null) {
        missingFields[field] = (missingFields[field] || 0) + 1;
      }
    });
  });
  
  if (Object.keys(missingFields).length > 0) {
    console.warn('Missing required fields in issues:', missingFields);
  }
}
