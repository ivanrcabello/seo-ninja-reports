
import { supabase } from '@/integrations/supabase/client';
import { CrawlHeading } from '@/services/seo-crawler/types';

export interface HeadingData {
  id: string;
  crawl_id: string;
  page_id: string;
  page_url: string;
  heading_type: string;
  content: string;
  heading_position: number;
}

/**
 * Gets all headings for a specific crawl
 */
export async function getCrawlHeadings(crawlId: string): Promise<{data: CrawlHeading[], error: any}> {
  try {
    const { data, error } = await supabase
      .rpc('get_crawl_headings', { crawl_id_param: crawlId });
    
    if (error) {
      console.error('Error fetching crawl headings:', error);
      return { data: [], error };
    }
    
    // Map the database result to match the CrawlHeading type
    const headings = Array.isArray(data) ? data.map((heading: HeadingData) => ({
      id: heading.id,
      crawl_id: heading.crawl_id,
      page_id: heading.page_id,
      page_url: heading.page_url,
      heading_type: heading.heading_type,
      content: heading.content,
      position: heading.heading_position, // Map to position instead of heading_position
      created_at: new Date().toISOString(),
      seo_crawler_pages: { url: heading.page_url }
    })) : [];
    
    return { data: headings as CrawlHeading[], error: null };
  } catch (err) {
    console.error('Exception fetching crawl headings:', err);
    return { data: [], error: err };
  }
}

/**
 * Gets all headings for a specific page
 */
export async function getPageHeadings(pageId: string): Promise<{data: CrawlHeading[], error: any}> {
  try {
    const { data, error } = await supabase
      .rpc('get_page_headings', { page_id_param: pageId });
    
    if (error) {
      console.error('Error fetching page headings:', error);
      return { data: [], error };
    }
    
    // Map the database result to match the CrawlHeading type
    const headings = Array.isArray(data) ? data.map((heading: HeadingData) => ({
      id: heading.id,
      crawl_id: heading.crawl_id,
      page_id: heading.page_id,
      page_url: heading.page_url,
      heading_type: heading.heading_type,
      content: heading.content,
      position: heading.heading_position, // Map to position instead of heading_position
      created_at: new Date().toISOString(),
      seo_crawler_pages: { url: heading.page_url }
    })) : [];
    
    return { data: headings as CrawlHeading[], error: null };
  } catch (err) {
    console.error('Exception fetching page headings:', err);
    return { data: [], error: err };
  }
}

/**
 * Analyzes heading structure for correct hierarchy and returns issues
 */
export function analyzeHeadingStructure(headings: HeadingData[]) {
  const issues = [];
  
  // Check if headings array exists and has items
  if (!headings || !Array.isArray(headings) || headings.length === 0) {
    return [{ type: 'missing_headings', message: 'No headings found on the page' }];
  }
  
  // Group headings by page
  const headingsByPage = headings.reduce((acc: Record<string, HeadingData[]>, heading) => {
    if (!acc[heading.page_url]) {
      acc[heading.page_url] = [];
    }
    acc[heading.page_url].push(heading);
    return acc;
  }, {});
  
  // Analyze each page's heading structure
  for (const [pageUrl, pageHeadings] of Object.entries(headingsByPage)) {
    // Sort by position
    pageHeadings.sort((a, b) => a.heading_position - b.heading_position);
    
    // Check if page has H1
    const h1s = pageHeadings.filter(h => h.heading_type === 'h1');
    if (h1s.length === 0) {
      issues.push({
        page: pageUrl,
        type: 'missing_h1',
        message: 'Page is missing an H1 heading'
      });
    } else if (h1s.length > 1) {
      issues.push({
        page: pageUrl,
        type: 'multiple_h1',
        message: `Page has ${h1s.length} H1 headings (should have only one)`
      });
    }
    
    // Check heading hierarchy
    let lastHeadingLevel = 0;
    for (let i = 0; i < pageHeadings.length; i++) {
      const heading = pageHeadings[i];
      const currentLevel = parseInt(heading.heading_type.substring(1));
      
      // First heading should be H1
      if (i === 0 && currentLevel !== 1) {
        issues.push({
          page: pageUrl,
          type: 'incorrect_first_heading',
          message: `First heading is ${heading.heading_type} instead of H1`
        });
      }
      
      // Check for skipped levels (e.g., H2 to H4 without H3)
      if (lastHeadingLevel > 0 && currentLevel > lastHeadingLevel + 1) {
        issues.push({
          page: pageUrl,
          type: 'skipped_heading_level',
          message: `Heading level skipped from H${lastHeadingLevel} to H${currentLevel}`
        });
      }
      
      lastHeadingLevel = currentLevel;
    }
  }
  
  return issues;
}
