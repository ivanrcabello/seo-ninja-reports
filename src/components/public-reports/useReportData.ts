
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import sharedContentLogger from '@/utils/sharedContentLogger';

export interface PublicReport {
  id: string;
  title: string;
  summary: string | null;
  url: string | null;
  status: string;
  content: any;
  date: string;
  client_name: string;
  client_website: string | null;
}

export default function useReportData(reportId: string) {
  const [report, setReport] = useState<PublicReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  
  const fetchReport = useCallback(async () => {
    try {
      if (!reportId) return;
      
      setIsLoading(true);
      setError(null);
      sharedContentLogger.info('Fetching report:', reportId);
      
      // First check if report is password protected
      const { data: protectedData, error: protectedError } = await supabase.rpc(
        'check_report_password_protection',
        { report_id_param: reportId }
      );
      
      if (protectedError) {
        sharedContentLogger.error('Error checking password protection:', protectedError);
        setError('Error al verificar la protección de contraseña');
        setIsLoading(false);
        return;
      }
      
      setIsPasswordProtected(protectedData);
      sharedContentLogger.info('Is password protected:', protectedData);
      
      // If password protected and not validated yet, don't fetch the report data
      if (protectedData && !accessGranted) {
        sharedContentLogger.info('Report is password protected and access not granted yet');
        setIsLoading(false);
        return;
      }
      
      // Fetch the report data from public_reports view
      sharedContentLogger.info('Fetching report data from public_reports');
      const { data: reportData, error: reportError } = await supabase
        .from('public_reports')
        .select('*')
        .eq('id', reportId)
        .maybeSingle();
      
      if (reportError) {
        sharedContentLogger.error('Error fetching report:', reportError);
        setError('No se pudo cargar el informe');
        setIsLoading(false);
        return;
      }
      
      if (!reportData) {
        sharedContentLogger.error('Report not found');
        setError('Informe no encontrado');
        setIsLoading(false);
        return;
      }
      
      sharedContentLogger.info('Report data retrieved successfully:', reportData.title);
      setReport(reportData as PublicReport);
      setIsLoading(false);
    } catch (err) {
      sharedContentLogger.error('Error in useReportData:', err);
      setError('Error al cargar el informe');
      setIsLoading(false);
    }
  }, [reportId, accessGranted]);
  
  // Initial fetch
  useEffect(() => {
    if (reportId) {
      fetchReport();
    }
  }, [fetchReport]);
  
  // Function to verify password
  const verifyPassword = async (password: string): Promise<boolean> => {
    try {
      if (!reportId) return false;
      
      const { data, error } = await supabase.rpc(
        'verify_shared_report_password',
        { 
          report_id_param: reportId,
          password_param: password
        }
      );
      
      if (error) throw new Error(error.message);
      
      if (data === true) {
        setAccessGranted(true);
        return true;
      } else {
        return false;
      }
    } catch (err: any) {
      sharedContentLogger.error("Error verifying password:", err);
      return false;
    }
  };
  
  // Function to refetch report data
  const refetch = () => {
    if (reportId) {
      fetchReport();
    }
  };
  
  return {
    report,
    isLoading,
    error,
    isPasswordProtected,
    accessGranted,
    setAccessGranted,
    verifyPassword,
    refetch
  };
}
