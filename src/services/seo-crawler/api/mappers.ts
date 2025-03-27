
import { 
  CrawlResult, 
  CrawlPage, 
  CrawlIssue, 
  CrawlLink, 
  CrawlHeading 
} from '../types';
import { 
  ApiCrawlResult, 
  ApiCrawlPage, 
  ApiCrawlIssue, 
  ApiCrawlLink, 
  ApiCrawlHeading 
} from './responseTypes';

/**
 * Map API crawl result to our domain model
 */
export function mapApiCrawlToCrawlResult(crawl: ApiCrawlResult): CrawlResult {
  return {
    id: crawl.id,
    client_id: crawl.client_id || '',
    url: crawl.url,
    domain: crawl.domain,
    status: (crawl.status as 'queued' | 'processing' | 'completed' | 'failed') || 'processing',
    started_at: crawl.started_at || '',
    completed_at: crawl.completed_at,
    total_pages: crawl.total_pages || 0,
    pages_crawled: crawl.pages_crawled || 0,
    total_issues: crawl.total_issues || 0,
    total_links: crawl.total_links || 0,
    total_internal_links: crawl.total_internal_links || 0,
    total_external_links: crawl.total_external_links || 0,
    total_broken_links: crawl.total_broken_links || 0,
    error_message: crawl.error_message,
    inserted_at: crawl.inserted_at,
    total_time_seconds: typeof crawl.total_time_seconds !== 'undefined' ? Number(crawl.total_time_seconds) : undefined,
    issues_count: crawl.total_issues || 0,
    settings: crawl.settings ? crawl.settings as any : undefined
  };
}

/**
 * Map API page to our domain model
 */
export function mapApiPageToCrawlPage(page: ApiCrawlPage): CrawlPage {
  return {
    id: page.id,
    crawl_id: page.crawl_id,
    url: page.url,
    status_code: page.status_code,
    title: page.title || '',
    meta_description: page.meta_description || '',
    h1: page.h1 || '',
    canonical_url: page.canonical_url || '',
    is_indexable: page.is_indexable,
    redirect_url: page.redirect_url,
    level: page.level,
    internal_links_count: page.internal_links_count,
    external_links_count: page.external_links_count,
    word_count: page.word_count,
    content_length: page.content_length,
    text_ratio: page.text_ratio,
    load_time_ms: page.load_time_ms,
    image_count: page.image_count,
    h2_count: page.h2_count,
    h3_count: page.h3_count,
    has_schema_markup: page.has_schema_markup,
    hreflang_count: page.hreflang_count || 0,
    content_type: page.content_type || '',
    issues_count: page.issues_count || 0,
    created_at: page.crawled_at || page.inserted_at || new Date().toISOString(),
    meta_robots: page.meta_robots || '',
    robots_directives: page.robots_directives || '',
    mobile_friendly: typeof page.mobile_friendly === 'boolean' ? page.mobile_friendly : true,
    page_size_kb: page.page_size_kb || 0,
    images_without_alt: page.images_without_alt || 0
  };
}

/**
 * Map API issue to our domain model
 */
export function mapApiIssueToCrawlIssue(issue: ApiCrawlIssue): CrawlIssue {
  // Normalize severity to a valid value
  let severityValue: 'critical' | 'high' | 'medium' | 'low' | 'info' = 'medium';
  if (issue.severity === 'critical' || issue.severity === 'high' || 
      issue.severity === 'medium' || issue.severity === 'low' || issue.severity === 'info') {
    severityValue = issue.severity as any;
  }

  return {
    id: issue.id,
    crawl_id: issue.crawl_id,
    page_id: issue.page_id,
    url: issue.seo_crawler_pages ? issue.seo_crawler_pages.url : '',
    page_url: issue.seo_crawler_pages ? issue.seo_crawler_pages.url : '',
    issue_type: issue.issue_type,
    description: issue.description,
    element: issue.element || '',
    severity: severityValue,
    fix_suggestion: issue.fix_suggestion || '',
    recommended_fix: issue.recommended_fix || '',
    category: issue.category || 'General',
    created_at: issue.created_at || new Date().toISOString(),
    seo_crawler_pages: issue.seo_crawler_pages
  };
}

/**
 * Map API link to our domain model
 */
export function mapApiLinkToCrawlLink(link: ApiCrawlLink): CrawlLink {
  return {
    id: link.id,
    crawl_id: link.crawl_id,
    page_id: link.page_id,
    url: link.url,
    anchor_text: link.anchor_text || 'Sin texto ancla',
    is_internal: link.is_internal,
    is_broken: link.is_broken,
    status_code: link.status_code || 0,
    follow: link.follow,
    rel_attributes: link.rel_attributes,
    // Required fields for the type system
    source_url: '',
    target_url: link.url || '',
    text: link.anchor_text || '',
    created_at: link.created_at || new Date().toISOString()
  };
}

/**
 * Map API heading to our domain model
 */
export function mapApiHeadingToCrawlHeading(heading: ApiCrawlHeading): CrawlHeading {
  return {
    id: heading.id,
    crawl_id: heading.crawl_id,
    page_id: heading.page_id,
    page_url: heading.page_url || (heading.seo_crawler_pages ? heading.seo_crawler_pages.url : ''),
    heading_type: heading.heading_type,
    content: heading.content,
    position: heading.position || 0,
    // Required fields for the type system
    url: heading.page_url || (heading.seo_crawler_pages ? heading.seo_crawler_pages.url : ''),
    level: parseInt(heading.heading_type?.replace('h', '') || '2'),
    text: heading.content || '',
    created_at: heading.created_at || new Date().toISOString(),
    seo_crawler_pages: heading.seo_crawler_pages
  };
}
