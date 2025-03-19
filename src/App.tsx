
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
import AllReports from "./pages/AllReports";
import NotFound from "./pages/NotFound";
import Settings from '@/pages/Settings';

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
                <Route path="/settings" element={<Settings />} />
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
