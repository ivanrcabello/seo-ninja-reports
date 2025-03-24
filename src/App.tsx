
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import { ClientsProvider } from './hooks/useClients';
import { Toaster } from 'sonner';

// Lazy loading of components
const Auth = lazy(() => import('./pages/Auth'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ClientDetail = lazy(() => import('./pages/ClientDetail'));
const ReportDetail = lazy(() => import('./pages/ReportDetail'));
const Settings = lazy(() => import('./pages/Settings'));
const CrawlerDetailPage = lazy(() => import('./pages/CrawlerDetailPage'));

// Temporary AuthGuard component until the real one is available
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

// Temporary LoadingSpinner component until the real one is available
const LoadingSpinner = () => {
  return <div className="flex items-center justify-center h-screen">Loading...</div>;
};

function App() {
  return (
    <>
      <AuthProvider>
        <ClientsProvider>
          <Router>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Public routes */}
                <Route path="/auth" element={<Auth />} />
                
                {/* Protected routes */}
                <Route path="/" element={<AuthGuard><Navigate to="/dashboard" replace /></AuthGuard>} />
                <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
                <Route path="/clients/:id" element={<AuthGuard><ClientDetail /></AuthGuard>} />
                <Route path="/clients/:clientId/crawl/:crawlId" element={<AuthGuard><CrawlerDetailPage /></AuthGuard>} />
                <Route path="/clients/:clientId/reports/:id" element={<AuthGuard><ReportDetail /></AuthGuard>} />
                <Route path="/settings" element={<AuthGuard><Settings /></AuthGuard>} />

                {/* Default route - redirects to dashboard */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Suspense>
          </Router>
          <Toaster position="top-right" richColors closeButton />
        </ClientsProvider>
      </AuthProvider>
    </>
  );
}

export default App;
