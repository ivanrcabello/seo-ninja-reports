
// Public API - main exports
import { startCrawl } from './crawlOperations';
import { getCrawlResults, getCrawlResult, getCrawlPages } from './crawlQueries';
import { getPageIssues, getCrawlIssues } from './issueQueries';
import { getPageLinks, getCrawlLinks } from './linkQueries';
import { getPageHeadings, getCrawlHeadings } from './headingQueries';
import { deleteCrawlRecord } from './crawlQueries';
import { getCrawlSettings as getSettings, saveCrawlSettings as saveSettings } from './settingsOperations';

// Export all API functions
export {
  // Crawl operations
  startCrawl,
  getCrawlResults,
  getCrawlResult,
  getCrawlPages,
  getPageIssues,
  getCrawlIssues,
  getPageLinks,
  getCrawlLinks,
  getPageHeadings,
  getCrawlHeadings,
  deleteCrawlRecord,
  saveSettings,
  getSettings
};
