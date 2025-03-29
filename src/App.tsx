import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider"
import { ScrollToTop } from '@/components/ScrollToTop';
import { useUser } from '@clerk/clerk-react';
import { appRoutes } from './constants/routes';
import { cn } from "@/lib/utils"
import './App.css';

// Import components
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import ClientDetail from './pages/ClientDetail';
import Reports from './pages/Reports';
import ReportDetail from './pages/ReportDetail';
import Invoices from './pages/Invoices';
import InvoiceDetail from './pages/InvoiceDetail';
import Contracts from './pages/Contracts';
import ContractDetail from './pages/ContractDetail';
import Proposals from './pages/Proposals';
import ProposalDetail from './pages/ProposalDetail';
import Settings from './pages/Settings';
import NotFoundPage from './pages/NotFoundPage';
import PricingPage from './pages/PricingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PublicInvoice from './pages/PublicInvoice';
import PublicContract from './pages/PublicContract';
import SharedProposal from './pages/SharedProposal';
import PublicLayout from './layouts/PublicLayout';
import SharedReport from './pages/SharedReport';

// Import layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

const App = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-react-theme">
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path={appRoutes.pricing} element={<PublicLayout><PricingPage /></PublicLayout>} />
          <Route path={appRoutes.login} element={<AuthLayout><LoginPage /></AuthLayout>} />
          <Route path={appRoutes.register} element={<AuthLayout><RegisterPage /></AuthLayout>} />
          <Route path={appRoutes.invoice} element={<PublicLayout><PublicInvoice /></PublicLayout>} />
          <Route path={appRoutes.contract} element={<PublicLayout><PublicContract /></PublicLayout>} />
          <Route path={appRoutes.proposal} element={<PublicLayout><SharedProposal /></PublicLayout>} />

          {/* Main App Routes */}
          <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
          <Route path="/clients" element={<MainLayout><Clients /></MainLayout>} />
          <Route path="/clients/:id" element={<MainLayout><ClientDetail /></MainLayout>} />
          <Route path="/reports" element={<MainLayout><Reports /></MainLayout>} />
          <Route path="/reports/:id" element={<MainLayout><ReportDetail /></MainLayout>} />
          <Route path="/invoices" element={<MainLayout><Invoices /></MainLayout>} />
          <Route path="/invoices/:id" element={<MainLayout><InvoiceDetail /></MainLayout>} />
          <Route path="/contracts" element={<MainLayout><Contracts /></MainLayout>} />
          <Route path="/contracts/:id" element={<MainLayout><ContractDetail /></MainLayout>} />
          <Route path="/proposals" element={<MainLayout><Proposals /></MainLayout>} />
          <Route path="/proposals/:id" element={<MainLayout><ProposalDetail /></MainLayout>} />
          <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />

          {/* Shared Report Route */}
          <Route path="/shared/reports/:reportId" element={<PublicLayout><SharedReport /></PublicLayout>} />

          {/* Not Found Route */}
          <Route path="*" element={<PublicLayout><NotFoundPage /></PublicLayout>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
