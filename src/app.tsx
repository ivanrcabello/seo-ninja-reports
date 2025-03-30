import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import ClientDetail from './pages/ClientDetail';
import ReportDetail from './pages/ReportDetail';
import Settings from './pages/Settings';
import { AuthProvider } from './context/AuthContext';
import { ClientsProvider } from './hooks/useClients';
import { ReportsProvider } from './hooks/useReports';
import PublicReport from './pages/PublicReport';

const App = () => {
  return (
    <AuthProvider>
      <ClientsProvider>
        <ReportsProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/:id" element={<ClientDetail />} />
            <Route path="/clients/:clientId/reports/:id" element={<ReportDetail />} />
            <Route path="/clients/:clientId/crawls/:crawlId" element={<ReportDetail />} />
            <Route path="/settings" element={<Settings />} />
            
            {/* Add public report route */}
            <Route path="/shared/reports/:reportId" element={<PublicReport />} />
          </Routes>
        </ReportsProvider>
      </ClientsProvider>
    </AuthProvider>
  );
};

export default App;
