
// Public API - main exports
import { startCrawl } from './crawlOperations';
import { getCrawlResults, getCrawlResult, getCrawlPages } from './crawlQueries';
import { getPageIssues, getPageLinks } from './pageQueries';
import { deleteCrawlRecord } from './deleteOperations';
import { saveSettings, getSettings } from './settingsOperations';

// Export all API functions
export {
  // Crawl operations
  startCrawl,
  getCrawlResults,
  getCrawlResult,
  getCrawlPages,
  getPageIssues,
  getPageLinks,
  deleteCrawlRecord,
  saveSettings,
  getSettings
};
