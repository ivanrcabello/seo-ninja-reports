
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logSharedReportAccess } from '@/utils/sharedContentLogger';

export type PublicReport = {
  id: string;
  title: string;
  client_name: string;
  content: any;
  created_at: string;
  password_protected: boolean;
  website?: string;
  executive_summary?: string;
};

export const useReportData = (reportId: string) => {
  const [report, setReport] = useState<PublicReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);

  // Fetch report data with access check
  const fetchReport = async () => {
    if (!reportId) {
      setError("ID del informe no proporcionado");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('public_reports')
        .select('*')
        .eq('id', reportId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        setError("Informe no encontrado");
        setIsLoading(false);
        return;
      }

      // Check if the report is password protected
      if (data.password_protected && !accessGranted) {
        setIsPasswordProtected(true);
        setReport(null);
      } else {
        setReport(data as PublicReport);
        setIsPasswordProtected(data.password_protected);
        
        // Log access if report is accessed successfully
        if (!isLoading && !error) {
          logSharedReportAccess({
            reportId: reportId,
            action: 'view',
            status: 'success',
            details: `Report viewed: ${data.title}`
          });
        }
      }
    } catch (err: any) {
      console.error("Error fetching report:", err);
      setError(err.message || "Error al cargar el informe");
      
      logSharedReportAccess({
        reportId: reportId,
        action: 'view',
        status: 'error',
        details: `Error: ${err.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchReport();
  }, [reportId, accessGranted]);

  // Password verification function
  const verifyPassword = async (password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .rpc('verify_report_password', {
          report_id: reportId,
          password_to_check: password
        });

      if (error) throw new Error(error.message);

      if (data === true) {
        setAccessGranted(true);
        return true;
      } else {
        logSharedReportAccess({
          reportId: reportId,
          action: 'password_check',
          status: 'failed',
          details: 'Invalid password attempt'
        });
        return false;
      }
    } catch (err: any) {
      console.error("Password verification error:", err);
      logSharedReportAccess({
        reportId: reportId,
        action: 'password_check',
        status: 'error',
        details: `Error: ${err.message}`
      });
      return false;
    }
  };

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
