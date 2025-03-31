
import { useState, useEffect, useCallback } from 'react';
import { SharedReport, SharedReportResponse, AccessLogOptions, AccessLogType } from '@/types/shared-content';
import { 
  checkContentExists, 
  checkContentPasswordProtection, 
  verifyContentPassword,
  fetchReportByAnyId,
  logContentAccess
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
      const { exists, error: existsError } = await checkContentExists(reportId, 'report');
      
      if (existsError) {
        console.error('Error checking if report exists:', existsError);
        throw existsError;
      }
      
      if (!exists) {
        setNotFound(true);
        setError('Informe no encontrado');
        const logOptions: AccessLogOptions = { 
          successful: false, 
          error: 'Report not found' 
        };
        logContentAccess('report', reportId, logOptions, 'not_found');
        return;
      }
      
      // Check if it's password protected
      const { isProtected, error: passwordError } = await checkContentPasswordProtection(reportId, 'report');
      
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
      
      // Fetch the report
      const response: SharedReportResponse = await fetchReportByAnyId(reportId);
      
      if (response.error) {
        console.error('Error fetching report:', response.error);
        throw response.error;
      }
      
      if (!response.data) {
        setNotFound(true);
        setError('Informe no encontrado');
        const logOptions: AccessLogOptions = { 
          successful: false, 
          error: 'Report data not found' 
        };
        logContentAccess('report', reportId, logOptions, 'data_not_found');
      } else {
        setReport(response.data);
        const logOptions: AccessLogOptions = { 
          successful: true 
        };
        logContentAccess('report', reportId, logOptions, 'view');
      }
    } catch (err: any) {
      console.error('Error fetching report:', err);
      setError(err.message || 'Error al cargar el informe');
      const logOptions: AccessLogOptions = { 
        successful: false, 
        error: err.message || 'Unknown error' 
      };
      logContentAccess('report', reportId, logOptions, 'error');
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
      const success = await verifyContentPassword(reportId, 'report', password);
      
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

export default useSharedReportData;
