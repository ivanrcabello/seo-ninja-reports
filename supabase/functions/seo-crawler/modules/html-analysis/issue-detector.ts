
// SEO issues detection module
import { SeoIssue } from '../../types.ts';
import { SEO_ISSUES } from '../../constants.ts';

/**
 * Check for title issues (missing or length problems)
 */
export function detectTitleIssues(pageId: string, title: string | null): SeoIssue[] {
  const issues: SeoIssue[] = [];
  
  if (!title || title.length === 0) {
    console.log('Issue detected: missing title');
    
    issues.push({
      page_id: pageId,
      issue_type: 'missing_title',
      severity: 'high',
      description: 'The page is missing a title tag'
    });
  } else if (title.length < 10 || title.length > 60) {
    console.log(`Issue detected: title length (${title.length} characters)`);
    
    issues.push({
      page_id: pageId,
      issue_type: 'title_length',
      severity: 'medium',
      description: `The title tag length (${title.length} characters) is ${title.length < 10 ? 'too short' : 'too long'}`
    });
  }
  
  return issues;
}

/**
 * Check for meta description issues (missing or length problems)
 */
export function detectMetaDescriptionIssues(pageId: string, metaDescription: string | null): SeoIssue[] {
  const issues: SeoIssue[] = [];
  
  if (!metaDescription || metaDescription.length === 0) {
    console.log('Issue detected: missing meta description');
    
    issues.push({
      page_id: pageId,
      issue_type: 'missing_meta_description',
      severity: 'medium',
      description: 'The page is missing a meta description tag'
    });
  } else if (metaDescription.length < 50 || metaDescription.length > 160) {
    console.log(`Issue detected: meta description length (${metaDescription.length} characters)`);
    
    issues.push({
      page_id: pageId,
      issue_type: 'meta_description_length',
      severity: 'low',
      description: `The meta description length (${metaDescription.length} characters) is ${metaDescription.length < 50 ? 'too short' : 'too long'}`
    });
  }
  
  return issues;
}

/**
 * Check for H1 heading issues (missing)
 */
export function detectH1Issues(pageId: string, h1: string | null): SeoIssue[] {
  const issues: SeoIssue[] = [];
  
  if (!h1 || h1.length === 0) {
    console.log('Issue detected: missing H1');
    
    issues.push({
      page_id: pageId,
      issue_type: 'missing_h1',
      severity: 'medium',
      description: 'The page is missing an H1 heading'
    });
  }
  
  return issues;
}

/**
 * Run all SEO issue detection checks
 */
export function detectAllIssues(pageId: string, extractedData: {
  title: string | null,
  metaDescription: string | null,
  h1: string | null
}): {
  issues: SeoIssue[],
  count: number
} {
  const { title, metaDescription, h1 } = extractedData;
  
  const titleIssues = detectTitleIssues(pageId, title);
  const metaDescriptionIssues = detectMetaDescriptionIssues(pageId, metaDescription);
  const h1Issues = detectH1Issues(pageId, h1);
  
  const allIssues = [...titleIssues, ...metaDescriptionIssues, ...h1Issues];
  
  return {
    issues: allIssues,
    count: allIssues.length
  };
}
