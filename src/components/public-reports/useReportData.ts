
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
  client_name?: string;
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
      console.log(`Fetching report with ID: ${reportId}`);
      
      // Check if report exists first
      const { data: existsData, error: existsError } = await supabase.rpc(
        'check_report_exists',
        { report_id_param: reportId }
      );
      
      if (existsError) {
        console.error('Error checking if report exists:', existsError);
        throw new Error('Error al verificar si el informe existe');
      }
      
      if (!existsData) {
        console.error('Report does not exist');
        throw new Error('Informe no encontrado');
      }
      
      // Check if report is password protected
      const { data: protectionData, error: protectionError } = await supabase.rpc(
        'check_report_password_protection', 
        { report_id_param: reportId }
      );
      
      if (protectionError) {
        console.error('Error checking password protection:', protectionError);
      } else {
        setIsPasswordProtected(protectionData === true);
        console.log(`Report is password protected: ${protectionData}`);
        
        // If password protected and access not granted, don't fetch content yet
        if (protectionData === true && !accessGranted) {
          setIsLoading(false);
          return;
        }
      }
      
      // First try: Fetch from public_reports view
      console.log('Attempting to fetch from public_reports view...');
      const { data: publicData, error: publicError } = await supabase
        .from('public_reports')
        .select('*')
        .eq('id', reportId)
        .maybeSingle();
      
      if (!publicError && publicData) {
        console.log('Found in public_reports:', publicData);
        setReport(publicData);
        logSharedReportAccess(reportId, { successful: true });
        setIsLoading(false);
        return;
      } 
      
      console.log('Error or no data from public_reports:', publicError);
      
      // Second try: Direct query to reports with join
      console.log('Attempting to fetch with direct join query...');
      const { data: reportWithClientData, error: reportWithClientError } = await supabase
        .from('reports')
        .select(`
          id,
          title,
          summary,
          url,
          status,
          content,
          date,
          clients (
            name,
            website
          )
        `)
        .eq('id', reportId)
        .maybeSingle();
      
      if (!reportWithClientError && reportWithClientData) {
        console.log('Found with direct join query:', reportWithClientData);
        const formattedReport: PublicReport = {
          id: reportWithClientData.id,
          title: reportWithClientData.title || 'Informe sin título',
          summary: reportWithClientData.summary,
          url: reportWithClientData.url,
          status: reportWithClientData.status,
          content: reportWithClientData.content,
          date: reportWithClientData.date,
          client_name: reportWithClientData.clients?.name,
          client_website: reportWithClientData.clients?.website
        };
        
        setReport(formattedReport);
        logSharedReportAccess(reportId, { successful: true });
        setIsLoading(false);
        return;
      }
      
      console.log('Error or no data from direct join:', reportWithClientError);
      
      // Last attempt: Fetch just the report without client info
      console.log('Attempting to fetch report only...');
      const { data: reportData, error: reportError } = await supabase
        .from('reports')
        .select('*')
        .eq('id', reportId)
        .maybeSingle();
      
      if (!reportError && reportData) {
        console.log('Found report only:', reportData);
        const formattedReport: PublicReport = {
          id: reportData.id,
          title: reportData.title || 'Informe sin título',
          summary: reportData.summary,
          url: reportData.url,
          status: reportData.status,
          content: reportData.content,
          date: reportData.date
        };
        
        setReport(formattedReport);
        logSharedReportAccess(reportId, { successful: true });
        setIsLoading(false);
        return;
      }
      
      console.log('Error or no data from final attempt:', reportError);
      
      // If we reach this point, no report was found
      throw new Error('No se pudo encontrar el informe solicitado');
      
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
