
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import { ClientsProvider } from './hooks/useClients';
import { ReportsProvider } from './hooks/useReports.tsx';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const LoadingSpinner = () => {
  return <div className="flex items-center justify-center h-screen">Loading...</div>;
};

const Auth = lazy(() => import('./pages/Auth'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));
const Index = lazy(() => import('./pages/Index'));

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

const SharedInvoice = lazy(() => 
  import('./pages/SharedInvoice')
    .catch(error => {
      console.error("Error loading SharedInvoice component:", error);
      return {
        default: () => (
          <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-xl font-bold mb-4">Error loading shared invoice</h1>
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

const SharedProposal = lazy(() => 
  import('./pages/SharedProposal')
    .catch(error => {
      console.error("Error loading SharedProposal component:", error);
      return {
        default: () => (
          <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-xl font-bold mb-4">Error loading shared proposal</h1>
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

const SharedContract = lazy(() => 
  import('./pages/SharedContract')
    .catch(error => {
      console.error("Error loading SharedContract component:", error);
      return {
        default: () => (
          <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-xl font-bold mb-4">Error loading shared contract</h1>
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

const PublicReport = lazy(() => 
  import('./pages/PublicReport')
    .catch(error => {
      console.error("Error loading PublicReport component:", error);
      return {
        default: () => (
          <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-xl font-bold mb-4">Error loading public report</h1>
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

const ClientPortal = lazy(() => import('./pages/ClientPortal'));
const ClientPortalDashboard = lazy(() => import('./pages/ClientPortalDashboard'));

function App() {
  // Create a new QueryClient instance inside the component
  const queryClient = new QueryClient();

  return (
    <>
      <AuthProvider>
        <ClientsProvider>
          <ReportsProvider>
            <QueryClientProvider client={queryClient}>
              <Router>
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    {/* Rutas públicas */}
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/shared/invoices/:sharedUrl" element={<SharedInvoice />} />
                    <Route path="/shared/proposals/:sharedUrl" element={<SharedProposal />} />
                    <Route path="/shared/contracts/:sharedUrl" element={<SharedContract />} />
                    <Route path="/shared/reports/:id" element={<PublicReport />} />
                    
                    {/* Portal de clientes */}
                    <Route path="/portal" element={<ClientPortal />} />
                    <Route path="/portal/dashboard" element={<ClientPortalDashboard />} />
                    
                    {/* Rutas de administración (protegidas) */}
                    <Route path="/admin" element={<AuthGuard><Navigate to="/dashboard" replace /></AuthGuard>} />
                    <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
                    <Route path="/clients/:id" element={<AuthGuard><ClientDetailWithErrorBoundary /></AuthGuard>} />
                    <Route path="/clients/:clientId/crawl/:crawlId" element={<AuthGuard><CrawlerDetailPage /></AuthGuard>} />
                    <Route path="/clients/:clientId/reports/:id" element={<AuthGuard><ReportDetail /></AuthGuard>} />
                    <Route path="/reports/:id" element={<AuthGuard><ReportDetail /></AuthGuard>} />
                    <Route path="/settings" element={<AuthGuard><Settings /></AuthGuard>} />

                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </Router>
              <Toaster position="top-right" richColors closeButton />
            </QueryClientProvider>
          </ReportsProvider>
        </ClientsProvider>
      </AuthProvider>
    </>
  );
}

export default App;
