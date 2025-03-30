
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logSharedReportAccess } from '@/utils/sharedContentLogger';
import { RpcResponseCheckReportExists, RpcResponseGetPublicReportById, PublicReportData } from '@/types/supabase-rpc.types';

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

  const fetchReport = useCallback(async () => {
    if (!reportId || reportId.trim() === '') {
      console.error('No reportId provided');
      setError('ID de reporte no proporcionado');
      setIsLoading(false);
      setNotFound(true);
      return;
    }

    console.log(`Starting fetch for report with ID: ${reportId}`);
    setIsLoading(true);
    setError(null);
    setNotFound(false);

    try {
      // Basic UUID format validation to avoid unnecessary DB queries
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(reportId)) {
        console.error('Invalid UUID format:', reportId);
        setError('ID de reporte no válido (formato incorrecto)');
        setIsLoading(false);
        setNotFound(true);
        return;
      }
      
      // APPROACH 1: Try to get report from public_reports view first (most direct)
      console.log('APPROACH 1: Fetching from public_reports view...');
      const { data: publicReportData, error: publicReportError } = await supabase
        .from('public_reports')
        .select('*')
        .eq('id', reportId)
        .maybeSingle();
      
      console.log('Public reports view result:', { 
        data: publicReportData ? 'Data exists' : 'No data', 
        error: publicReportError 
      });
      
      if (!publicReportError && publicReportData) {
        console.log('Successfully fetched from public_reports view');
        setReport(publicReportData as unknown as PublicReport);
        logSharedReportAccess(reportId, { successful: true, source: 'public_reports_view' });
        setIsLoading(false);
        return;
      }
      
      // APPROACH 2: Check if report exists and check password protection
      console.log('APPROACH 2: Checking if report exists and password protection...');
      const { data: reportCheck, error: reportCheckError } = await supabase
        .rpc<RpcResponseCheckReportExists>('check_report_exists', { report_id_param: reportId });
      
      console.log('Report exists check:', { exists: reportCheck, error: reportCheckError });
      
      if (reportCheckError) {
        console.error('Error checking if report exists (RPC):', reportCheckError);
        // Continue to try other methods if RPC fails
      } else if (reportCheck === false || reportCheck?.exists === false) {
        console.error('Report does not exist (confirmed by RPC) - ID:', reportId);
        setError('El informe no existe');
        setIsLoading(false);
        setNotFound(true);
        logSharedReportAccess(reportId, { successful: false, error: 'Report not found', source: 'rpc_check' });
        return;
      }
      
      // Direct check in reports table
      console.log('Checking if report exists in reports table...');
      const { data: reportData, error: reportDataError } = await supabase
        .from('reports')
        .select('id, password')
        .eq('id', reportId)
        .maybeSingle();
      
      console.log('Direct reports table check:', { 
        data: reportData ? 'Found' : 'Not found', 
        error: reportDataError 
      });
      
      if (reportDataError) {
        console.error('Error checking if report exists in reports table:', reportDataError);
      } else if (!reportData) {
        console.error('Report does not exist in reports table - ID:', reportId);
        setError('El informe no existe');
        setIsLoading(false);
        setNotFound(true);
        logSharedReportAccess(reportId, { successful: false, error: 'Report not found', source: 'direct_check' });
        return;
      }
      
      // Check if report is password protected
      const isProtected = Boolean(reportData && reportData.password);
      setIsPasswordProtected(isProtected);
      console.log(`Report is password protected: ${isProtected}`);
      
      // If password protected and access not granted, don't fetch content yet
      if (isProtected && !accessGranted) {
        setIsLoading(false);
        return;
      }
      
      // APPROACH 3: Use get_public_report_by_id RPC
      console.log('APPROACH 3: Using get_public_report_by_id RPC...');
      const { data: rpcReportData, error: rpcError } = await supabase
        .rpc<RpcResponseGetPublicReportById[]>('get_public_report_by_id', { report_id_param: reportId });
      
      console.log('RPC result:', { 
        data: rpcReportData && Array.isArray(rpcReportData) && rpcReportData.length > 0 ? 'Data exists' : 'No data', 
        error: rpcError 
      });
      
      if (!rpcError && rpcReportData && Array.isArray(rpcReportData) && rpcReportData.length > 0) {
        console.log('Successfully fetched via RPC');
        setReport(rpcReportData[0] as unknown as PublicReport);
        logSharedReportAccess(reportId, { successful: true, source: 'rpc' });
        setIsLoading(false);
        return;
      }
      
      // APPROACH 4: Fallback to direct join query
      console.log('APPROACH 4: Using direct join query...');
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
          clients (
            name,
            website
          )
        `)
        .eq('id', reportId)
        .maybeSingle();
      
      console.log('Join query result:', { 
        data: joinData ? 'Data exists' : 'No data', 
        error: joinError 
      });
      
      if (!joinError && joinData) {
        console.log('Successfully fetched with join query');
        
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
      
      // APPROACH 5: Last resort - Reports table only
      console.log('APPROACH 5: Fetching report only (no joins)...');
      const { data: reportOnlyData, error: reportOnlyError } = await supabase
        .from('reports')
        .select('*')
        .eq('id', reportId)
        .maybeSingle();
      
      console.log('Report only query result:', { 
        data: reportOnlyData ? 'Data exists' : 'No data', 
        error: reportOnlyError 
      });
      
      if (!reportOnlyError && reportOnlyData) {
        console.log('Successfully fetched report only');
        
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
      
      // If we got here, we have exhausted all options
      console.error('All attempts failed. Report not found or not accessible.');
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
      setNotFound(true);
      
      // Log error
      logSharedReportAccess(reportId, { 
        successful: false, 
        error: err.message || 'Unknown error',
        source: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  }, [reportId, accessGranted]);

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
    if (reportId) {
      fetchReport();
    }
  }, [fetchReport]);

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
