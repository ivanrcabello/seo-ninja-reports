
/**
 * Application routes definitions
 */
export const appRoutes = {
  // Public routes
  login: '/login',
  register: '/register',
  pricing: '/pricing',
  
  // Shared content routes
  proposal: '/shared/proposal/:proposalId',
  invoice: '/shared/invoice/:invoiceId',
  contract: '/shared/contract/:contractId',
  report: '/shared/reports/:reportId',
  
  // Dashboard routes
  dashboard: '/',
  clients: '/clients',
  clientDetail: '/clients/:id',
  reports: '/reports',
  reportDetail: '/reports/:id',
  invoices: '/invoices',
  invoiceDetail: '/invoices/:id',
  contracts: '/contracts',
  contractDetail: '/contracts/:id',
  proposals: '/proposals',
  proposalDetail: '/proposals/:id',
  settings: '/settings'
};
