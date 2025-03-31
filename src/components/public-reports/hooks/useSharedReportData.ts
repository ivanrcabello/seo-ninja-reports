
import { useState, useEffect, useCallback } from 'react';
import { SharedReport, SharedReportResponse } from '@/types/shared-content';
import { 
  checkReportExists, 
  checkReportPassword, 
  verifyReportPassword, 
  fetchReportByAnyId,
  logReportAccess
} from '@/api/shared-content';

export const useSharedReportData = (reportId: string) => {
  const [report, setReport] = useState<SharedReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  
  const fetchReport = useCallback(async () => {
    if (!reportId) {
      setError('No report ID provided');
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      setNotFound(false);
      
      // Check if report exists
      const { exists, error: existsError } = await checkReportExists(reportId);
      
      if (existsError) {
        console.error('Error checking if report exists:', existsError);
        throw existsError;
      }
      
      if (!exists) {
        setNotFound(true);
        setError('Informe no encontrado');
        logReportAccess(reportId, { successful: false, error: 'Report not found' }, 'not_found');
        return;
      }
      
      // Check if it's password protected
      const { isProtected, error: passwordError } = await checkReportPassword(reportId);
      
      if (passwordError) {
        console.error('Error checking password protection:', passwordError);
      } else {
        setIsPasswordProtected(isProtected);
        
        // Don't proceed if password protected and access not granted
        if (isProtected && !accessGranted) {
          setIsLoading(false);
          return;
        }
      }
      
      // Fetch the report - try different methods
      const response: SharedReportResponse = await fetchReportByAnyId(reportId);
      
      if (response.error) {
        console.error('Error fetching report:', response.error);
        throw response.error;
      }
      
      if (!response.report) {
        setNotFound(true);
        setError('Informe no encontrado');
        logReportAccess(reportId, { successful: false, error: 'Report data not found' }, 'data_not_found');
      } else {
        setReport(response.report);
        logReportAccess(reportId, { successful: true }, 'view');
      }
    } catch (err: any) {
      console.error('Error fetching report:', err);
      setError(err.message || 'Error al cargar el informe');
      logReportAccess(reportId, { successful: false, error: err.message || 'Unknown error' }, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [reportId, accessGranted]);
  
  // Initial fetch
  useEffect(() => {
    fetchReport();
  }, [fetchReport]);
  
  // Function to verify password
  const verifyPassword = async (password: string): Promise<boolean> => {
    try {
      const success = await verifyReportPassword(reportId, password);
      
      if (success) {
        setAccessGranted(true);
        // Re-fetch report with access
        fetchReport();
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
    notFound,
    isPasswordProtected,
    accessGranted,
    verifyPassword,
    refetch: fetchReport
  };
};
