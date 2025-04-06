
/**
 * Issue detector module for SEO analysis
 */

interface PageData {
  title: string | null;
  metaDescription: string | null;
  h1: string | null;
  wordCount: number;
  images: Array<{ src: string; alt: string | null }>;
}

interface Issue {
  page_id: string;
  issue_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical' | 'info';
  description: string;
  recommended_fix?: string;
}

/**
 * Detect all SEO issues in a page
 */
export function detectAllIssues(
  pageId: string, 
  pageData: PageData
): { issues: Issue[]; count: number } {
  const issues: Issue[] = [];
  
  console.log('[Issue Detector] Starting issue detection...');

  // Check for missing title
  if (!pageData.title) {
    issues.push({
      page_id: pageId,
      issue_type: 'missing_title',
      severity: 'high',
      description: 'The page is missing a title tag',
      recommended_fix: 'Add a descriptive title tag to the page'
    });
    console.log('[Issue Detector] Found issue: missing_title');
  } else {
    // Check title length
    const titleLength = pageData.title.length;
    if (titleLength < 10) {
      issues.push({
        page_id: pageId,
        issue_type: 'title_too_short',
        severity: 'medium',
        description: `The title is too short (${titleLength} characters)`,
        recommended_fix: 'Increase title length to between 50-60 characters'
      });
      console.log('[Issue Detector] Found issue: title_too_short');
    } else if (titleLength > 70) {
      issues.push({
        page_id: pageId,
        issue_type: 'title_too_long',
        severity: 'low',
        description: `The title is too long (${titleLength} characters)`,
        recommended_fix: 'Reduce title length to between 50-60 characters to avoid truncation in search results'
      });
      console.log('[Issue Detector] Found issue: title_too_long');
    }
  }

  // Check for missing meta description
  if (!pageData.metaDescription) {
    issues.push({
      page_id: pageId,
      issue_type: 'missing_meta_description',
      severity: 'medium',
      description: 'The page is missing a meta description',
      recommended_fix: 'Add a compelling meta description to improve click-through rates from search results'
    });
    console.log('[Issue Detector] Found issue: missing_meta_description');
  } else {
    // Check meta description length
    const metaDescLength = pageData.metaDescription.length;
    if (metaDescLength < 50) {
      issues.push({
        page_id: pageId,
        issue_type: 'meta_description_too_short',
        severity: 'low',
        description: `The meta description is too short (${metaDescLength} characters)`,
        recommended_fix: 'Increase meta description length to between 120-160 characters'
      });
      console.log('[Issue Detector] Found issue: meta_description_too_short');
    } else if (metaDescLength > 160) {
      issues.push({
        page_id: pageId,
        issue_type: 'meta_description_too_long',
        severity: 'low',
        description: `The meta description is too long (${metaDescLength} characters)`,
        recommended_fix: 'Reduce meta description length to between 120-160 characters to avoid truncation in search results'
      });
      console.log('[Issue Detector] Found issue: meta_description_too_long');
    }
  }

  // Check for missing H1
  if (!pageData.h1) {
    issues.push({
      page_id: pageId,
      issue_type: 'missing_h1',
      severity: 'medium',
      description: 'The page is missing an H1 heading',
      recommended_fix: 'Add a descriptive H1 heading that includes primary keywords'
    });
    console.log('[Issue Detector] Found issue: missing_h1');
  }

  // Check for low word count
  if (pageData.wordCount < 300) {
    issues.push({
      page_id: pageId,
      issue_type: 'low_word_count',
      severity: 'medium',
      description: `The page has low word count (${pageData.wordCount} words)`,
      recommended_fix: 'Add more quality content to reach at least 300-500 words for better ranking potential'
    });
    console.log('[Issue Detector] Found issue: low_word_count');
  }

  // Check for images without alt text
  const imagesWithoutAlt = pageData.images.filter(img => !img.alt).length;
  if (imagesWithoutAlt > 0) {
    issues.push({
      page_id: pageId,
      issue_type: 'images_missing_alt',
      severity: 'medium',
      description: `${imagesWithoutAlt} images are missing alt text`,
      recommended_fix: 'Add descriptive alt text to all images for accessibility and SEO'
    });
    console.log('[Issue Detector] Found issue: images_missing_alt');
  }

  console.log(`[Issue Detector] Completed issue detection, found ${issues.length} issues`);

  return {
    issues,
    count: issues.length
  };
}
