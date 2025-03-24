
// Exportar tipos
export * from './types';

// Exportar funciones principales de la API
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

// Para mantener compatibilidad con código existente
export {
  getCrawlResults as getAllCrawlResults,
  getCrawlResult as fetchCrawlResult,
  getPageIssues as fetchCrawlIssues,
  getPageLinks as fetchCrawlLinks,
  deleteCrawlRecord as removeCrawlRecord,
  startCrawl as startCrawlService
} from './api';
