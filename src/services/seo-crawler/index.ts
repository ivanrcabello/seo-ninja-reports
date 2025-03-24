
// Export all crawler API functions and types
export * from './types';
export { 
  startCrawl, 
  getCrawlPages, 
  getCrawlResults, 
  getPageIssues, 
  getPageLinks 
} from './api';

// Export functions from additionalApi with renamed exports to avoid conflicts
export {
  fetchCrawlResult,
  fetchCrawlIssues,
  fetchCrawlLinks
} from './additionalApi';

// Export with specific names to avoid conflicts
export { fetchCrawlResults as getAllCrawlResults, deleteCrawlRecord as removeCrawlRecord } from './additionalApi';
export { fetchCrawlResults, deleteCrawlRecord } from './api';

// Export startCrawl with a specific name
export { startCrawl as startCrawlService } from './api';

// Export settings service
export * from './settingsService';
