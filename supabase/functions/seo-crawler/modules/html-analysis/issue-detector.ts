
// SEO issue detection logic
import { SEOIssue } from '../../types.ts';

interface ContentData {
  title: string | null;
  metaDescription: string | null;
  h1: string | null;
}

/**
 * Detect all SEO issues in the page
 */
export function detectAllIssues(
  pageId: string, 
  data: ContentData
): { issues: SEOIssue[], count: number } {
  const issues: SEOIssue[] = [];
  
  // Check missing title
  if (!data.title) {
    issues.push({
      page_id: pageId,
      issue_type: 'missing_title',
      description: 'The page is missing a title tag',
      severity: 'high',
      created_at: new Date().toISOString()
    });
  } 
  // Check title length
  else if (data.title.length < 10) {
    issues.push({
      page_id: pageId,
      issue_type: 'short_title',
      description: `The page title is too short (${data.title.length} characters)`,
      severity: 'medium',
      created_at: new Date().toISOString()
    });
  } else if (data.title.length > 70) {
    issues.push({
      page_id: pageId,
      issue_type: 'long_title',
      description: `The page title is too long (${data.title.length} characters)`,
      severity: 'low',
      created_at: new Date().toISOString()
    });
  }
  
  // Check missing meta description
  if (!data.metaDescription) {
    issues.push({
      page_id: pageId,
      issue_type: 'missing_meta_description',
      description: 'The page is missing a meta description',
      severity: 'high',
      created_at: new Date().toISOString()
    });
  } 
  // Check meta description length
  else if (data.metaDescription.length < 50) {
    issues.push({
      page_id: pageId,
      issue_type: 'short_meta_description',
      description: `The meta description is too short (${data.metaDescription.length} characters)`,
      severity: 'medium',
      created_at: new Date().toISOString()
    });
  } else if (data.metaDescription.length > 160) {
    issues.push({
      page_id: pageId,
      issue_type: 'long_meta_description',
      description: `The meta description is too long (${data.metaDescription.length} characters)`,
      severity: 'low',
      created_at: new Date().toISOString()
    });
  }
  
  // Check missing H1
  if (!data.h1) {
    issues.push({
      page_id: pageId,
      issue_type: 'missing_h1',
      description: 'The page is missing an H1 heading',
      severity: 'high',
      created_at: new Date().toISOString()
    });
  }
  
  // Check if title and H1 are identical
  if (data.title && data.h1 && data.title === data.h1) {
    issues.push({
      page_id: pageId,
      issue_type: 'identical_title_h1',
      description: 'The page title and H1 heading are identical',
      severity: 'low',
      created_at: new Date().toISOString()
    });
  }
  
  return {
    issues,
    count: issues.length
  };
}
