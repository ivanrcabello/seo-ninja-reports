
import { useState, useCallback } from 'react';
import { 
  checkReportExists, 
  checkReportPassword, 
  verifyReportPassword, 
  fetchReportByAnyId,
  logReportAccess,
  fetchFromPublicReportsView,
  fetchReportWithRpc,
  fetchReportOnly
} from '@/api/shared-content';
import { PublicReport } from '@/types/shared-content';

export const useSharedReportData = (reportId: string) => {
  const [report, setReport] = useState<PublicReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const [notFound, setNotFound] = useState(false);
  
  // Function to fetch report data
  const fetchReportData = useCallback(async () => {
    if (!reportId) {
      setError('No report ID provided');
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // First, check if the report exists
      const { exists, error: existsError } = await checkReportExists(reportId);
      
      if (existsError) {
        console.error('Error checking report existence:', existsError);
        throw existsError;
      }
      
      if (!exists) {
        setNotFound(true);
        setError('Report not found');
        logReportAccess(reportId, { successful: false, error: 'not_found' }, 'not_found');
        return;
      }
      
      // Check if it's password protected
      const { isProtected, error: passwordError } = await checkReportPassword(reportId);
      
      if (passwordError) {
        console.error('Error checking password protection:', passwordError);
      } else {
        setIsPasswordProtected(isProtected);
        
        // Don't proceed with fetching content if password protected and access not granted
        if (isProtected && !accessGranted) {
          logReportAccess(reportId, { successful: false, access_denied: true }, 'password_required');
          setIsLoading(false);
          return;
        }
      }
      
      // Fetch the report
      const { report: fetchedReport, error: fetchError } = await fetchReportByAnyId(reportId);
      
      if (fetchError) {
        console.error('Error fetching report:', fetchError);
        throw fetchError;
      }
      
      if (!fetchedReport) {
        setNotFound(true);
        setError('Report not found');
        logReportAccess(reportId, { successful: false, error: 'data_not_found' }, 'data_not_found');
      } else {
        setReport(fetchedReport);
        logReportAccess(reportId, { successful: true }, 'view');
      }
    } catch (err: any) {
      console.error('Error fetching shared report:', err);
      setError(err.message || 'Error loading report');
      logReportAccess(reportId, { successful: false, error: err.message }, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [reportId, accessGranted]);
  
  // Initial fetch
  useState(() => {
    fetchReportData();
  });
  
  // Function to verify password
  const verifyPassword = async (password: string): Promise<boolean> => {
    try {
      const success = await verifyReportPassword(reportId, password);
      
      if (success) {
        setAccessGranted(true);
        // Re-fetch the report with the verified password
        fetchReportData();
      }
      
      return success;
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  };
  
  return {
    report,
    isLoading,
    error,
    isPasswordProtected,
    accessGranted,
    notFound,
    verifyPassword,
    refetch: fetchReportData
  };
};
