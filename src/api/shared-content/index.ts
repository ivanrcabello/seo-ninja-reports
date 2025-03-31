
// Re-exportar funciones comunes
export { 
  checkContentExists,
  checkContentPasswordProtection,
  verifyContentPassword,
  logContentAccess
} from './utils';

// Re-exportar funciones de informes
export {
  fetchReportBySharedUrl,
  fetchReportByAnyId,
  checkReportExists,
  checkReportPassword,
  verifyReportPassword,
  logReportAccess,
  updateReportWithPassword
} from './reports';

// Re-exportar funciones de contratos
export {
  fetchContractBySharedUrl,
  checkContractExists,
  updateContractWithSignature,
  logContractAccess
} from './contracts';

// Re-exportar funciones de facturas
export {
  fetchInvoiceBySharedUrl,
  checkInvoiceExists,
  checkInvoicePassword,
  verifyInvoicePassword,
  logInvoiceAccess
} from './invoices';

// Re-exportar funciones de propuestas
export {
  fetchProposalBySharedUrl,
  checkProposalExists,
  checkProposalPassword,
  verifyProposalPassword,
  logProposalAccess
} from './proposals';
