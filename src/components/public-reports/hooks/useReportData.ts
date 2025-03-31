
import { useState, useEffect } from 'react';
import { SharedReport, SharedReportResponse } from '@/types/shared-content';
import { fetchReportByAnyId, verifyReportPassword, logReportAccess } from '@/api/shared-content/reports';

interface UseReportDataParams {
  reportId: string;
}

interface UseReportDataResult {
  report: SharedReport | null;
  isLoading: boolean;
  error: string | null;
  isPasswordProtected: boolean;
  accessGranted: boolean;
  verifyPassword: (password: string) => Promise<boolean>;
}

export const useReportData = ({ reportId }: UseReportDataParams): UseReportDataResult => {
  const [report, setReport] = useState<SharedReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState<boolean>(false);
  const [accessGranted, setAccessGranted] = useState<boolean>(false);

  useEffect(() => {
    const loadReport = async () => {
      if (!reportId) {
        setError('Report ID is required');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response: SharedReportResponse = await fetchReportByAnyId(reportId);
        
        if (response.error) {
          throw response.error;
        }

        if (response.data) {
          setReport(response.data);
          
          // Check if report is password protected
          const passwordProtected = !!response.data.password;
          setIsPasswordProtected(passwordProtected);
          
          if (!passwordProtected) {
            setAccessGranted(true);
          }
          
          // Log access
          logReportAccess(reportId, { 
            successful: true 
          }, 'view');
        } else {
          logReportAccess(reportId, { 
            successful: false,
            error: 'Report not found' 
          }, 'not_found');
          
          throw new Error('Report not found');
        }
      } catch (err: any) {
        setError(err.message || 'Error al cargar el informe');
        console.error('Error loading report:', err);
        
        logReportAccess(reportId, { 
          successful: false,
          error: err.message || 'Unknown error' 
        }, 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadReport();
  }, [reportId]);

  const verifyPassword = async (password: string): Promise<boolean> => {
    try {
      const isValid = await verifyReportPassword(reportId, password);
      
      if (isValid) {
        setAccessGranted(true);
        
        // Log successful password attempt
        logReportAccess(reportId, { 
          successful: true 
        }, 'password');
      } else {
        // Log failed password attempt
        logReportAccess(reportId, { 
          successful: false,
          error: 'Invalid password' 
        }, 'password');
      }
      
      return isValid;
    } catch (err) {
      console.error('Error verifying password:', err);
      return false;
    }
  };

  return {
    report,
    isLoading,
    error,
    isPasswordProtected,
    accessGranted,
    verifyPassword
  };
};
