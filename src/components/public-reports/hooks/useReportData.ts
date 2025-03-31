
import { useState, useEffect, useCallback } from 'react';
import { useReportValidation } from './useReportValidation';
import { PublicReport } from '@/types/shared-content';
import { 
  checkReportExists, 
  checkReportPassword,
  fetchReportByAnyId,
  verifyReportPassword,
  logReportAccess,
  fetchFromPublicReportsView,
  fetchReportWithRpc,
  fetchReportOnly
} from '@/api/shared-content';

const useReportData = (reportId: string) => {
  const [report, setReport] = useState<PublicReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  
  const { validateReportId, notFound, setNotFound } = useReportValidation();

  const fetchReport = useCallback(async () => {
    // Validate report ID
    if (!validateReportId(reportId)) {
      setError('ID de reporte no proporcionado o inválido');
      setIsLoading(false);
      return;
    }

    console.log(`Starting fetch for report with ID: ${reportId}`);
    setIsLoading(true);
    setError(null);
    setNotFound(false);

    try {
      // First check if report exists and check password protection
      const { exists, error: reportCheckError } = await checkReportExists(reportId);
      
      if (reportCheckError) {
        console.error('Error checking if report exists (RPC):', reportCheckError);
        // Continue to try other methods if RPC fails
      } else if (!exists) {
        setError('El informe no existe');
        setIsLoading(false);
        setNotFound(true);
        logReportAccess(reportId, { successful: false, error: 'Report not found' }, 'rpc_check');
        return;
      }
      
      // Check password protection
      const { isProtected, error: passwordCheckError } = await checkReportPassword(reportId);
      if (passwordCheckError) {
        console.error('Error checking report password:', passwordCheckError);
      } else {
        setIsPasswordProtected(isProtected);
        console.log(`Report is password protected: ${isProtected}`);
        
        // If password protected and access not granted, don't fetch content yet
        if (isProtected && !accessGranted) {
          setIsLoading(false);
          return;
        }
      }
      
      // Try to get report using different methods in order of preference
      
      // APPROACH 1: Try to get report from public_reports view
      const { report: publicReport, error: publicReportError } = await fetchFromPublicReportsView(reportId);
      
      if (!publicReportError && publicReport) {
        setReport(publicReport);
        logReportAccess(reportId, { successful: true }, 'public_reports_view');
        setIsLoading(false);
        return;
      }
      
      // APPROACH 2: Use RPC method
      const { report: rpcReport, error: rpcError } = await fetchReportWithRpc(reportId);
      
      if (!rpcError && rpcReport) {
        setReport(rpcReport);
        logReportAccess(reportId, { successful: true }, 'rpc');
        setIsLoading(false);
        return;
      }
      
      // APPROACH 3: Direct query fallback
      const { report: reportOnly, error: reportOnlyError } = await fetchReportOnly(reportId);
      
      if (!reportOnlyError && reportOnly) {
        setReport(reportOnly);
        logReportAccess(reportId, { successful: true }, 'reports_only');
        setIsLoading(false);
        return;
      }
      
      // If we got here, we have exhausted all options
      console.error('All attempts failed. Report not found or not accessible.');
      setError('No se pudo encontrar el informe solicitado');
      setNotFound(true);
      logReportAccess(reportId, { 
        successful: false, 
        error: 'All attempts failed'
      }, 'exhausted_options');
      
    } catch (err: any) {
      console.error('Error fetching shared report:', err);
      setError(err.message || 'Error al cargar el informe');
      setNotFound(true);
      
      // Log error
      logReportAccess(reportId, { 
        successful: false, 
        error: err.message || 'Unknown error'
      }, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [reportId, accessGranted, validateReportId, setNotFound]);

  const verifyPassword = async (password: string): Promise<boolean> => {
    try {
      const success = await verifyReportPassword(reportId, password);
      
      if (success) {
        setAccessGranted(success);
      }
      
      // Log password attempt
      logReportAccess(reportId, {
        passwordAttempt: true,
        successful: success
      }, 'password_verification');
      
      return success;
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  };

  useEffect(() => {
    if (reportId) {
      fetchReport();
    }
  }, [fetchReport]);

  return {
    report,
    isLoading,
    error,
    isPasswordProtected,
    accessGranted,
    verifyPassword,
    refetch: fetchReport,
    notFound
  };
};

export default useReportData;
