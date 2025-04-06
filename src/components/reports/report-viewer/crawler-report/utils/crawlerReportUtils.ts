
import { CrawlHeading, CrawlIssue, CrawlPage } from '@/services/seo-crawler/types';

// Group headings by page
export const groupHeadingsByPage = (headings: CrawlHeading[] = []): Record<string, CrawlHeading[]> => {
  const headingsByPage: Record<string, CrawlHeading[]> = {};
  headings.forEach(heading => {
    if (!heading.page_id) return;
    
    if (!headingsByPage[heading.page_id]) {
      headingsByPage[heading.page_id] = [];
    }
    headingsByPage[heading.page_id].push(heading);
  });
  
  return headingsByPage;
};

// Group issues by type
export const groupIssuesByType = (issues: CrawlIssue[] = []): Record<string, CrawlIssue[]> => {
  const issuesByType: Record<string, CrawlIssue[]> = {};
  
  issues.forEach(issue => {
    if (!issuesByType[issue.issue_type]) {
      issuesByType[issue.issue_type] = [];
    }
    issuesByType[issue.issue_type].push(issue);
  });
  
  return issuesByType;
};

// Group issues by severity
export const groupIssuesBySeverity = (issues: CrawlIssue[] = []): Record<string, CrawlIssue[]> => {
  const issuesBySeverity: Record<string, CrawlIssue[]> = {};
  
  issues.forEach(issue => {
    const severity = issue.severity || 'info';
    if (!issuesBySeverity[severity]) {
      issuesBySeverity[severity] = [];
    }
    issuesBySeverity[severity].push(issue);
  });
  
  return issuesBySeverity;
};

// Check if page has multiple H1s
export const hasMultipleH1s = (pageId: string, headingsByPage: Record<string, CrawlHeading[]>): boolean => {
  const pageHeadings = headingsByPage[pageId] || [];
  return pageHeadings.filter(h => h.heading_type === 'h1').length > 1;
};

// Check if page is missing H1
export const isMissingH1 = (pageId: string, headingsByPage: Record<string, CrawlHeading[]>): boolean => {
  const pageHeadings = headingsByPage[pageId] || [];
  return pageHeadings.filter(h => h.heading_type === 'h1').length === 0;
};

// Create a map of pages by ID
export const createPageMap = (pages: CrawlPage[] = []): Map<string, CrawlPage> => {
  const pageMap = new Map<string, CrawlPage>();
  pages.forEach(page => pageMap.set(page.id, page));
  return pageMap;
};

// Constants for severity colors
export const SEVERITY_COLORS = {
  critical: '#FF0000',
  high: '#FF6B6B',
  medium: '#FFC107',
  low: '#4CAF50',
  info: '#2196F3'
};

// Constants for chart colors
export const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#D62728'];
