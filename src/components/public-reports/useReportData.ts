
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import sharedContentLogger from '@/utils/sharedContentLogger';

export interface PublicReport {
  id: string;
  title: string;
  summary?: string;
  content: any;
  client_name: string;
  client_website?: string;
  url?: string;
  status?: string;
  date?: string;
}

const useReportData = (reportId: string) => {
  const [report, setReport] = useState<PublicReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);

  const verifyPassword = async (password: string): Promise<boolean> => {
    try {
      sharedContentLogger.info('Verifying password for report:', reportId);
      
      const { data, error: verifyError } = await supabase.rpc(
        'verify_shared_report_password',
        {
          report_id_param: reportId,
          password_param: password
        }
      );
      
      if (verifyError) {
        sharedContentLogger.error('Password verification error:', verifyError);
        throw new Error(verifyError.message);
      }
      
      if (data === true) {
        setAccessGranted(true);
        sharedContentLogger.success('Password verification successful');
        await fetchReport(true); // Fetch report after successful password verification
        return true;
      } else {
        sharedContentLogger.warn('Incorrect password');
        return false;
      }
    } catch (err: any) {
      sharedContentLogger.error('Error during password verification:', err);
      return false;
    }
  };

  const fetchReport = useCallback(async (passwordVerified = false) => {
    if (!reportId) {
      setError('ID del informe no especificado');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    try {
      sharedContentLogger.info('Checking if report is password protected:', reportId);
      
      // First check if report is password protected
      const { data: protectionData, error: protectionError } = await supabase.rpc(
        'check_report_password_protection', 
        { report_id_param: reportId }
      );
      
      if (protectionError) {
        sharedContentLogger.error('Error checking password protection:', protectionError);
        throw new Error(protectionError.message);
      }
      
      setIsPasswordProtected(protectionData === true);
      
      // If report is password protected and user hasn't verified the password yet, don't fetch the report
      if (protectionData === true && !passwordVerified && !accessGranted) {
        sharedContentLogger.info('Report is password protected and not yet verified');
        setIsLoading(false);
        return;
      }
      
      sharedContentLogger.info('Fetching report data:', reportId);
      
      // Fetch the report from the public_reports view
      const { data, error } = await supabase
        .from('public_reports')
        .select('*')
        .eq('id', reportId)
        .maybeSingle();
      
      if (error) {
        sharedContentLogger.error('Database error fetching report:', error);
        throw new Error(`Error cargando el informe: ${error.message}`);
      }
      
      if (!data) {
        sharedContentLogger.error('Report not found:', reportId);
        throw new Error('Informe no encontrado');
      }
      
      sharedContentLogger.success('Report data fetched successfully');
      sharedContentLogger.debug('Report data:', data);
      
      setReport(data as PublicReport);
      
    } catch (err: any) {
      sharedContentLogger.error('Error fetching report:', err);
      setError(err.message || 'Error al cargar el informe');
    } finally {
      setIsLoading(false);
    }
  }, [reportId, accessGranted]);
  
  useEffect(() => {
    fetchReport(accessGranted);
  }, [fetchReport, accessGranted]);
  
  return {
    report,
    isLoading,
    error,
    isPasswordProtected,
    accessGranted,
    verifyPassword,
    refetch: () => fetchReport(accessGranted)
  };
};

export default useReportData;
