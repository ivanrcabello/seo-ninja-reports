import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import { ClientsProvider } from './hooks/useClients';
import { ReportsProvider } from './hooks/useReports.tsx';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthGuard from './components/auth/AuthGuard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  );
};

const Auth = lazy(() => import('./pages/Auth'));
const Index = lazy(() => import('./pages/Index'));
const Settings = lazy(() => import('./pages/Settings'));

const Servicios = lazy(() => import('./pages/Servicios'));
const Paquetes = lazy(() => import('./pages/Paquetes'));
const Contacto = lazy(() => import('./pages/Contacto'));
const Blog = lazy(() => import('./pages/Blog'));
const Precios = lazy(() => import('./pages/Precios'));
const Caracteristicas = lazy(() => import('./pages/Caracteristicas'));
const Guias = lazy(() => import('./pages/Guias'));
const Documentacion = lazy(() => import('./pages/Documentacion'));
const Recursos = lazy(() => import('./pages/Recursos'));
const Privacidad = lazy(() => import('./pages/Privacidad'));
const Cookies = lazy(() => import('./pages/Cookies'));
const Terminos = lazy(() => import('./pages/Terminos'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const SeoLocal = lazy(() => import('./pages/servicios/SeoLocal'));
const SeoTecnico = lazy(() => import('./pages/servicios/SeoTecnico'));
const SeoIA = lazy(() => import('./pages/servicios/SeoIA'));
const ContenidoSeo = lazy(() => import('./pages/servicios/ContenidoSeo'));
const SeoCompetencia = lazy(() => import('./pages/servicios/SeoCompetencia'));
const GoogleBusiness = lazy(() => import('./pages/servicios/GoogleBusiness'));
const Resenas = lazy(() => import('./pages/servicios/Resenas'));

const PackStarter = lazy(() => import('./pages/packs/PackStarter'));
const PackAscenso = lazy(() => import('./pages/packs/PackAscenso'));
const PackMaster = lazy(() => import('./pages/packs/PackMaster'));

const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const BlogAdmin = lazy(() => import('./pages/BlogAdmin'));

const Dashboard = lazy(() => 
  import('./pages/Dashboard')
    .catch(error => {
      console.error("Error loading Dashboard component:", error);
      return {
        default: () => (
          <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-xl font-bold mb-4">Error loading dashboard</h1>
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

const ClientDetail = lazy(() => import('./pages/ClientDetail').catch(() => ({ default: () => <div>Error loading client details</div> })));
const ReportDetail = lazy(() => import('./pages/ReportDetail').catch(() => ({ default: () => <div>Error loading report details</div> })));
const CrawlerDetailPage = lazy(() => import('./pages/CrawlerDetailPage').catch(() => ({ default: () => <div>Error loading crawler details</div> })));
const SharedInvoice = lazy(() => import('./pages/SharedInvoice').catch(() => ({ default: () => <div>Error loading shared invoice</div> })));
const SharedProposal = lazy(() => import('./pages/SharedProposal').catch(() => ({ default: () => <div>Error loading shared proposal</div> })));
const SharedContract = lazy(() => import('./pages/SharedContract').catch(() => ({ default: () => <div>Error loading shared contract</div> })));
const PublicReport = lazy(() => import('./pages/PublicReport').catch(() => ({ default: () => <div>Error loading public report</div> })));
const ClientPortal = lazy(() => import('./pages/ClientPortal'));
const ClientPortalDashboard = lazy(() => import('./pages/ClientPortalDashboard'));
const NewClientPage = lazy(() => import('./pages/NewClientPage'));

function App() {
  return (
    <AuthProvider>
      <ClientsProvider>
        <ReportsProvider>
          <QueryClientProvider client={queryClient}>
            <Router>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />

                  <Route path="/servicios" element={<Servicios />} />
                  <Route path="/servicios/seo-local" element={<SeoLocal />} />
                  <Route path="/servicios/seo-tecnico" element={<SeoTecnico />} />
                  <Route path="/servicios/seo-ia" element={<SeoIA />} />
                  <Route path="/servicios/contenido-seo" element={<ContenidoSeo />} />
                  <Route path="/servicios/seo-competencia" element={<SeoCompetencia />} />
                  <Route path="/servicios/google-business" element={<GoogleBusiness />} />
                  <Route path="/servicios/resenas" element={<Resenas />} />
                  <Route path="/paquetes" element={<Paquetes />} />
                  <Route path="/paquetes/starter" element={<PackStarter />} />
                  <Route path="/paquetes/ascenso" element={<PackAscenso />} />
                  <Route path="/paquetes/master" element={<PackMaster />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogDetail />} />
                  <Route path="/caracteristicas" element={<Caracteristicas />} />
                  <Route path="/precios" element={<Precios />} />
                  <Route path="/guias" element={<Guias />} />
                  <Route path="/documentacion" element={<Documentacion />} />
                  <Route path="/recursos" element={<Recursos />} />
                  <Route path="/contacto" element={<Contacto />} />
                  <Route path="/privacidad" element={<Privacidad />} />
                  <Route path="/cookies" element={<Cookies />} />
                  <Route path="/terminos" element={<Terminos />} />
                  
                  <Route path="/shared/invoices/:sharedUrl" element={<SharedInvoice />} />
                  <Route path="/shared/proposals/:sharedUrl" element={<SharedProposal />} />
                  <Route path="/shared/contracts/:sharedUrl" element={<SharedContract />} />
                  <Route path="/shared/reports/:id" element={<PublicReport />} />
                  <Route path="/portal" element={<ClientPortal />} />
                  <Route path="/portal/dashboard" element={<ClientPortalDashboard />} />
                  
                  <Route path="/admin" element={<AuthGuard><Navigate to="/dashboard" replace /></AuthGuard>} />
                  
                  <Route path="/dashboard" element={
                    <ErrorBoundary fallback={<div>Dashboard error</div>}>
                      <AuthGuard><Dashboard /></AuthGuard>
                    </ErrorBoundary>
                  } />
                  
                  <Route path="/clients/new" element={<AuthGuard><NewClientPage /></AuthGuard>} />
                  <Route path="/clients/:id" element={<AuthGuard><ClientDetail /></AuthGuard>} />
                  <Route path="/clients/:clientId/crawler/:crawlId" element={<AuthGuard><CrawlerDetailPage /></AuthGuard>} />
                  <Route path="/clients/:clientId/crawl/:crawlId" element={<AuthGuard><CrawlerDetailPage /></AuthGuard>} />
                  <Route path="/clients/:clientId/reports/:id" element={<AuthGuard><ReportDetail /></AuthGuard>} />
                  <Route path="/reports/:id" element={<AuthGuard><ReportDetail /></AuthGuard>} />
                  <Route path="/admin/blog" element={<AuthGuard><BlogAdmin /></AuthGuard>} />
                  <Route path="/settings" element={<AuthGuard><Settings /></AuthGuard>} />

                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </Router>
            <Toaster position="top-right" richColors closeButton />
          </QueryClientProvider>
        </ReportsProvider>
      </ClientsProvider>
    </AuthProvider>
  );
}

export default App;
