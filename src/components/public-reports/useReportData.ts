
import { useState, useEffect } from 'react';
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
  
  const fetchReport = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
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
      
      if (protectedData) {
        // If password protected and not validated yet, don't fetch the report data
        console.log('Report is password protected, waiting for password validation');
        setIsLoading(false);
        return;
      }
      
      // Fetch the report data from public_reports view
      const { data: reportData, error: reportError } = await supabase
        .from('public_reports')
        .select('*')
        .eq('id', reportId)
        .single();
      
      if (reportError) {
        console.error('Error fetching report:', reportError);
        setError('No se pudo cargar el informe');
        setIsLoading(false);
        return;
      }
      
      if (!reportData) {
        setError('Informe no encontrado');
        setIsLoading(false);
        return;
      }
      
      setReport(reportData as PublicReport);
    } catch (err) {
      console.error('Error in useReportData:', err);
      setError('Error al cargar el informe');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial fetch
  useEffect(() => {
    if (reportId) {
      fetchReport();
    }
  }, [reportId]);
  
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
    refetch
  };
}
