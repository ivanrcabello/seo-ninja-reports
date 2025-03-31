
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

// Re-export type-specific helpers with explicit names to avoid ambiguity
export { 
  checkContentExists as checkReportExists,
  checkContentPasswordProtection as checkReportPassword,
  verifyContentPassword as verifyReportPassword,
  logContentAccess as logReportAccess
} from './utils';

export { 
  checkContentExists as checkInvoiceExists,
  checkContentPasswordProtection as checkInvoicePassword,
  verifyContentPassword as verifyInvoicePassword,
  logContentAccess as logInvoiceAccess
} from './utils';

export { 
  checkContentExists as checkProposalExists,
  checkContentPasswordProtection as checkProposalPassword,
  verifyContentPassword as verifyProposalPassword,
  logContentAccess as logProposalAccess
} from './utils';

export { 
  checkContentExists as checkContractExists,
  checkContentPasswordProtection as checkContractPassword,
  verifyContentPassword as verifyContractPassword,
  logContentAccess as logContractAccess
} from './utils';

// Reports - specifically named exports
export {
  fetchReportByAnyId,
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
