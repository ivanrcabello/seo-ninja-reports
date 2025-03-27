
import { toast } from 'sonner';
import { CrawlIssue } from './types';

/**
 * Get severity level class for an issue
 */
export function getIssueSeverityClass(severity: string): string {
  switch (severity) {
    case 'critical':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'low':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'info':
      return 'bg-gray-100 text-gray-800 border-gray-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
}

/**
 * Get severity level for sorting issues
 */
export function getIssueSeverityLevel(severity: string): number {
  switch (severity) {
    case 'critical':
      return 1;
    case 'high':
      return 2;
    case 'medium':
      return 3;
    case 'low':
      return 4;
    case 'info':
      return 5;
    default:
      return 99;
  }
}

/**
 * Sort issues by severity (critical first)
 */
export function sortIssuesBySeverity(issues: CrawlIssue[]): CrawlIssue[] {
  return [...issues].sort((a, b) => {
    return getIssueSeverityLevel(a.severity) - getIssueSeverityLevel(b.severity);
  });
}

/**
 * Group issues by severity
 */
export function groupIssuesBySeverity(issues: CrawlIssue[]): Record<string, CrawlIssue[]> {
  const groupedIssues: Record<string, CrawlIssue[]> = {};
  
  for (const issue of issues) {
    if (!groupedIssues[issue.severity]) {
      groupedIssues[issue.severity] = [];
    }
    
    groupedIssues[issue.severity].push(issue);
  }
  
  return groupedIssues;
}

/**
 * Format a number as a file size
 */
export function formatFileSize(sizeInKB?: number): string {
  if (sizeInKB === undefined) return 'Unknown';
  
  if (sizeInKB < 1024) {
    return `${sizeInKB.toFixed(2)} KB`;
  } else {
    return `${(sizeInKB / 1024).toFixed(2)} MB`;
  }
}

/**
 * Format a number as a percentage
 */
export function formatPercentage(value?: number): string {
  if (value === undefined) return 'Unknown';
  
  return `${(value * 100).toFixed(2)}%`;
}

/**
 * Format milliseconds as a readable time
 */
export function formatLoadTime(timeInMs?: number): string {
  if (timeInMs === undefined) return 'Unknown';
  
  if (timeInMs < 1000) {
    return `${timeInMs.toFixed(0)} ms`;
  } else {
    return `${(timeInMs / 1000).toFixed(2)} s`;
  }
}

/**
 * Get proper URL display formatting
 */
export function formatUrl(url: string, maxLength: number = 60): string {
  if (url.length <= maxLength) return url;
  
  // Remove protocol
  let displayUrl = url.replace(/^https?:\/\//, '');
  
  // If still too long, truncate the middle
  if (displayUrl.length > maxLength) {
    const start = displayUrl.substring(0, Math.floor(maxLength / 2) - 3);
    const end = displayUrl.substring(displayUrl.length - Math.floor(maxLength / 2) + 3);
    displayUrl = `${start}...${end}`;
  }
  
  return displayUrl;
}

/**
 * Copy text to clipboard
 */
export function copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text)
    .then(() => {
      toast.success('Copied to clipboard');
    })
    .catch((err) => {
      console.error('Could not copy text:', err);
      toast.error('Failed to copy to clipboard');
    });
}
