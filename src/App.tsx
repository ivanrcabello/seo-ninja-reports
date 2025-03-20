
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ClientsProvider } from "@/hooks/useClients";
import { ReportsProvider } from "@/hooks/useReports";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ClientDetail from "./pages/ClientDetail";
import ReportDetail from "./pages/ReportDetail";
import PublicReport from "./pages/PublicReport";
import AllReports from "./pages/AllReports";
import Activity from "./pages/Activity";
import NotFound from "./pages/NotFound";
import Settings from '@/pages/Settings';
import Servicios from './pages/Servicios';
import Paquetes from './pages/Paquetes';
import PackStarter from './pages/packs/PackStarter';
import PackAscenso from './pages/packs/PackAscenso';
import PackMaster from './pages/packs/PackMaster';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import BlogAdmin from './pages/BlogAdmin';
import Documentacion from './pages/Documentacion';
import Caracteristicas from './pages/Caracteristicas';
import Precios from './pages/Precios';
import Guias from './pages/Guias';
import Contacto from './pages/Contacto';
import Privacidad from './pages/Privacidad';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ClientsProvider>
        <ReportsProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/clients/:id" element={<ClientDetail />} />
                <Route path="/reports" element={<AllReports />} />
                <Route path="/reports/:id" element={<ReportDetail />} />
                <Route path="/shared/reports/:id" element={<PublicReport />} />
                <Route path="/activity" element={<Activity />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/servicios" element={<Servicios />} />
                <Route path="/paquetes" element={<Paquetes />} />
                <Route path="/paquetes/starter" element={<PackStarter />} />
                <Route path="/paquetes/ascenso" element={<PackAscenso />} />
                <Route path="/paquetes/master" element={<PackMaster />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/blog-admin" element={<BlogAdmin />} />
                <Route path="/documentacion" element={<Documentacion />} />
                <Route path="/caracteristicas" element={<Caracteristicas />} />
                <Route path="/precios" element={<Precios />} />
                <Route path="/guias" element={<Guias />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/privacidad" element={<Privacidad />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ReportsProvider>
      </ClientsProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
