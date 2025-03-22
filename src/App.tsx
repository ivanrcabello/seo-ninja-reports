import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from 'sonner';

import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import AllReports from './pages/AllReports';
import Activity from './pages/Activity';
import Settings from './pages/Settings';
import ClientDetail from './pages/ClientDetail';
import ReportDetail from './pages/ReportDetail';
import PublicReport from './pages/PublicReport';
import SharedProposal from './pages/SharedProposal';
import Contacto from './pages/Contacto';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Caracteristicas from './pages/Caracteristicas';
import Precios from './pages/Precios';
import Paquetes from './pages/Paquetes';
import PackStarter from './pages/PackStarter';
import PackMaster from './pages/PackMaster';
import PackAscenso from './pages/PackAscenso';
import Documentacion from './pages/Documentacion';
import Servicios from './pages/Servicios';
import SeoLocal from './pages/Servicios/SeoLocal';
import SeoTecnico from './pages/Servicios/SeoTecnico';
import ContenidoSeo from './pages/Servicios/ContenidoSeo';
import SeoIA from './pages/Servicios/SeoIA';
import Guias from './pages/Guias';
import Privacidad from './pages/Privacidad';
import NotFoundPage from './pages/NotFoundPage';
import BlogAdmin from './pages/BlogAdmin';
import AnimationContext from './context/AnimationContext';
import AuthProvider from './context/AuthContext';
import { ClientsProvider } from './hooks/useClients';
import SharedContract from './pages/SharedContract';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AnimationContext>
        <AuthProvider>
          <ClientsProvider>
            <BrowserRouter>
              <ThemeProvider defaultTheme="system" storageKey="ui-theme">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/all-reports" element={<AllReports />} />
                  <Route path="/activity" element={<Activity />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/clients/:id" element={<ClientDetail />} />
                  <Route path="/reports/:id" element={<ReportDetail />} />
                  <Route path="/shared/reports/:id" element={<PublicReport />} />
                  <Route path="/shared/proposals/:id" element={<SharedProposal />} />
                  <Route path="/shared/contracts/:id" element={<SharedContract />} />
                  <Route path="/contacto" element={<Contacto />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogDetail />} />
                  <Route path="/caracteristicas" element={<Caracteristicas />} />
                  <Route path="/precios" element={<Precios />} />
                  <Route path="/paquetes" element={<Paquetes />} />
                  <Route path="/paquetes/starter" element={<PackStarter />} />
                  <Route path="/paquetes/master" element={<PackMaster />} />
                  <Route path="/paquetes/ascenso" element={<PackAscenso />} />
                  <Route path="/documentacion" element={<Documentacion />} />
                  <Route path="/servicios" element={<Servicios />} />
                  <Route path="/servicios/seo-local" element={<SeoLocal />} />
                  <Route path="/servicios/seo-tecnico" element={<SeoTecnico />} />
                  <Route path="/servicios/contenido-seo" element={<ContenidoSeo />} />
                  <Route path="/servicios/seo-ia" element={<SeoIA />} />
                  <Route path="/guias" element={<Guias />} />
                  <Route path="/privacidad" element={<Privacidad />} />
                  <Route path="/blog-admin" element={<BlogAdmin />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
                <Toaster />
              </ThemeProvider>
            </BrowserRouter>
          </ClientsProvider>
        </AuthProvider>
      </AnimationContext>
    </QueryClientProvider>
  );
}

export default App;
