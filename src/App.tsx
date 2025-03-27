import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import { ClientsProvider } from './hooks/useClients';
import { ReportsProvider } from './hooks/useReports.tsx';
import { Toaster } from 'sonner';

const LoadingSpinner = () => {
  return <div className="flex items-center justify-center h-screen">Loading...</div>;
};

const Auth = lazy(() => import('./pages/Auth'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

const ClientDetail = lazy(() => 
  import('./pages/ClientDetail')
    .catch(error => {
      console.error("Error loading ClientDetail component:", error);
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
                  <Route path="/auth" element={<Auth />} />
                  
                  <Route path="/" element={<AuthGuard><Navigate to="/dashboard" replace /></AuthGuard>} />
                  <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
                  <Route path="/clients/:id" element={<AuthGuard><ClientDetailWithErrorBoundary /></AuthGuard>} />
                  <Route path="/clients/:clientId/crawl/:crawlId" element={<AuthGuard><CrawlerDetailPage /></AuthGuard>} />
                  <Route path="/clients/:clientId/reports/:id" element={<AuthGuard><ReportDetail /></AuthGuard>} />
                  <Route path="/reports/:id" element={<AuthGuard><ReportDetail /></AuthGuard>} />
                  <Route path="/settings" element={<AuthGuard><Settings /></AuthGuard>} />

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
