
import { useState, useEffect, useCallback } from 'react';
import { PublicReport } from '@/types/shared-content';
import { 
  checkReportExists, 
  checkReportPassword, 
  verifyReportPassword, 
  fetchReportByAnyId,
  logReportAccess
} from '@/api/shared-content';

export const useSharedReportData = (reportId: string) => {
  const [report, setReport] = useState<PublicReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);

  const fetchReport = useCallback(async () => {
    if (!reportId) {
      setError('ID de reporte no proporcionado');
      setIsLoading(false);
      return;
    }

    console.log(`Starting fetch for report with ID: ${reportId}`);
    setIsLoading(true);
    setError(null);

    try {
      // First check if report exists
      const { exists, error: existsError } = await checkReportExists(reportId);
      
      if (existsError) {
        console.error('Error checking if report exists:', existsError);
      } else if (!exists) {
        setError('El informe no existe');
        setIsLoading(false);
        logReportAccess(reportId, { successful: false, error: 'Report not found' }, 'check');
        return;
      }
      
      // Check password protection
      const { isProtected, error: passwordError } = await checkReportPassword(reportId);
      
      if (passwordError) {
        console.error('Error checking report password:', passwordError);
      } else {
        setIsPasswordProtected(isProtected);
        console.log(`Report is password protected: ${isProtected}`);
        
        // If password protected and access not granted, don't fetch content yet
        if (isProtected && !accessGranted) {
          setIsLoading(false);
          return;
        }
      }

      // Fetch report data
      const { report: reportData, error: fetchError } = await fetchReportByAnyId(reportId);
      
      if (fetchError) {
        throw fetchError;
      }
      
      if (!reportData) {
        setError('No se pudo encontrar el informe solicitado');
        logReportAccess(reportId, { successful: false, error: 'Report data not found' }, 'data_not_found');
      } else {
        console.log('Report data loaded successfully:', reportData);
        setReport(reportData);
        logReportAccess(reportId, { successful: true }, 'view');
      }
    } catch (err: any) {
      console.error('Error fetching shared report:', err);
      setError(err.message || 'Error al cargar el informe');
      
      // Log error
      logReportAccess(reportId, { successful: false, error: err.message || 'Unknown error' }, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [reportId, accessGranted]);

  const verifyPassword = async (password: string): Promise<boolean> => {
    try {
      const success = await verifyReportPassword(reportId, password);
      
      if (success) {
        setAccessGranted(success);
      }
      
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
    refetch: fetchReport
  };
};
