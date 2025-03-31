import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logSharedReportAccess } from '@/utils/sharedContentLogger';
import { SharedContentStatus } from '@/types/shared-content';

interface PublicReport {
  id: string;
  title: string;
  summary?: string;
  url?: string;
  status: SharedContentStatus;
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

/**
 * Hook for fetching and managing report data by ID
 */
const useReportData = (reportId: string) => {
  const [report, setReport] = useState<PublicReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Validate report ID with UUID format
  const isValidReportId = useCallback((id: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }, []);

  // Simplify fetch with direct access to shared_content table
  const fetchReportDirect = useCallback(async () => {
    console.log(`Fetching report with ID: ${reportId} from shared_content table`);
    try {
      // First, check if the report is password protected
      const { data: protectionData, error: protectionError } = await supabase
        .rpc('check_report_password_protection', { report_id_param: reportId });

      if (!protectionError) {
        setIsPasswordProtected(Boolean(protectionData));
        
        // If password protected and access not granted, don't fetch content
        if (protectionData && !accessGranted) {
          console.log('Report is password protected, waiting for password');
          setIsLoading(false);
          return null;
        }
      }
      
      // Try fetching from shared_content table where content_type is 'report'
      const { data: viewData, error: viewError } = await supabase
        .from('shared_content')
        .select('*')
        .eq('content_type', 'report')
        .or(`id.eq.${reportId},shared_url.eq.${reportId}`)
        .single();

      if (!viewError && viewData) {
        console.log('Successfully fetched report from shared_content table:', viewData);
        
        // Log successful access
        logSharedReportAccess(reportId, { 
          successful: true, 
          source: 'shared_content_table' 
        });
        
        return {
          id: viewData.id,
          title: viewData.title || 'Informe sin título',
          summary: viewData.description,
          content: viewData.content,
          status: viewData.status as SharedContentStatus,
          client_name: viewData.client_name,
          client_website: viewData.client_website,
          date: viewData.created_at
        } as PublicReport;
      }
      
      // Try fetching from reports table directly if shared_content failed
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
          shared_url,
          password,
          clients (name, website)
        `)
        .or(`id.eq.${reportId},shared_url.eq.${reportId}`)
        .single();
        
      if (!reportError && reportData) {
        console.log('Successfully fetched report from reports table:', reportData);
        
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
        
        // Log successful access
        logSharedReportAccess(reportId, { 
          successful: true, 
          source: 'reports_table' 
        });
        
        return formattedReport;
      }
      
      // As a last resort, try using an RPC function
      const { data: rpcData, error: rpcError } = await supabase
        .rpc('get_report_by_any_id', { id_param: reportId });
        
      if (!rpcError && rpcData) {
        console.log('Successfully fetched report via RPC function:', rpcData);
        
        // Log successful access
        logSharedReportAccess(reportId, { 
          successful: true, 
          source: 'rpc_function' 
        });
        
        return rpcData as PublicReport;
      }
      
      console.error('Could not fetch report with any method:');
      console.error('View error:', viewError);
      console.error('Reports table error:', reportError);
      console.error('RPC error:', rpcError);
      
      throw new Error('No se pudo encontrar el informe solicitado');
      
    } catch (err: any) {
      console.error('Error in fetchReportDirect:', err);
      throw err;
    }
  }, [reportId, accessGranted]);

  // Main fetch function with error handling and retries
  const fetchReport = useCallback(async () => {
    if (!reportId || reportId.trim() === '') {
      console.error('No reportId provided');
      setError('ID de reporte no proporcionado');
      setIsLoading(false);
      setNotFound(true);
      return;
    }

    if (!isValidReportId(reportId)) {
      console.error('Invalid UUID format:', reportId);
      setError('ID de reporte no válido (formato incorrecto)');
      setIsLoading(false);
      setNotFound(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const reportData = await fetchReportDirect();
      
      if (reportData) {
        setReport(reportData);
        setNotFound(false);
      } else if (isPasswordProtected && !accessGranted) {
        // We're just waiting for password, not an error
        setNotFound(false);
      } else {
        setNotFound(true);
        setError('Informe no encontrado');
        
        // Log not found
        logSharedReportAccess(reportId, { 
          successful: false, 
          error: 'Report not found',
          source: 'not_found'
        });
      }
    } catch (err: any) {
      console.error('Error fetching report:', err);
      setError(err.message || 'Error al cargar el informe');
      
      // Only retry a limited number of times
      if (retryCount < 2) {
        console.log(`Will retry fetch (attempt ${retryCount + 1}/2)`);
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          fetchReport();
        }, 1000 * Math.pow(2, retryCount)); // Exponential backoff
      } else {
        setNotFound(true);
        logSharedReportAccess(reportId, { 
          successful: false, 
          error: err.message || 'Error after retries',
          source: 'error_with_retries'
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [reportId, isPasswordProtected, accessGranted, fetchReportDirect, retryCount, isValidReportId]);

  // Password verification function 
  const verifyPassword = async (password: string): Promise<boolean> => {
    try {
      console.log(`Verifying password for report: ${reportId}`);
      const { data, error } = await supabase
        .rpc('verify_shared_report_password', { 
          report_id_param: reportId,
          password_param: password
        });
      
      if (error) {
        console.error('Error in verify_shared_report_password RPC:', error);
        throw error;
      }
      
      const success = Boolean(data);
      console.log(`Password verification result: ${success}`);
      
      if (success) {
        setAccessGranted(true);
        
        // Log successful password verification
        logSharedReportAccess(reportId, {
          passwordAttempt: true,
          successful: true,
          source: 'password_verification_success'
        });
      } else {
        // Log failed password verification
        logSharedReportAccess(reportId, {
          passwordAttempt: true,
          successful: false,
          source: 'password_verification_failed'
        });
      }
      
      return success;
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  };

  // Initial fetch on load
  useEffect(() => {
    if (reportId) {
      fetchReport();
    }
  }, [fetchReport]);
  
  // Effect for retries when access is granted
  useEffect(() => {
    if (accessGranted && reportId) {
      fetchReport();
    }
  }, [accessGranted, fetchReport, reportId]);

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

const parseStatusFromString = (status: string): SharedContentStatus => {
  const validStatuses: SharedContentStatus[] = [
    "processing", "completed", "failed", "draft", "sent", 
    "accepted", "rejected", "pending", "paid", "signed", 
    "expired", "cancelled"
  ];
  
  if (validStatuses.includes(status as SharedContentStatus)) {
    return status as SharedContentStatus;
  }
  
  // Default fallback
  return "draft";
};
