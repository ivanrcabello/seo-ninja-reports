
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import PublicReport from './pages/PublicReport';
import SharedContract from './pages/SharedContract';
import SharedInvoice from './pages/SharedInvoice';
import SharedProposal from './pages/SharedProposal';
import PrintableReportView from './components/public-reports/PrintableReportView';

// Importar otros componentes según sea necesario

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      // ... mantener rutas existentes
    ]
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  // Rutas para contenido compartido
  {
    path: "/shared/reports/:reportId",
    element: <PublicReport />
  },
  {
    path: "/shared/reports/:reportId/print",
    element: <PrintableReportView />
  },
  {
    path: "/shared/contracts/:contractId",
    element: <SharedContract />
  },
  {
    path: "/shared/proposals/:proposalId",
    element: <SharedProposal />
  },
  {
    path: "/shared/invoices/:invoiceId",
    element: <SharedInvoice />
  },
  // Ruta para errores 404
  {
    path: "*",
    element: <NotFoundPage />
  }
]);

export default router;
