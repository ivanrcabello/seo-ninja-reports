
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
      console.log('Fetching report:', reportId);
      
      // First check if report is password protected
      const { data: protectedData, error: protectedError } = await supabase.rpc(
        'check_report_password_protection',
        { report_id_param: reportId }
      );
      
      if (protectedError) {
        console.error('Error checking password protection:', protectedError);
        setError('Error al verificar la protección de contraseña');
        setIsLoading(false);
        return;
      }
      
      setIsPasswordProtected(protectedData);
      console.log('Is password protected:', protectedData);
      
      // If password protected and not validated yet, don't fetch the report data
      if (protectedData && !accessGranted) {
        console.log('Report is password protected and access not granted yet');
        setIsLoading(false);
        return;
      }
      
      // Fetch the report data from public_reports view
      console.log('Fetching report data from public_reports');
      const { data: reportData, error: reportError } = await supabase
        .from('public_reports')
        .select('*')
        .eq('id', reportId)
        .maybeSingle();
      
      if (reportError) {
        console.error('Error fetching report:', reportError);
        setError('No se pudo cargar el informe');
        setIsLoading(false);
        return;
      }
      
      if (!reportData) {
        console.error('Report not found');
        setError('Informe no encontrado');
        setIsLoading(false);
        return;
      }
      
      console.log('Report data retrieved successfully:', reportData.title);
      setReport(reportData as PublicReport);
      setIsLoading(false);
    } catch (err) {
      console.error('Error in useReportData:', err);
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
      console.error("Error verifying password:", err);
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
