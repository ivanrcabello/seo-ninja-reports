
// Main API for shared content (contracts, reports, proposals, invoices)
export { 
  // Contract functions
  checkContractExists,
  checkContractPassword,
  verifyContractPassword,
  fetchContractBySharedUrl,
  updateContractSignature,
  logContractAccess
} from './contracts';

export {
  // Report functions
  checkReportExists,
  checkReportPassword,
  verifyReportPassword,
  fetchReportByAnyId,
  logReportAccess
} from './reports';

export {
  // Proposal functions
  checkProposalExists,
  checkProposalPassword,
  verifyProposalPassword,
  fetchProposalBySharedUrl,
  logProposalAccess
} from './proposals';

export {
  // Invoice functions
  checkInvoiceExists,
  checkInvoicePassword,
  verifyInvoicePassword,
  fetchInvoiceBySharedUrl,
  logInvoiceAccess
} from './invoices';

// Common utility functions
export {
  checkContentExists,
  checkContentPasswordProtection,
  verifyContentPassword,
  logContentAccess
} from './utils';
