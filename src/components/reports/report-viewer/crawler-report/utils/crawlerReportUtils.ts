
import { CrawlIssue, CrawlHeading } from '@/services/seo-crawler/types';

// Chart colors for consistency
export const CHART_COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658'];

// Severity colors for consistent display
export const SEVERITY_COLORS = {
  critical: '#ef4444', // red
  high: '#f97316',     // orange
  medium: '#f59e0b',   // amber
  low: '#84cc16',      // lime
  info: '#3b82f6'      // blue
};

/**
 * Group issues by their severity
 */
export const groupIssuesBySeverity = (issues: CrawlIssue[]): Record<string, CrawlIssue[]> => {
  const grouped: Record<string, CrawlIssue[]> = {
    critical: [],
    high: [],
    medium: [],
    low: [],
    info: []
  };
  
  issues.forEach(issue => {
    const severity = issue.severity || 'medium';
    if (!grouped[severity]) {
      grouped[severity] = [];
    }
    grouped[severity].push(issue);
  });
  
  return grouped;
};

/**
 * Group issues by their type
 */
export const groupIssuesByType = (issues: CrawlIssue[]): Record<string, CrawlIssue[]> => {
  const grouped: Record<string, CrawlIssue[]> = {};
  
  issues.forEach(issue => {
    const type = issue.issue_type || issue.type || 'unknown';
    if (!grouped[type]) {
      grouped[type] = [];
    }
    grouped[type].push(issue);
  });
  
  return grouped;
};

/**
 * Group headings by page ID
 */
export const groupHeadingsByPage = (headings: CrawlHeading[]): Record<string, CrawlHeading[]> => {
  const grouped: Record<string, CrawlHeading[]> = {};
  
  headings.forEach(heading => {
    if (!heading.page_id) return;
    
    if (!grouped[heading.page_id]) {
      grouped[heading.page_id] = [];
    }
    grouped[heading.page_id].push(heading);
  });
  
  return grouped;
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
 * Check if a page is missing an H1 heading
 */
export const isMissingH1 = (pageId: string, headingsByPage: Record<string, CrawlHeading[]>): boolean => {
  const pageHeadings = headingsByPage[pageId] || [];
  const h1Count = pageHeadings.filter(h => h.heading_type === 'h1').length;
  return h1Count === 0;
};
