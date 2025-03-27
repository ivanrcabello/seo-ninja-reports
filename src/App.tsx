
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/context/AuthContext';
import { ClientsProvider } from '@/hooks/useClients';
import { ReportGeneratorProvider } from '@/context/ReportGeneratorContext';
import { ThemeProvider } from '@/context/ThemeContext';
import ProtectedRoute from '@/routes/ProtectedRoute';
import Layout from '@/components/layout/Layout';
import NotFoundPage from '@/pages/NotFoundPage';
import CrawlerDetailPage from '@/pages/CrawlerDetailPage';

// We're using a simplification here - in a real app, these would be separate page components
const DummyPage = ({ title }) => (
  <Layout>
    <div className="container mx-auto px-4 pt-24 pb-16">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <p>This is a placeholder page for {title}.</p>
    </div>
  </Layout>
);

const LoginPage = () => <DummyPage title="Login" />;
const RegisterPage = () => <DummyPage title="Register" />;
const DashboardPage = () => <DummyPage title="Dashboard" />;
const ClientsPage = () => <DummyPage title="Clients" />;
const ClientDetailPage = () => <DummyPage title="Client Detail" />;
const ProfilePage = () => <DummyPage title="Profile" />;
const SettingsPage = () => <DummyPage title="Settings" />;
const ReportsPage = () => <DummyPage title="Reports" />;
const ReportPage = () => <DummyPage title="Report" />;
const ProposalsPage = () => <DummyPage title="Proposals" />;
const ProposalDetailPage = () => <DummyPage title="Proposal Detail" />;
const ContractsPage = () => <DummyPage title="Contracts" />;
const ContractDetailPage = () => <DummyPage title="Contract Detail" />;
const InvoicesPage = () => <DummyPage title="Invoices" />;
const InvoiceDetailPage = () => <DummyPage title="Invoice Detail" />;
const PublicReportPage = () => <DummyPage title="Public Report" />;
const PublicProposalPage = () => <DummyPage title="Public Proposal" />;
const PublicContractPage = () => <DummyPage title="Public Contract" />;
const PublicInvoicePage = () => <DummyPage title="Public Invoice" />;
const BlogPage = () => <DummyPage title="Blog" />;

// Import the ReportsProvider
import { ReportsProvider } from '@/hooks/useReports';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <AuthProvider>
          <ClientsProvider>
            <ReportsProvider>
              <ReportGeneratorProvider>
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
              </ReportGeneratorProvider>
            </ReportsProvider>
          </ClientsProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
