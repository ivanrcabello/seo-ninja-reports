
import { CrawlHeading, CrawlIssue, CrawlPage } from '@/services/seo-crawler/types';

/**
 * Groups headings by page ID
 */
export const groupHeadingsByPage = (headings: CrawlHeading[] = []): Record<string, CrawlHeading[]> => {
  const headingsByPage: Record<string, CrawlHeading[]> = {};
  
  headings.forEach((heading) => {
    if (!heading.page_id) return;
    
    if (!headingsByPage[heading.page_id]) {
      headingsByPage[heading.page_id] = [];
    }
    
    headingsByPage[heading.page_id].push(heading);
  });
  
  return headingsByPage;
};

/**
 * Groups issues by severity
 */
export const groupIssuesBySeverity = (issues: CrawlIssue[] = []): Record<string, CrawlIssue[]> => {
  const issuesBySeverity: Record<string, CrawlIssue[]> = {};
  
  issues.forEach((issue) => {
    const severity = issue.severity || 'medium';
    
    if (!issuesBySeverity[severity]) {
      issuesBySeverity[severity] = [];
    }
    
    issuesBySeverity[severity].push(issue);
  });
  
  return issuesBySeverity;
};

/**
 * Groups issues by type
 */
export const groupIssuesByType = (issues: CrawlIssue[] = []): Record<string, CrawlIssue[]> => {
  const issuesByType: Record<string, CrawlIssue[]> = {};
  
  issues.forEach((issue) => {
    const type = issue.issue_type || issue.type || 'unknown';
    
    if (!issuesByType[type]) {
      issuesByType[type] = [];
    }
    
    issuesByType[type].push(issue);
  });
  
  return issuesByType;
};

/**
 * Check if a page has multiple H1 headings
 */
export const hasMultipleH1s = (pageId: string, headingsByPage: Record<string, CrawlHeading[]>): boolean => {
  const pageHeadings = headingsByPage[pageId] || [];
  const h1Count = pageHeadings.filter(h => h.heading_type === 'h1').length;
  return h1Count > 1;
};

/**
 * Check if a page is missing H1 headings
 */
export const isMissingH1 = (pageId: string, headingsByPage: Record<string, CrawlHeading[]>): boolean => {
  const pageHeadings = headingsByPage[pageId] || [];
  return !pageHeadings.some(h => h.heading_type === 'h1');
};

/**
 * Create a map of pages by ID for quick lookup
 */
export const createPageMap = (pages: CrawlPage[]): Record<string, CrawlPage> => {
  const pageMap: Record<string, CrawlPage> = {};
  
  pages.forEach(page => {
    if (page.id) {
      pageMap[page.id] = page;
    }
  });
  
  return pageMap;
};

/**
 * Chart colors for data visualization
 */
export const CHART_COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'
];

/**
 * Severity color mapping
 */
export const SEVERITY_COLORS = {
  'critical': '#ef4444',
  'high': '#f97316',
  'medium': '#f59e0b',
  'low': '#84cc16',
  'info': '#3b82f6'
};
