
// Export types
export * from './types';

// Export main API functions
export {
  startCrawl,
  getCrawlResults,
  getCrawlResult,
  getCrawlPages,
  getPageIssues,
  getPageLinks,
  deleteCrawlRecord,
  saveSettings,
  getSettings
} from './api';

// For backward compatibility with existing code
export {
  getCrawlResults as getAllCrawlResults,
  getCrawlResult as fetchCrawlResult,
  getPageIssues as fetchCrawlIssues,
  getPageLinks as fetchCrawlLinks,
  deleteCrawlRecord as removeCrawlRecord,
  startCrawl as startCrawlService
} from './api';
