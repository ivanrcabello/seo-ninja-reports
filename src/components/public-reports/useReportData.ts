
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
      
      // STEP 1: First check if the report exists - using direct query instead of RPC
      const { data: existCheck, error: existCheckError } = await supabase
        .from('reports')
        .select('id')
        .eq('id', reportId)
        .maybeSingle();
      
      if (existCheckError) {
        console.error('Error checking if report exists:', existCheckError);
        throw new Error('Error al verificar si el informe existe');
      }
      
      if (!existCheck) {
        console.error('Report does not exist - ID:', reportId);
        throw new Error('ID de reporte no válido');
      }
      
      console.log('Report exists check passed:', existCheck);
      
      // STEP 2: Check if report is password protected
      const { data: protectionData, error: protectionError } = await supabase
        .from('reports')
        .select('password')
        .eq('id', reportId)
        .maybeSingle();
      
      if (protectionError) {
        console.error('Error checking password protection:', protectionError);
      } else if (protectionData) {
        const isProtected = Boolean(protectionData.password);
        setIsPasswordProtected(isProtected);
        console.log(`Report is password protected: ${isProtected}`);
        
        // If password protected and access not granted, don't fetch content yet
        if (isProtected && !accessGranted) {
          setIsLoading(false);
          return;
        }
      }
      
      // STEP 3: FIRST ATTEMPT - Try public_reports view
      console.log('Attempting to fetch from public_reports view...');
      const { data: publicReportData, error: publicReportError } = await supabase
        .from('public_reports')
        .select('*')
        .eq('id', reportId)
        .maybeSingle();
      
      if (!publicReportError && publicReportData) {
        console.log('Successfully fetched from public_reports view:', publicReportData);
        setReport(publicReportData);
        logSharedReportAccess(reportId, { successful: true, source: 'public_reports_view' });
        setIsLoading(false);
        return;
      }
      
      console.log('Error or no data from public_reports view:', publicReportError);
      
      // STEP 4: SECOND ATTEMPT - Direct query with join
      console.log('Attempting direct join query...');
      
      // Fix: Replace RPC call with a direct query that mimics the function
      const { data: joinData, error: joinError } = await supabase
        .from('reports')
        .select(`
          id, 
          title, 
          summary,
          url,
          status,
          content,
          date,
          clients!inner (
            name,
            website
          )
        `)
        .eq('id', reportId)
        .single();
      
      if (!joinError && joinData) {
        console.log('Successfully fetched with join query:', joinData);
        
        // Format the data to match PublicReport interface
        const formattedReport: PublicReport = {
          id: joinData.id,
          title: joinData.title || 'Informe sin título',
          summary: joinData.summary,
          url: joinData.url,
          status: joinData.status,
          content: joinData.content,
          date: joinData.date,
          client_name: joinData.clients?.name,
          client_website: joinData.clients?.website
        };
        
        setReport(formattedReport);
        logSharedReportAccess(reportId, { successful: true, source: 'direct_join' });
        setIsLoading(false);
        return;
      }
      
      console.log('Error or no data from direct join:', joinError);
      
      // STEP 5: THIRD ATTEMPT - Reports table only
      console.log('Attempting to fetch report only...');
      const { data: reportOnlyData, error: reportOnlyError } = await supabase
        .from('reports')
        .select('*')
        .eq('id', reportId)
        .single();
      
      if (!reportOnlyError && reportOnlyData) {
        console.log('Successfully fetched report only:', reportOnlyData);
        
        const formattedReport: PublicReport = {
          id: reportOnlyData.id,
          title: reportOnlyData.title || 'Informe sin título',
          summary: reportOnlyData.summary,
          url: reportOnlyData.url,
          status: reportOnlyData.status,
          content: reportOnlyData.content,
          date: reportOnlyData.date
        };
        
        setReport(formattedReport);
        logSharedReportAccess(reportId, { successful: true, source: 'reports_only' });
        setIsLoading(false);
        return;
      }
      
      console.log('All attempts failed. Report not found.');
      throw new Error('No se pudo encontrar el informe solicitado');
      
    } catch (err: any) {
      console.error('Error fetching shared report:', err);
      setError(err.message || 'Error al cargar el informe');
      
      // Log error
      logSharedReportAccess(reportId, { 
        successful: false, 
        error: err.message,
        source: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  }, [reportId, accessGranted]);

  const verifyPassword = async (password: string): Promise<boolean> => {
    try {
      console.log(`Verifying password for report: ${reportId}`);
      const { data, error } = await supabase.rpc(
        'verify_shared_report_password', 
        { 
          report_id_param: reportId,
          password_param: password
        }
      );
      
      if (error) {
        console.error('Error in verify_shared_report_password RPC:', error);
        throw error;
      }
      
      const success = Boolean(data);
      console.log(`Password verification result: ${success}`);
      setAccessGranted(success);
      
      // Log password attempt
      logSharedReportAccess(reportId, {
        passwordAttempt: true,
        successful: success,
        source: 'password_verification'
      });
      
      return success;
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
