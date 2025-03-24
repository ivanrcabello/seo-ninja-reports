
import { CrawlResult, CrawlPage, CrawlIssue, CrawlLink } from './types';
import { getCrawlResult, getCrawlPages, getPageIssues, getPageLinks } from './api';

// Get all data for a specific crawl
export const getCrawlData = async (crawlId: string): Promise<{
  result: CrawlResult;
  pages: CrawlPage[];
  issues: Record<string, CrawlIssue[]>;
  links: Record<string, CrawlLink[]>;
}> => {
  try {
    // Get crawl result
    const result = await getCrawlResult(crawlId);
    if (!result) {
      throw new Error('Crawl result not found');
    }
    
    // Get pages
    const pages = await getCrawlPages(crawlId);
    
    // Get issues and links for each page
    const issues: Record<string, CrawlIssue[]> = {};
    const links: Record<string, CrawlLink[]> = {};
    
    for (const page of pages) {
      const pageIssues = await getPageIssues(page.id);
      issues[page.id] = pageIssues;
      
      const pageLinks = await getPageLinks(page.id);
      links[page.id] = pageLinks;
    }
    
    return {
      result,
      pages,
      issues,
      links
    };
  } catch (error) {
    console.error("Error retrieving crawl data:", error);
    throw error;
  }
};

// Get summary statistics for a crawl
export const getCrawlSummary = async (crawlId: string): Promise<{
  pagesCount: number;
  issuesCount: number;
  issuesBySeverity: Record<string, number>;
  issuesByType: Record<string, number>;
}> => {
  try {
    // Get pages
    const pages = await getCrawlPages(crawlId);
    
    // Initialize summary data
    const summary = {
      pagesCount: pages.length,
      issuesCount: 0,
      issuesBySeverity: {} as Record<string, number>,
      issuesByType: {} as Record<string, number>
    };
    
    // Process each page
    for (const page of pages) {
      const pageIssues = await getPageIssues(page.id);
      
      // Update issues count
      summary.issuesCount += pageIssues.length;
      
      // Update issues by severity
      pageIssues.forEach(issue => {
        const severity = issue.severity;
        if (!summary.issuesBySeverity[severity]) {
          summary.issuesBySeverity[severity] = 0;
        }
        summary.issuesBySeverity[severity]++;
        
        // Update issues by type
        const type = issue.issue_type;
        if (!summary.issuesByType[type]) {
          summary.issuesByType[type] = 0;
        }
        summary.issuesByType[type]++;
      });
    }
    
    return summary;
  } catch (error) {
    console.error("Error calculating crawl summary:", error);
    throw error;
  }
};
