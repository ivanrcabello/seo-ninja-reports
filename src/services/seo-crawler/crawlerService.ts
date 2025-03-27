import { CrawlResult, CrawlPage, CrawlIssue, CrawlLink } from './types';
import { getCrawlResult, getCrawlPages } from './api/crawlQueries';
import { getPageIssues, getPageLinks, getCrawlIssues, getCrawlLinks } from './api/pageQueries';

// Get all data for a specific crawl
export const getCrawlData = async (crawlId: string): Promise<{
  result: CrawlResult;
  pages: CrawlPage[];
  issues: Record<string, CrawlIssue[]>;
  issuesByType: Record<string, CrawlIssue[]>;
  issuesBySeverity: Record<string, CrawlIssue[]>;
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
    
    // Get all issues and links for the crawl
    const allIssues = await getCrawlIssues(crawlId);
    const allLinks = await getCrawlLinks(crawlId);
    
    // Organize issues by type
    const issuesByType: Record<string, CrawlIssue[]> = {};
    const issuesBySeverity: Record<string, CrawlIssue[]> = {};
    
    // Set default severity levels if not present
    const ensureSeverity = (issue: CrawlIssue): CrawlIssue => {
      if (!issue.severity) {
        // Assign severity based on issue type if not already set
        const issueLowerCase = issue.issue_type.toLowerCase();
        
        if (issueLowerCase.includes('critical') || issueLowerCase.includes('broken') || issueLowerCase.includes('error')) {
          return { ...issue, severity: 'critical' as 'high' };
        } else if (issueLowerCase.includes('missing') || issueLowerCase.includes('duplicate')) {
          return { ...issue, severity: 'high' };
        } else if (issueLowerCase.includes('warning') || issueLowerCase.includes('long')) {
          return { ...issue, severity: 'medium' };
        } else if (issueLowerCase.includes('improve') || issueLowerCase.includes('consider')) {
          return { ...issue, severity: 'low' };
        } else {
          return { ...issue, severity: 'low' };
        }
      }
      return issue;
    };
    
    const processedIssues = allIssues.map(ensureSeverity);
    
    processedIssues.forEach(issue => {
      // Group by page ID
      if (issue.page_id) {
        if (!issues[issue.page_id]) {
          issues[issue.page_id] = [];
        }
        issues[issue.page_id].push(issue);
      }
      
      // Group by issue type
      if (!issuesByType[issue.issue_type]) {
        issuesByType[issue.issue_type] = [];
      }
      issuesByType[issue.issue_type].push(issue);
      
      // Group by severity
      const severity = issue.severity || 'info';
      if (!issuesBySeverity[severity]) {
        issuesBySeverity[severity] = [];
      }
      issuesBySeverity[severity].push(issue);
    });
    
    // Organize links by page ID
    allLinks.forEach(link => {
      if (link.page_id) {
        if (!links[link.page_id]) {
          links[link.page_id] = [];
        }
        links[link.page_id].push(link);
      }
    });
    
    return {
      result,
      pages,
      issues,
      issuesByType,
      issuesBySeverity,
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
  brokenLinksCount: number;
  totalInternalLinks: number;
  totalExternalLinks: number;
  slowPagesCount: number;
  missingMetaDataCount: number;
}> => {
  try {
    // Get all pages
    const pages = await getCrawlPages(crawlId);
    
    // Get all issues for the crawl
    const issues = await getCrawlIssues(crawlId);
    
    // Get all links for the crawl
    const links = await getCrawlLinks(crawlId);
    
    // Initialize summary data
    const summary = {
      pagesCount: pages.length,
      issuesCount: issues.length,
      issuesBySeverity: {} as Record<string, number>,
      issuesByType: {} as Record<string, number>,
      brokenLinksCount: links.filter(link => link.is_broken).length,
      totalInternalLinks: links.filter(link => link.is_internal).length,
      totalExternalLinks: links.filter(link => !link.is_internal).length,
      slowPagesCount: pages.filter(page => (page.load_time_ms || 0) > 2000).length,
      missingMetaDataCount: pages.filter(page => !page.meta_description || !page.title).length
    };
    
    // Count issues by severity and type
    issues.forEach(issue => {
      // Count by severity
      const severity = issue.severity || 'info';
      if (!summary.issuesBySeverity[severity]) {
        summary.issuesBySeverity[severity] = 0;
      }
      summary.issuesBySeverity[severity]++;
      
      // Count by type
      if (!summary.issuesByType[issue.issue_type]) {
        summary.issuesByType[issue.issue_type] = 0;
      }
      summary.issuesByType[issue.issue_type]++;
    });
    
    return summary;
  } catch (error) {
    console.error("Error calculating crawl summary:", error);
    throw error;
  }
};

// Utility function to get data for one page
export const getPageData = async (pageId: string): Promise<{
  issues: CrawlIssue[];
  links: CrawlLink[];
}> => {
  try {
    const issues = await getPageIssues(pageId);
    const links = await getPageLinks(pageId);
    
    return {
      issues,
      links
    };
  } catch (error) {
    console.error("Error retrieving page data:", error);
    throw error;
  }
};

// Export service functions
export default {
  getCrawlData,
  getCrawlSummary,
  getPageData
};
