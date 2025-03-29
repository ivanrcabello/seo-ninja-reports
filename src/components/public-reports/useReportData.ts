
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
      // Check if report is password protected
      const { data: protectionData, error: protectionError } = await supabase.rpc(
        'check_report_password_protection', 
        { report_id_param: reportId }
      );
      
      if (protectionError) throw new Error(protectionError.message);
      
      setIsPasswordProtected(protectionData === true);
      
      // If password protected and access not granted, don't fetch content yet
      if (protectionData === true && !accessGranted) {
        setIsLoading(false);
        return;
      }
      
      // First try to get the report from client_portal_reports
      const { data: portalReportData, error: portalReportError } = await supabase
        .from('client_portal_reports')
        .select('*, clients(name, website)')
        .eq('original_report_id', reportId)
        .maybeSingle();

      // If not found in client_portal_reports, try reports table
      if (!portalReportData && !portalReportError) {
        const { data: reportData, error: reportError } = await supabase
          .from('reports')
          .select('*, clients(name, website)')
          .eq('id', reportId)
          .maybeSingle();
          
        if (reportError) throw new Error(reportError.message);
        
        if (reportData) {
          // Transform the report data to match the PublicReport interface
          const formattedReport: PublicReport = {
            id: reportData.id,
            title: reportData.title,
            summary: reportData.summary,
            url: reportData.url,
            status: reportData.status,
            content: reportData.content,
            date: reportData.date,
            client_name: reportData.clients?.name,
            client_website: reportData.clients?.website
          };

          setReport(formattedReport);
          
          // Log successful access
          logSharedReportAccess(reportId, { successful: true });
          setIsLoading(false);
          return;
        }
      } else if (portalReportError) {
        console.error('Error fetching portal report:', portalReportError);
      } else if (portalReportData) {
        // Transform portal report data to match PublicReport interface
        const formattedPortalReport: PublicReport = {
          id: portalReportData.id,
          title: portalReportData.title,
          summary: portalReportData.summary,
          url: portalReportData.url,
          status: portalReportData.status,
          content: portalReportData.content,
          date: portalReportData.created_at,
          client_name: portalReportData.clients?.name,
          client_website: portalReportData.clients?.website
        };
        
        setReport(formattedPortalReport);
        
        // Log successful access
        logSharedReportAccess(reportId, { successful: true });
        setIsLoading(false);
        return;
      }
  
      // If all else fails, try the public_reports view as last resort
      const { data: publicData, error: publicError } = await supabase
        .from('public_reports')
        .select('*')
        .eq('id', reportId)
        .maybeSingle();

      if (publicError) throw new Error(publicError.message);
      
      if (!publicData) {
        throw new Error('Informe no encontrado');
      }
      
      setReport(publicData as PublicReport);
      
      // Log successful access
      logSharedReportAccess(reportId, { successful: true });
      
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
