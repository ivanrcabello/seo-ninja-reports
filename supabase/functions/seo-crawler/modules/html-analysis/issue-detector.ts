
// SEO Issue detection module

interface PageData {
  title?: string | null;
  metaDescription?: string | null;
  h1?: string | null;
  wordCount?: number | null;
  images?: Array<{src: string, alt: string | null}>;
}

interface Issue {
  crawl_id?: string;
  page_id: string;
  issue_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical' | 'info';
  description: string;
  details?: any;
}

/**
 * Detect all SEO issues in the page
 */
export function detectAllIssues(pageId: string, pageData: PageData): { issues: Issue[], count: number } {
  const issues: Issue[] = [];
  
  // Title issues
  if (!pageData.title) {
    issues.push({
      page_id: pageId,
      issue_type: 'missing_title',
      severity: 'critical',
      description: 'The page is missing a title tag',
      details: { message: 'Title tags are crucial for SEO and user experience' }
    });
  } else if (pageData.title.length < 10) {
    issues.push({
      page_id: pageId,
      issue_type: 'title_too_short',
      severity: 'high',
      description: 'The title tag is too short',
      details: { title: pageData.title, length: pageData.title.length, min_recommended: 10 }
    });
  } else if (pageData.title.length > 60) {
    issues.push({
      page_id: pageId,
      issue_type: 'title_too_long',
      severity: 'medium',
      description: 'The title tag is too long and might be truncated in search results',
      details: { title: pageData.title, length: pageData.title.length, max_recommended: 60 }
    });
  }
  
  // Meta description issues
  if (!pageData.metaDescription) {
    issues.push({
      page_id: pageId,
      issue_type: 'missing_meta_description',
      severity: 'high',
      description: 'The page is missing a meta description',
      details: { message: 'Meta descriptions help improve click-through rates from search results' }
    });
  } else if (pageData.metaDescription.length < 50) {
    issues.push({
      page_id: pageId,
      issue_type: 'meta_description_too_short',
      severity: 'medium',
      description: 'The meta description is too short',
      details: { meta_description: pageData.metaDescription, length: pageData.metaDescription.length, min_recommended: 50 }
    });
  } else if (pageData.metaDescription.length > 160) {
    issues.push({
      page_id: pageId,
      issue_type: 'meta_description_too_long',
      severity: 'low',
      description: 'The meta description is too long and might be truncated in search results',
      details: { meta_description: pageData.metaDescription, length: pageData.metaDescription.length, max_recommended: 160 }
    });
  }
  
  // H1 issues
  if (!pageData.h1) {
    issues.push({
      page_id: pageId,
      issue_type: 'missing_h1',
      severity: 'high',
      description: 'The page is missing an H1 heading',
      details: { message: 'H1 headings help search engines understand the main topic of the page' }
    });
  }
  
  // Word count issues
  if (pageData.wordCount !== undefined && pageData.wordCount !== null) {
    if (pageData.wordCount < 300) {
      issues.push({
        page_id: pageId,
        issue_type: 'low_word_count',
        severity: 'medium',
        description: 'The page has thin content',
        details: { word_count: pageData.wordCount, min_recommended: 300 }
      });
    }
  }
  
  // Image alt text issues
  if (pageData.images && pageData.images.length > 0) {
    const imagesWithoutAlt = pageData.images.filter(img => !img.alt);
    
    if (imagesWithoutAlt.length > 0) {
      issues.push({
        page_id: pageId,
        issue_type: 'images_missing_alt',
        severity: 'medium',
        description: `${imagesWithoutAlt.length} images are missing alt text`,
        details: { 
          total_images: pageData.images.length,
          images_without_alt: imagesWithoutAlt.length,
          image_urls: imagesWithoutAlt.map(img => img.src).slice(0, 10) // Limit to first 10 URLs
        }
      });
    }
  }
  
  // Title and H1 matching/relationship
  if (pageData.title && pageData.h1 && 
      pageData.title.toLowerCase() === pageData.h1.toLowerCase()) {
    issues.push({
      page_id: pageId,
      issue_type: 'identical_title_and_h1',
      severity: 'low',
      description: 'The title tag and H1 heading are identical',
      details: { 
        title: pageData.title,
        h1: pageData.h1,
        recommendation: 'Consider making the title and H1 different but complementary'
      }
    });
  }
  
  return { issues, count: issues.length };
}
