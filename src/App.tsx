
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import PersistentStateProvider from './context/PersistentStateContext';
import { ReportsProvider } from './context/ReportsContext';
import { ClientsProvider } from './context/ClientsContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'sonner';
import AuthGuard from './components/auth/AuthGuard';
import LoadingSpinner from './components/common/LoadingSpinner';

// Importación lazy de componentes
const Auth = lazy(() => import('./pages/Auth'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ClientList = lazy(() => import('./pages/ClientList'));
const ClientDetail = lazy(() => import('./pages/ClientDetail'));
const ReportDetail = lazy(() => import('./pages/ReportDetail'));
const ContractDetail = lazy(() => import('./pages/ContractDetail'));
const ProposalDetail = lazy(() => import('./pages/ProposalDetail'));
const InvoiceDetail = lazy(() => import('./pages/InvoiceDetail'));
const Settings = lazy(() => import('./pages/Settings'));
const PublicContract = lazy(() => import('./pages/public/PublicContract'));
const PublicInvoice = lazy(() => import('./pages/public/PublicInvoice'));
const PublicProposal = lazy(() => import('./pages/public/PublicProposal'));
const PublicReport = lazy(() => import('./pages/public/PublicReport'));
const CrawlerDetailPage = lazy(() => import('./pages/CrawlerDetailPage'));

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <AuthProvider>
        <PersistentStateProvider>
          <ClientsProvider>
            <ReportsProvider>
              <Router>
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    {/* Rutas públicas */}
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/public/contract/:sharedUrl" element={<PublicContract />} />
                    <Route path="/public/invoice/:sharedUrl" element={<PublicInvoice />} />
                    <Route path="/public/proposal/:sharedUrl" element={<PublicProposal />} />
                    <Route path="/public/report/:sharedUrl" element={<PublicReport />} />

                    {/* Rutas protegidas */}
                    <Route element={<AuthGuard />}>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/clients" element={<ClientList />} />
                      <Route path="/clients/:id" element={<ClientDetail />} />
                      <Route path="/clients/:clientId/crawl/:crawlId" element={<CrawlerDetailPage />} />
                      <Route path="/clients/:clientId/reports/:id" element={<ReportDetail />} />
                      <Route path="/clients/:clientId/crawl/:crawlId" element={<CrawlerDetailPage />} />
                      <Route path="/clients/:clientId/contracts/:id" element={<ContractDetail />} />
                      <Route path="/clients/:clientId/proposals/:id" element={<ProposalDetail />} />
                      <Route path="/clients/:clientId/invoices/:id" element={<InvoiceDetail />} />
                      <Route path="/settings" element={<Settings />} />
                    </Route>

                    {/* Ruta por defecto - redirige al dashboard */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </Suspense>
              </Router>
              <Toaster position="top-right" richColors closeButton />
            </ReportsProvider>
          </ClientsProvider>
        </PersistentStateProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
