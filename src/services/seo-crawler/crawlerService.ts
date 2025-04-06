
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
    const pagesRaw = await getCrawlPages(crawlId);
    
    // Convert to CrawlPage type with required properties
    const pages: CrawlPage[] = pagesRaw.map((page: any) => ({
      ...page,
      issues_count: Number(page.issues_count || 0),
      is_internal: page.is_internal !== undefined ? page.is_internal : true,
      is_crawled: page.is_crawled !== undefined ? page.is_crawled : true,
      created_at: page.created_at || page.crawled_at || new Date().toISOString(),
      updated_at: page.updated_at || page.crawled_at || new Date().toISOString()
    }));
    
    // Get all issues and links for the crawl
    const allIssuesRaw = await getCrawlIssues(crawlId);
    const allLinksRaw = await getCrawlLinks(crawlId);
    
    // Add required properties for CrawlIssue
    const allIssues: CrawlIssue[] = allIssuesRaw.map((issue: any) => ({
      ...issue,
      type: issue.issue_type, // Ensure type is set as an alias to issue_type
      created_at: issue.created_at || new Date().toISOString()
    }));
    
    // Add required properties for CrawlLink
    const allLinks: CrawlLink[] = allLinksRaw.map((link: any) => ({
      ...link,
      is_followed: link.follow !== undefined ? link.follow : true,
      created_at: link.created_at || new Date().toISOString()
    }));
    
    // Organize issues by page ID, type, and severity
    const issues: Record<string, CrawlIssue[]> = {};
    const issuesByType: Record<string, CrawlIssue[]> = {};
    const issuesBySeverity: Record<string, CrawlIssue[]> = {};
    
    allIssues.forEach(issue => {
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
    const links: Record<string, CrawlLink[]> = {};
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
    const pagesRaw = await getCrawlPages(crawlId);
    
    // Convert to CrawlPage type with required properties
    const pages: CrawlPage[] = pagesRaw.map((page: any) => ({
      ...page,
      issues_count: Number(page.issues_count || 0),
      is_internal: page.is_internal !== undefined ? page.is_internal : true,
      is_crawled: page.is_crawled !== undefined ? page.is_crawled : true,
      created_at: page.created_at || page.crawled_at || new Date().toISOString(),
      updated_at: page.updated_at || page.crawled_at || new Date().toISOString()
    }));
    
    // Get all issues for the crawl
    const issuesRaw = await getCrawlIssues(crawlId);
    
    // Add required properties for CrawlIssue
    const issues: CrawlIssue[] = issuesRaw.map((issue: any) => ({
      ...issue,
      type: issue.issue_type,
      created_at: issue.created_at || new Date().toISOString()
    }));
    
    // Get all links for the crawl
    const linksRaw = await getCrawlLinks(crawlId);
    
    // Add required properties for CrawlLink
    const links: CrawlLink[] = linksRaw.map((link: any) => ({
      ...link,
      is_followed: link.follow !== undefined ? link.follow : true,
      created_at: link.created_at || new Date().toISOString()
    }));
    
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
      const issueType = issue.issue_type || issue.type || 'unknown';
      if (!summary.issuesByType[issueType]) {
        summary.issuesByType[issueType] = 0;
      }
      summary.issuesByType[issueType]++;
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
    const issuesRaw = await getPageIssues(pageId);
    const linksRaw = await getPageLinks(pageId);
    
    // Add required properties for CrawlIssue
    const issues: CrawlIssue[] = issuesRaw.map((issue: any) => ({
      ...issue,
      type: issue.issue_type,
      created_at: issue.created_at || new Date().toISOString()
    }));
    
    // Add required properties for CrawlLink
    const links: CrawlLink[] = linksRaw.map((link: any) => ({
      ...link,
      is_followed: link.follow !== undefined ? link.follow : true,
      created_at: link.created_at || new Date().toISOString()
    }));
    
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
