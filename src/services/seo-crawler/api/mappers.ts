
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
 * Maps an API crawl result to the domain model
 */
export function mapToCrawlResult(apiCrawl: ApiCrawlResult): CrawlResult {
  return {
    id: apiCrawl.id,
    client_id: apiCrawl.client_id || '',
    url: apiCrawl.url,
    domain: apiCrawl.domain,
    status: (apiCrawl.status as 'queued' | 'processing' | 'completed' | 'failed') || 'processing',
    started_at: apiCrawl.started_at || new Date().toISOString(),
    completed_at: apiCrawl.completed_at,
    total_pages: apiCrawl.total_pages || 0,
    pages_crawled: apiCrawl.pages_crawled || 0,
    total_issues: apiCrawl.total_issues || 0,
    total_links: apiCrawl.total_links || 0,
    total_internal_links: apiCrawl.total_internal_links || 0,
    total_external_links: apiCrawl.total_external_links || 0,
    total_broken_links: apiCrawl.total_broken_links || 0,
    error_message: apiCrawl.error_message,
    inserted_at: apiCrawl.inserted_at,
    total_time_seconds: apiCrawl.total_time_seconds,
    success: apiCrawl.success,
    message: apiCrawl.message,
    issues_count: apiCrawl.total_issues || 0
  };
}

/**
 * Maps an API crawl page to the domain model
 */
export function mapToCrawlPage(apiPage: ApiCrawlPage): CrawlPage {
  return {
    id: apiPage.id,
    crawl_id: apiPage.crawl_id,
    url: apiPage.url,
    status_code: apiPage.status_code,
    title: apiPage.title || '',
    meta_description: apiPage.meta_description || '',
    h1: apiPage.h1 || '',
    is_indexable: apiPage.is_indexable,
    word_count: apiPage.word_count,
    load_time_ms: apiPage.load_time_ms,
    content_length: apiPage.content_length,
    created_at: apiPage.crawled_at || apiPage.inserted_at || new Date().toISOString(),
    canonical_url: apiPage.canonical_url,
    redirect_url: apiPage.redirect_url,
    level: apiPage.level,
    internal_links_count: apiPage.internal_links_count,
    external_links_count: apiPage.external_links_count,
    text_ratio: apiPage.text_ratio,
    image_count: apiPage.image_count,
    h2_count: apiPage.h2_count,
    h3_count: apiPage.h3_count,
    has_schema_markup: apiPage.has_schema_markup,
    hreflang_count: apiPage.hreflang_count,
    content_type: apiPage.content_type,
    issues_count: apiPage.issues_count,
    meta_robots: apiPage.meta_robots,
    robots_directives: apiPage.robots_directives,
    mobile_friendly: apiPage.mobile_friendly,
    page_size_kb: apiPage.page_size_kb,
    images_without_alt: apiPage.images_without_alt
  };
}

/**
 * Maps an API crawl issue to the domain model
 */
export function mapToCrawlIssue(apiIssue: ApiCrawlIssue): CrawlIssue {
  return {
    id: apiIssue.id,
    crawl_id: apiIssue.crawl_id,
    page_id: apiIssue.page_id,
    url: apiIssue.page_url || (apiIssue.seo_crawler_pages?.url || ''),
    issue_type: apiIssue.issue_type,
    description: apiIssue.description,
    severity: (apiIssue.severity as 'critical' | 'high' | 'medium' | 'low' | 'info') || 'medium',
    created_at: apiIssue.created_at || apiIssue.inserted_at || new Date().toISOString(),
    page_url: apiIssue.page_url || (apiIssue.seo_crawler_pages?.url || ''),
    element: apiIssue.element,
    fix_suggestion: apiIssue.fix_suggestion,
    recommended_fix: apiIssue.recommended_fix,
    category: apiIssue.category
  };
}

/**
 * Maps an API crawl link to the domain model
 */
export function mapToCrawlLink(apiLink: ApiCrawlLink): CrawlLink {
  return {
    id: apiLink.id,
    crawl_id: apiLink.crawl_id,
    page_id: apiLink.page_id,
    source_url: apiLink.url || '',
    target_url: apiLink.url || '',
    text: apiLink.anchor_text || '',
    is_internal: apiLink.is_internal,
    is_broken: apiLink.is_broken,
    status_code: apiLink.status_code || 0,
    created_at: apiLink.created_at || apiLink.inserted_at || new Date().toISOString(),
    url: apiLink.url,
    anchor_text: apiLink.anchor_text,
    follow: apiLink.follow,
    rel_attributes: apiLink.rel_attributes
  };
}

/**
 * Maps an API crawl heading to the domain model
 */
export function mapToCrawlHeading(apiHeading: ApiCrawlHeading): CrawlHeading {
  return {
    id: apiHeading.id,
    crawl_id: apiHeading.crawl_id,
    page_id: apiHeading.page_id,
    url: apiHeading.page_url || (apiHeading.seo_crawler_pages?.url || ''),
    level: parseInt((apiHeading.heading_type || 'h1').replace('h', '')) || 1,
    text: apiHeading.content || '',
    created_at: apiHeading.created_at || apiHeading.inserted_at || new Date().toISOString(),
    heading_type: apiHeading.heading_type,
    content: apiHeading.content,
    position: apiHeading.position,
    page_url: apiHeading.page_url || (apiHeading.seo_crawler_pages?.url || '')
  };
}
