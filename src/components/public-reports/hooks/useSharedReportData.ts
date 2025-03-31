
import { useState, useEffect } from 'react';
import { PublicReport } from '@/types/shared-content';
import useReportData from './useReportData';

export const useSharedReportData = (reportId: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [report, setReport] = useState<PublicReport | null>(null);

  // Use the base hook to get report data
  const { 
    report: reportData, 
    isLoading, 
    error: reportError,
    isPasswordProtected,
    accessGranted,
    verifyPassword,
    refetch,
    notFound
  } = useReportData(reportId);

  // Update our state based on the base hook
  useEffect(() => {
    setLoading(isLoading);
    
    if (reportError) {
      setError(new Error(reportError));
    } else {
      setError(null);
    }
    
    if (reportData) {
      setReport(reportData);
    }
  }, [reportData, isLoading, reportError]);

  return {
    report,
    loading,
    error,
    isPasswordProtected,
    accessGranted,
    verifyPassword,
    refetch,
    notFound
  };
};
