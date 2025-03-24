
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
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
        <Router>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Public routes */}
              <Route path="/auth" element={<Auth />} />
              
              {/* Protected routes */}
              <Route element={<AuthGuard />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/clients/:id" element={<ClientDetail />} />
                <Route path="/clients/:clientId/crawl/:crawlId" element={<CrawlerDetailPage />} />
                <Route path="/clients/:clientId/reports/:id" element={<ReportDetail />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              {/* Default route - redirects to dashboard */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </Router>
        <Toaster position="top-right" richColors closeButton />
      </AuthProvider>
    </>
  );
}

export default App;
