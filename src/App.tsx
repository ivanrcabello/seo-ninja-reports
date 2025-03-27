
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/context/AuthContext';
import { ClientsProvider } from '@/hooks/useClients';
import { ReportsProvider } from '@/hooks/useReports';
import { ReportGeneratorProvider } from '@/context/ReportGeneratorContext';
import { ThemeProvider } from '@/context/ThemeContext';
import ProtectedRoute from '@/routes/ProtectedRoute';

// Pages
import DashboardPage from '@/pages/DashboardPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ClientsPage from '@/pages/ClientsPage';
import ClientDetailPage from '@/pages/ClientDetailPage';
import ProfilePage from '@/pages/ProfilePage';
import SettingsPage from '@/pages/SettingsPage';
import NotFoundPage from '@/pages/NotFoundPage';
import ReportsPage from '@/pages/ReportsPage';
import ReportPage from '@/pages/ReportPage';
import ProposalsPage from '@/pages/ProposalsPage';
import ProposalDetailPage from '@/pages/ProposalDetailPage';
import ContractsPage from '@/pages/ContractsPage';
import ContractDetailPage from '@/pages/ContractDetailPage';
import InvoicesPage from '@/pages/InvoicesPage';
import InvoiceDetailPage from '@/pages/InvoiceDetailPage';
import PublicReportPage from '@/pages/PublicReportPage';
import PublicProposalPage from '@/pages/PublicProposalPage';
import PublicContractPage from '@/pages/PublicContractPage';
import PublicInvoicePage from '@/pages/PublicInvoicePage';
import BlogPage from '@/pages/BlogPage';
import CrawlerDetailPage from '@/pages/CrawlerDetailPage';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <ClientsProvider>
          <ReportsProvider>
            <ReportGeneratorProvider>
              <BrowserRouter>
                <Routes>
                  {/* Auth routes */}
                  <Route path="/auth" element={<LoginPage />} />
                  <Route path="/auth/register" element={<RegisterPage />} />
                  
                  {/* Protected routes */}
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/clients" 
                    element={
                      <ProtectedRoute>
                        <ClientsPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/clients/:id" 
                    element={
                      <ProtectedRoute>
                        <ClientDetailPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/clients/:clientId/seo/:crawlId" 
                    element={
                      <ProtectedRoute>
                        <CrawlerDetailPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/reports" 
                    element={
                      <ProtectedRoute>
                        <ReportsPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/reports/:id" 
                    element={
                      <ProtectedRoute>
                        <ReportPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/proposals" 
                    element={
                      <ProtectedRoute>
                        <ProposalsPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/proposals/:id" 
                    element={
                      <ProtectedRoute>
                        <ProposalDetailPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/contracts" 
                    element={
                      <ProtectedRoute>
                        <ContractsPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/contracts/:id" 
                    element={
                      <ProtectedRoute>
                        <ContractDetailPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/invoices" 
                    element={
                      <ProtectedRoute>
                        <InvoicesPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/invoices/:id" 
                    element={
                      <ProtectedRoute>
                        <InvoiceDetailPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/settings" 
                    element={
                      <ProtectedRoute>
                        <SettingsPage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Public routes */}
                  <Route path="/p/r/:id" element={<PublicReportPage />} />
                  <Route path="/p/p/:id" element={<PublicProposalPage />} />
                  <Route path="/p/c/:id" element={<PublicContractPage />} />
                  <Route path="/p/i/:id" element={<PublicInvoicePage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  
                  {/* Default route */}
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  
                  {/* Not found */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
                
                <Toaster position="top-right" richColors />
              </BrowserRouter>
            </ReportGeneratorProvider>
          </ReportsProvider>
        </ClientsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
