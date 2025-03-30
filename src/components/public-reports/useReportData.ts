
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
      
      // Check if report is password protected
      const { data: protectionData, error: protectionError } = await supabase.rpc(
        'check_report_password_protection', 
        { report_id_param: reportId }
      );
      
      if (protectionError) {
        console.error('Error checking password protection:', protectionError);
        // Continue anyway - if we can't check protection, we'll try to fetch the report
      } else {
        setIsPasswordProtected(protectionData === true);
        console.log(`Report is password protected: ${protectionData}`);
        
        // If password protected and access not granted, don't fetch content yet
        if (protectionData === true && !accessGranted) {
          setIsLoading(false);
          return;
        }
      }
      
      // Try 3 different approaches to get the report data
      
      // Approach 1: Try to get report data using the get_public_report_by_id function
      try {
        const { data: functionData, error: functionError } = await supabase.rpc(
          'get_public_report_by_id',
          { report_id_param: reportId }
        );
        
        if (!functionError && functionData && functionData.length > 0) {
          console.log('Found via RPC function:', functionData[0]);
          setReport(functionData[0] as PublicReport);
          logSharedReportAccess(reportId, { successful: true });
          setIsLoading(false);
          return;
        }
      } catch (functionErr) {
        console.log('RPC function approach failed:', functionErr);
      }
      
      // Approach 2: Try to fetch from public_reports view
      console.log('Attempting to fetch from public_reports view...');
      const { data: publicData, error: publicError } = await supabase
        .from('public_reports')
        .select('*')
        .eq('id', reportId)
        .maybeSingle();
      
      if (!publicError && publicData) {
        console.log('Found in public_reports:', publicData);
        // Convert the data to our expected format
        const formattedReport: PublicReport = {
          id: publicData.id,
          title: publicData.title || 'Informe sin título',
          summary: publicData.summary,
          url: publicData.url,
          status: publicData.status,
          content: publicData.content,
          date: publicData.date,
          client_name: publicData.client_name,
          client_website: publicData.client_website
        };
        
        setReport(formattedReport);
        logSharedReportAccess(reportId, { successful: true });
        setIsLoading(false);
        return;
      } else if (publicError) {
        console.error('Error fetching from public_reports:', publicError);
      }
      
      // Approach 3: Try to fetch directly from reports table with client info
      console.log('Attempting to fetch directly from reports table...');
      const { data: reportData, error: reportError } = await supabase
        .from('reports')
        .select('*, clients(name, website)')
        .eq('id', reportId)
        .maybeSingle();
        
      if (!reportError && reportData) {
        console.log('Found in reports table:', reportData);
        const formattedReport: PublicReport = {
          id: reportData.id,
          title: reportData.title || 'Informe sin título',
          summary: reportData.summary,
          url: reportData.url,
          status: reportData.status,
          content: reportData.content,
          date: reportData.date,
          client_name: reportData.clients?.name,
          client_website: reportData.clients?.website
        };
        
        setReport(formattedReport);
        logSharedReportAccess(reportId, { successful: true });
        setIsLoading(false);
        return;
      } else if (reportError) {
        console.error('Error fetching from reports:', reportError);
      }
      
      // If we get here, no report was found in any table
      throw new Error('Informe no encontrado en ninguna tabla');
      
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
