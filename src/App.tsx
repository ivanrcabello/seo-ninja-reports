
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import { ClientsProvider } from './hooks/useClients';
import { ReportsProvider } from './hooks/useReports';
import { Toaster } from 'sonner';

// Import LoadingSpinner component directly instead of lazy loading it
const LoadingSpinner = () => {
  return <div className="flex items-center justify-center h-screen">Loading...</div>;
};

// Lazy loading of components with error boundaries
const Auth = lazy(() => import('./pages/Auth'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

// Use a more resilient approach for critical components
const ClientDetail = lazy(() => 
  import('./pages/ClientDetail')
    .catch(error => {
      console.error("Error loading ClientDetail component:", error);
      // Return a minimal module with a fallback component
      return {
        default: () => (
          <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-xl font-bold mb-4">Error loading client details</h1>
            <p className="mb-4">There was a problem loading this page.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              Reload page
            </button>
          </div>
        )
      };
    })
);

const ClientDetailWithErrorBoundary = (props: any) => {
  return (
    <ErrorBoundary fallback={<ClientErrorFallback />}>
      <ClientDetail {...props} />
    </ErrorBoundary>
  );
};

const ClientErrorFallback = () => (
  <div className="flex flex-col items-center justify-center h-screen">
    <h1 className="text-xl font-bold mb-4">Error loading client details</h1>
    <p className="mb-4">There was a problem displaying this client's information.</p>
    <button 
      onClick={() => window.location.href = '/dashboard'}
      className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
    >
      Return to dashboard
    </button>
  </div>
);

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Component error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Lazy load other components with error handling
const ReportDetail = lazy(() => 
  import('./pages/ReportDetail')
    .catch(error => {
      console.error("Error loading ReportDetail component:", error);
      return {
        default: () => (
          <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-xl font-bold mb-4">Error loading report details</h1>
            <p className="mb-4">There was a problem loading this page.</p>
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              Return to dashboard
            </button>
          </div>
        )
      };
    })
);

const CrawlerDetailPage = lazy(() => 
  import('./pages/CrawlerDetailPage')
    .catch(error => {
      console.error("Error loading CrawlerDetailPage component:", error);
      return {
        default: () => (
          <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-xl font-bold mb-4">Error loading crawler details</h1>
            <p className="mb-4">There was a problem loading this page.</p>
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              Return to dashboard
            </button>
          </div>
        )
      };
    })
);

// Temporary AuthGuard component until the real one is available
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

function App() {
  return (
    <>
      <AuthProvider>
        <ClientsProvider>
          <ReportsProvider>
            <Router>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/auth" element={<Auth />} />
                  
                  {/* Protected routes */}
                  <Route path="/" element={<AuthGuard><Navigate to="/dashboard" replace /></AuthGuard>} />
                  <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
                  <Route path="/clients/:id" element={<AuthGuard><ClientDetailWithErrorBoundary /></AuthGuard>} />
                  <Route path="/clients/:clientId/crawl/:crawlId" element={<AuthGuard><CrawlerDetailPage /></AuthGuard>} />
                  <Route path="/clients/:clientId/reports/:id" element={<AuthGuard><ReportDetail /></AuthGuard>} />
                  <Route path="/reports/:id" element={<AuthGuard><ReportDetail /></AuthGuard>} />
                  <Route path="/settings" element={<AuthGuard><Settings /></AuthGuard>} />

                  {/* Default route - redirects to dashboard */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Suspense>
            </Router>
            <Toaster position="top-right" richColors closeButton />
          </ReportsProvider>
        </ClientsProvider>
      </AuthProvider>
    </>
  );
}

export default App;
