
// Re-export functions from modules
import { 
  checkContentExists, 
  checkContentPasswordProtection, 
  verifyContentPassword,
  logContentAccess
} from './utils';

import { 
  fetchReportByAnyId,
  checkReportExists,
  checkReportPassword,
  verifyReportPassword,
  logReportAccess,
  updateReportWithPassword
} from './reports';

import { 
  fetchContractBySharedUrl,
  checkContractExists,
  updateContractWithSignature,
  logContractAccess
} from './contracts';

import {
  fetchInvoiceBySharedUrl,
  checkInvoiceExists,
  checkInvoicePassword,
  verifyInvoicePassword,
  logInvoiceAccess
} from './invoices';

import {
  fetchProposalBySharedUrl,
  checkProposalExists,
  checkProposalPassword,
  verifyProposalPassword,
  logProposalAccess
} from './proposals';

// Alias fetchReportByAnyId to fetchReportBySharedUrl for consistency
const fetchReportBySharedUrl = fetchReportByAnyId;

export {
  // Common utilities
  checkContentExists,
  checkContentPasswordProtection,
  verifyContentPassword,
  logContentAccess,
  
  // Reports
  fetchReportByAnyId,
  fetchReportBySharedUrl,
  checkReportExists,
  checkReportPassword,
  verifyReportPassword,
  logReportAccess,
  updateReportWithPassword,
  
  // Contracts
  fetchContractBySharedUrl,
  checkContractExists,
  updateContractWithSignature,
  logContractAccess,
  
  // Invoices
  fetchInvoiceBySharedUrl,
  checkInvoiceExists,
  checkInvoicePassword,
  verifyInvoicePassword,
  logInvoiceAccess,
  
  // Proposals
  fetchProposalBySharedUrl,
  checkProposalExists,
  checkProposalPassword,
  verifyProposalPassword,
  logProposalAccess
};
