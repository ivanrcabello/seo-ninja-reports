
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import sharedContentLogger from '@/utils/sharedContentLogger';

export interface PublicReport {
  id: string;
  title: string;
  summary?: string;
  url?: string;
  status: string;
  content?: any;
  date: string;
  client_name: string;
  client_website?: string;
}

const useReportData = (reportId: string) => {
  const [report, setReport] = useState<PublicReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);

  const refetch = useCallback(async () => {
    if (!reportId) {
      setError('ID de informe no válido');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    sharedContentLogger.group(`Fetching report: ${reportId}`);
    sharedContentLogger.timeStart('fetch-report');

    try {
      // Check if report is password protected
      const { data: protectionData, error: protectionError } = await supabase.rpc(
        'check_report_password_protection', 
        { report_id_param: reportId }
      );
      
      if (protectionError) {
        sharedContentLogger.error("Protection check error", protectionError);
        throw new Error(protectionError.message);
      }
      
      setIsPasswordProtected(protectionData === true);
      sharedContentLogger.info(`Report password protected: ${protectionData}`);
      
      // Fetch report data from public_reports view
      const { data, error } = await supabase
        .from('public_reports')
        .select('*')
        .eq('id', reportId)
        .maybeSingle();

      if (error) {
        sharedContentLogger.error("Database fetch error", error);
        throw new Error(error.message);
      }

      if (!data) {
        sharedContentLogger.error("No report data found");
        throw new Error('Informe no encontrado');
      } 

      sharedContentLogger.group('Raw report data', true);
      sharedContentLogger.table(data);
      sharedContentLogger.groupEnd();
      
      // Format the data with safe type handling
      const formattedReport: PublicReport = {
        id: data.id || '',
        title: data.title || '',
        summary: data.summary || '',
        url: data.url || '',
        status: data.status || 'processing',
        content: data.content || {},
        date: data.date || new Date().toISOString(),
        client_name: data.client_name || '',
        client_website: data.client_website
      };
      
      sharedContentLogger.success(`Report data formatted successfully`);
      setReport(formattedReport);
    } catch (err: any) {
      sharedContentLogger.error('Error fetching shared report', err);
      setError(err.message || 'Error al cargar el informe');
    } finally {
      setIsLoading(false);
      sharedContentLogger.timeEnd('fetch-report');
      sharedContentLogger.groupEnd();
    }
  }, [reportId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    report,
    isLoading,
    error,
    isPasswordProtected,
    refetch
  };
};

export default useReportData;
