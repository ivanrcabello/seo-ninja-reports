
// Re-export all needed functions in one place for easier access
export { getCrawlPages, getCrawlResult, getCrawlResults, deleteCrawlRecord } from './crawlQueries';
export { getPageIssues, getCrawlIssues } from './issueQueries';
export { getPageHeadings, getCrawlHeadings } from './headingQueries';
export { getPageLinks, getCrawlLinks } from './linkQueries';
