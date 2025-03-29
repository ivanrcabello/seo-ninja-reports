
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logSharedReportAccess } from '@/utils/sharedContentLogger';

interface PublicReport {
  id: string;
  title: string;
  summary?: string;
  url?: string;
  status: string;
  content?: any;
  date?: string;
  client_name: string;
  client_website?: string;
}

const useReportData = (reportId: string) => {
  const [report, setReport] = useState<PublicReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);

  const fetchReport = useCallback(async () => {
    if (!reportId) {
      setError('ID de reporte no válido');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Check if report is password protected
      const { data: protectionData, error: protectionError } = await supabase.rpc(
        'check_report_password_protection', 
        { report_id_param: reportId }
      );
      
      if (protectionError) throw new Error(protectionError.message);
      
      setIsPasswordProtected(protectionData === true);
      
      // If password protected and access not granted, don't fetch content yet
      if (protectionData === true && !accessGranted) {
        setIsLoading(false);
        return;
      }
      
      // Query the actual report data - prefer the reports table first
      const { data: reportData, error: reportError } = await supabase
        .from('reports')
        .select('*')
        .eq('id', reportId)
        .maybeSingle();

      // If not found in reports, try public_reports view
      if (!reportData || reportError) {
        const { data: publicData, error: publicError } = await supabase
          .from('public_reports')
          .select('*')
          .eq('id', reportId)
          .maybeSingle();

        if (publicError) throw new Error(publicError.message);
        
        if (!publicData) {
          throw new Error('Informe no encontrado');
        }
        
        setReport(publicData as PublicReport);
        
        // Log successful access
        logSharedReportAccess(reportId, { successful: true });
      } else {
        setReport(reportData as PublicReport);
        
        // Log successful access
        logSharedReportAccess(reportId, { successful: true });
      }
    } catch (err: any) {
      console.error('Error fetching shared report:', err);
      setError(err.message || 'Error al cargar el informe');
      
      // Log error
      logSharedReportAccess(reportId, { 
        successful: false, 
        error: err.message 
      });
    } finally {
      setIsLoading(false);
    }
  }, [reportId, accessGranted]);

  const verifyPassword = async (password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc(
        'verify_shared_report_password', 
        { 
          report_id_param: reportId,
          password_param: password
        }
      );
      
      if (error) throw error;
      
      setAccessGranted(Boolean(data));
      
      // Log password attempt
      logSharedReportAccess(reportId, {
        passwordAttempt: true,
        successful: Boolean(data)
      });
      
      return Boolean(data);
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchReport();
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

export default useReportData;
