
import React, { createContext, useContext, ReactNode } from 'react';
import useReportsHook from '@/hooks/useReports';

// Create a context for reports
const ReportsContext = createContext<ReturnType<typeof useReportsHook> | undefined>(undefined);

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
  }
  
  return context;
};
