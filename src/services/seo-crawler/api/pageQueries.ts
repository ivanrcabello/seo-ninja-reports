
// This file is kept for backward compatibility
// It re-exports functions from the new modular files

import { getPageIssues, getCrawlIssues } from './issueQueries';
import { getPageLinks, getCrawlLinks } from './linkQueries';
import { getPageHeadings, getCrawlHeadings } from './headingQueries';

// Export all page-related query functions
export {
  getPageIssues,
  getCrawlIssues,
  getPageLinks,
  getCrawlLinks,
  getPageHeadings,
  getCrawlHeadings
};
