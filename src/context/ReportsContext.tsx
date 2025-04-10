
import React, { createContext, useContext, ReactNode } from 'react';
import useReportsHook from '@/hooks/useReports';

// Create a context for reports with a default value to avoid undefined errors
const defaultReportsContextValue = {
  reports: [],
  isLoading: true,
  error: null,
  getReport: () => undefined,
  getClientReports: () => [],
  generateReport: async () => {
    throw new Error('ReportsContext not initialized');
  },
  createReport: async () => {
    throw new Error('ReportsContext not initialized');
  },
  updateReport: async () => {
    throw new Error('ReportsContext not initialized');
  },
  deleteReport: async () => {
    throw new Error('ReportsContext not initialized');
  },
  retryReport: async () => false,
};

// Create a context for reports
const ReportsContext = createContext(defaultReportsContextValue);

// Context provider component
export const ReportsProvider = ({ children }: { children: ReactNode }) => {
  const reportsData = useReportsHook();
  
  return (
    <ReportsContext.Provider value={reportsData}>
      {children}
    </ReportsContext.Provider>
  );
};

// Hook to use the reports context
export const useReportsContext = () => {
  const context = useContext(ReportsContext);
  
  if (context === undefined) {
    console.error('useReportsContext must be used within a ReportsProvider');
    // Return default context instead of undefined to prevent crashes
    return defaultReportsContextValue;
  }
  
  return context;
};
