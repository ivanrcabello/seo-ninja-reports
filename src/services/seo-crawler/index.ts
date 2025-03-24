
// Export types
export * from './types';

// Export primary API functions
export { 
  startCrawl, 
  getCrawlPages, 
  getPageIssues, 
  getPageLinks,
  getCrawlResult
} from './api';

// Export renamed functions from additionalApi to avoid conflicts
export {
  fetchCrawlResult,
  fetchCrawlIssues,
  fetchCrawlLinks
} from './additionalApi';

// Rename exports from additionalApi to avoid conflicts
export { fetchCrawlResults as getAllCrawlResults } from './additionalApi';
export { deleteCrawlRecord as removeCrawlRecord } from './additionalApi';

// Export from API with original names (but add unique aliases to avoid conflicts)
export { fetchCrawlResults as fetchCrawlResultsList, deleteCrawlRecord as deleteCrawlRecordApi } from './api';

// Export startCrawlService for use in CrawlerDialog
export { startCrawl as startCrawlService } from './api';

// Export settings service
export * from './settingsService';
