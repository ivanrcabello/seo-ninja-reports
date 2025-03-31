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

interface AccessLogOptions {
  successful: boolean;
  passwordAttempt?: boolean;
  error?: string;
  source?: string;
}

const useReportData = (reportId: string) => {
  const [report, setReport] = useState<PublicReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [lastAttempt, setLastAttempt] = useState<Date | null>(null);

  const fetchReport = useCallback(async () => {
    if (!reportId || reportId.trim() === '') {
      console.error('No reportId provided');
      setError('ID de reporte no proporcionado');
      setIsLoading(false);
      setNotFound(true);
      return;
    }

    console.log(`Starting fetch for report with ID: ${reportId} (Attempt: ${retryCount + 1})`);
    setIsLoading(true);
    setError(null);
    setNotFound(false);
    setLastAttempt(new Date());

    try {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(reportId)) {
        console.error('Invalid UUID format:', reportId);
        setError('ID de reporte no válido (formato incorrecto)');
        setIsLoading(false);
        setNotFound(true);
        return;
      }
      
      console.log('Fetching report directly from reports table...');
      const { data: reportData, error: reportError } = await supabase
        .from('reports')
        .select(`
          id, 
          title, 
          summary,
          url,
          status,
          content,
          date,
          client_id,
          password,
          shared_url,
          clients (
            name,
            website
          )
        `)
        .or(`id.eq.${reportId},shared_url.eq.${reportId}`)
        .maybeSingle();
      
      if (!reportError && reportData) {
        console.log('Successfully fetched report:', reportData.id);
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
        
        const isProtected = Boolean(reportData.password);
        setIsPasswordProtected(isProtected);
        
        if (!isProtected || accessGranted) {
          setReport(formattedReport);
        }
        
        logSharedReportAccess(reportId, { 
          successful: true, 
          source: 'direct_query' 
        });
        
        setIsLoading(false);
        return;
      }
      
      console.log('Trying RPC function get_public_report_by_id...');
      const rpcResponse = await supabase
        .rpc('get_public_report_by_id', { report_id_param: reportId });
      
      const { data: rpcData, error: rpcError } = rpcResponse;
      
      if (!rpcError && rpcData && Array.isArray(rpcData) && rpcData.length > 0) {
        console.log('Successfully fetched report via RPC:', rpcData[0].id);
        setReport(rpcData[0]);
        
        logSharedReportAccess(reportId, { 
          successful: true, 
          source: 'rpc_function' 
        });
        
        setIsLoading(false);
        return;
      }
      
      console.log('Trying public_reports view...');
      const { data: viewData, error: viewError } = await supabase
        .from('public_reports')
        .select('*')
        .or(`id.eq.${reportId},shared_url.eq.${reportId}`)
        .maybeSingle();
      
      if (!viewError && viewData) {
        console.log('Successfully fetched from public_reports view');
        setReport(viewData as PublicReport);
        
        logSharedReportAccess(reportId, { 
          successful: true, 
          source: 'public_reports_view' 
        });
        
        setIsLoading(false);
        return;
      }
      
      console.log('Using direct SQL query as last resort...');
      const { data: directData, error: directError } = await supabase
        .rpc('get_report_by_any_id', { id_param: reportId });
      
      if (!directError && directData) {
        console.log('Successfully fetched report via direct SQL:', directData);
        setReport(directData as PublicReport);
        
        logSharedReportAccess(reportId, { 
          successful: true, 
          source: 'direct_sql' 
        });
        
        setIsLoading(false);
        return;
      }
      
      console.error('All attempts failed. Report not found or not accessible.');
      if (directError) console.error('Direct SQL error:', directError);
      if (viewError) console.error('View error:', viewError);
      if (rpcError) console.error('RPC error:', rpcError);
      if (reportError) console.error('Report error:', reportError);
      
      setError('No se pudo encontrar el informe solicitado');
      setNotFound(true);
      logSharedReportAccess(reportId, { 
        successful: false, 
        error: 'All attempts failed',
        source: 'exhausted_options'
      });
      
    } catch (err: any) {
      console.error('Error fetching shared report:', err);
      setError(err.message || 'Error al cargar el informe');
      
      if (retryCount < 3) {
        console.log(`Will retry fetch (${retryCount + 1}/3)...`);
        setRetryCount(retryCount + 1);
      } else {
        setNotFound(true);
        logSharedReportAccess(reportId, { 
          successful: false, 
          error: err.message || 'Unknown error',
          source: 'error_with_retries_exhausted'
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [reportId, accessGranted, retryCount]);

  const verifyPassword = async (password: string): Promise<boolean> => {
    try {
      console.log(`Verifying password for report: ${reportId}`);
      const { data, error } = await supabase
        .rpc<boolean>('verify_shared_report_password', { 
          report_id_param: reportId,
          password_param: password
        });
      
      if (error) {
        console.error('Error in verify_shared_report_password RPC:', error);
        throw error;
      }
      
      const success = Boolean(data);
      console.log(`Password verification result: ${success}`);
      setAccessGranted(success);
      
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
    if (reportId) {
      fetchReport();
    }
  }, [fetchReport]);

  useEffect(() => {
    if (retryCount > 0 && retryCount <= 3 && lastAttempt) {
      const now = new Date();
      const timeSinceLastAttempt = now.getTime() - lastAttempt.getTime();
      const backoffTime = Math.min(1000 * Math.pow(2, retryCount - 1), 8000);
      
      if (timeSinceLastAttempt > backoffTime) {
        const retryTimeout = setTimeout(() => {
          console.log(`Auto-retrying fetch attempt ${retryCount}/3 after ${backoffTime}ms backoff...`);
          fetchReport();
        }, backoffTime);
        
        return () => clearTimeout(retryTimeout);
      }
    }
  }, [retryCount, lastAttempt, fetchReport]);

  return {
    report,
    isLoading,
    error,
    isPasswordProtected,
    accessGranted,
    verifyPassword,
    refetch: fetchReport,
    notFound
  };
};

export default useReportData;
