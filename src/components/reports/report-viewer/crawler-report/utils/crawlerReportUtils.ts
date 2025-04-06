
import { CrawlHeading, CrawlPage } from '@/services/seo-crawler/types';

/**
 * Group headings by page
 */
export const groupHeadingsByPage = (headings: CrawlHeading[]): Record<string, CrawlHeading[]> => {
  const groupedHeadings: Record<string, CrawlHeading[]> = {};
  
  headings.forEach(heading => {
    if (!heading.page_id) return;
    
    if (!groupedHeadings[heading.page_id]) {
      groupedHeadings[heading.page_id] = [];
    }
    
    groupedHeadings[heading.page_id].push(heading);
  });
  
  // Sort headings within each page by position
  Object.keys(groupedHeadings).forEach(pageId => {
    groupedHeadings[pageId].sort((a, b) => 
      (a.position || 0) - (b.position || 0)
    );
  });
  
  return groupedHeadings;
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
  const h1Count = pageHeadings.filter(h => h.heading_type === 'h1').length;
  return h1Count === 0;
};

/**
 * Create a map of pages by ID for easy lookup
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
