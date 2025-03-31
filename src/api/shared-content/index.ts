
// Base utilities - importing these specifically to avoid conflicts
import { 
  checkContentExists,
  checkContentPasswordProtection,
  verifyContentPassword,
  logContentAccess
} from './utils';

// Export these utilities directly
export {
  checkContentExists,
  checkContentPasswordProtection,
  verifyContentPassword,
  logContentAccess
};

// Re-export type-specific helpers for backwards compatibility
export {
  checkReportExists,
  checkReportPassword,
  verifyReportPassword,
  logReportAccess,
  checkInvoiceExists,
  checkInvoicePassword,
  verifyInvoicePassword,
  logInvoiceAccess,
  checkProposalExists,
  checkProposalPassword,
  verifyProposalPassword,
  logProposalAccess,
  checkContractExists,
  checkContractPassword,
  verifyContractPassword,
  logContractAccess
} from './utils';

// Reports - specifically named exports
export {
  fetchReportByAnyId,
  fetchFromPublicReportsView,
  fetchReportWithRpc,
  fetchReportOnly,
  updateReportWithPassword
} from './reports';

// Invoices - specifically named exports
export {
  fetchInvoiceBySharedUrl
} from './invoices';

// Proposals - specifically named exports
export {
  fetchProposalBySharedUrl
} from './proposals';

// Contracts - specifically named exports
export {
  fetchContractBySharedUrl,
  updateContractWithSignature
} from './contracts';
