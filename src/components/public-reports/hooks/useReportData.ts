
import { useState, useEffect } from 'react';
import { SharedReport, AccessLogOptions } from '@/types/shared-content';
import { 
  fetchReportBySharedUrl, 
  checkContentExists,
  checkContentPasswordProtection, 
  verifyContentPassword,
  logContentAccess
} from '@/api/shared-content';

const useReportData = (reportId: string) => {
  const [report, setReport] = useState<SharedReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [isPasswordProtected, setIsPasswordProtected] = useState<boolean>(false);
  const [accessGranted, setAccessGranted] = useState<boolean>(false);

  // Function to check if report exists and if it's password protected
  const checkReportStatus = async () => {
    if (!reportId) {
      setError('No report ID provided');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Check if report exists
      const { exists, error: existsError } = await checkContentExists(reportId, 'report');
      
      if (existsError) {
        throw existsError;
      }
      
      if (!exists) {
        setNotFound(true);
        setIsLoading(false);
        const options: AccessLogOptions = {
          successful: false, 
          error: 'Report not found'
        };
        logContentAccess('report', reportId, options, 'not_found');
        return;
      }

      // Check if password protected
      const { isProtected, error: protectedError } = await checkContentPasswordProtection(reportId, 'report');
      
      if (protectedError) {
        throw protectedError;
      }
      
      setIsPasswordProtected(isProtected);
      
      // If not password protected, fetch report directly
      if (!isProtected) {
        setAccessGranted(true);
        await fetchReport();
      } else {
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error('Error checking report status:', err);
      setError(err.message || 'Error checking report status');
      setIsLoading(false);
      
      const options: AccessLogOptions = {
        successful: false, 
        error: err.message || 'Unknown error'
      };
      logContentAccess('report', reportId, options, 'error');
    }
  };

  // Function to fetch report data
  const fetchReport = async () => {
    if (!reportId) return;
    
    try {
      setIsLoading(true);
      
      const { report, error: fetchError } = await fetchReportBySharedUrl(reportId);
      
      if (fetchError) throw fetchError;
      
      if (!report) {
        setNotFound(true);
        const options: AccessLogOptions = {
          successful: false, 
          error: 'Report not found'
        };
        logContentAccess('report', reportId, options, 'data_not_found');
        throw new Error('Report not found');
      }
      
      setReport(report);
      const options: AccessLogOptions = {
        successful: true, 
        source: 'direct_access'
      };
      logContentAccess('report', reportId, options, 'view');
      
    } catch (err: any) {
      console.error('Error fetching report:', err);
      setError(err.message || 'Error fetching report');
      
      const options: AccessLogOptions = {
        successful: false, 
        error: err.message || 'Unknown error',
        source: 'direct_access'
      };
      logContentAccess('report', reportId, options, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to verify password
  const verifyPassword = async (password: string): Promise<boolean> => {
    try {
      const isValid = await verifyContentPassword(reportId, 'report', password);
      
      if (isValid) {
        setAccessGranted(true);
        await fetchReport();
        
        const options: AccessLogOptions = {
          successful: true,
          passwordAttempt: true,
          source: 'password_form'
        };
        logContentAccess('report', reportId, options, 'password');
        
        return true;
      } else {
        const options: AccessLogOptions = {
          successful: false,
          passwordAttempt: true,
          error: 'Invalid password',
          source: 'password_form'
        };
        logContentAccess('report', reportId, options, 'password');
        
        return false;
      }
    } catch (err: any) {
      console.error('Error verifying password:', err);
      
      const options: AccessLogOptions = {
        successful: false,
        passwordAttempt: true,
        error: err.message || 'Unknown error',
        source: 'password_form'
      };
      logContentAccess('report', reportId, options, 'error');
      
      return false;
    }
  };

  // Initial check when component mounts or reportId changes
  useEffect(() => {
    checkReportStatus();
  }, [reportId]);

  return {
    report,
    isLoading,
    error,
    notFound,
    isPasswordProtected,
    accessGranted,
    verifyPassword,
    refetch: checkReportStatus
  };
};

export default useReportData;
