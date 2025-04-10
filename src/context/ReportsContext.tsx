
import React, { createContext, useContext, ReactNode } from 'react';
import useReportsHook from '@/hooks/useReports.ts';
import { Report } from '@/types/report.types';
import { Keyword, ReportsHookReturn } from '@/types/report-hooks.types';

// Create a context for reports with a default value to avoid undefined errors
const defaultReportsContextValue: ReportsHookReturn = {
  reports: [],
  isLoading: true,
  error: null,
  getReport: (id: string) => undefined,
  getClientReports: (clientId: string) => [],
  generateReport: async (
    clientId: string, 
    url: string, 
    files: File[], 
    customPrompt?: string,
    pageSpeedData?: any,
    keywords?: Keyword[],
    notes?: string,
    businessProfile?: any,
    seoReport?: any
  ) => {
    throw new Error('ReportsContext not initialized');
  },
  createReport: async (data: any) => {
    throw new Error('ReportsContext not initialized');
  },
  updateReport: async (id: string, data: any) => {
    throw new Error('ReportsContext not initialized');
  },
  deleteReport: async (id: string) => {
    throw new Error('ReportsContext not initialized');
  },
  retryReport: async (id: string) => false,
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
