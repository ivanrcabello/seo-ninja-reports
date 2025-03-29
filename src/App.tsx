
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider";
import { ScrollToTop } from '@/components/ScrollToTop';
import { appRoutes } from '@/constants/routes';
import './App.css';
import SharedReport from './pages/SharedReport';
import NotFoundPage from './pages/NotFoundPage';

// Simple public layout component
const PublicLayout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        {children}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-react-theme">
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Shared content routes */}
          <Route 
            path={appRoutes.report} 
            element={<PublicLayout><SharedReport /></PublicLayout>} 
          />
          
          {/* Fallback route */}
          <Route 
            path="*" 
            element={<PublicLayout><NotFoundPage /></PublicLayout>} 
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
