
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PublicReport } from '../utils/reportDataUtils';
import { logSharedReportAccess } from '../services/sharedReportLogger';

/**
 * Hook to fetch shared report data with reliable fallbacks
 */
export const useSharedReportData = (reportId: string) => {
  const [report, setReport] = useState<PublicReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [verified, setVerified] = useState<boolean>(false);

  useEffect(() => {
    const fetchReport = async () => {
      if (!reportId) {
        setLoading(false);
        setError(new Error('No report ID provided'));
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log('Fetching report with ID:', reportId);
        
        // Primary method: Use the RPC function to get the report by ID
        const { data: rpcReport, error: rpcError } = await supabase
          .rpc('get_report_by_any_id', { id_param: reportId });

        // If successful, use that
        if (rpcReport && !rpcError) {
          console.log('Report found with RPC:', rpcReport);
          logSharedReportAccess(reportId, { successful: true, action: 'view' });
          setReport(rpcReport as PublicReport);
          setVerified(true);
          setLoading(false);
          return;
        }

        // Fallback 1: Direct query to reports table
        console.log('RPC method failed, trying direct query...');
        const { data: directReport, error: directError } = await supabase
          .from('reports')
          .select('*')
          .or(`id.eq.${reportId},shared_url.eq.${reportId}`)
          .maybeSingle();

        if (directReport && !directError) {
          console.log('Report found with direct query:', directReport);
          logSharedReportAccess(reportId, { successful: true, action: 'view' });
          setReport(directReport as PublicReport);
          setVerified(true);
          setLoading(false);
          return;
        }

        // Fallback 2: Try public_reports view
        console.log('Direct query failed, trying public_reports view...');
        const { data: viewReport, error: viewError } = await supabase
          .from('public_reports')
          .select('*')
          .or(`id.eq.${reportId},shared_url.eq.${reportId}`)
          .maybeSingle();

        if (viewReport && !viewError) {
          console.log('Report found in public_reports view:', viewReport);
          logSharedReportAccess(reportId, { successful: true, action: 'view' });
          setReport(viewReport as PublicReport);
          setVerified(true);
          setLoading(false);
          return;
        }

        // If all methods fail, log and set error
        const errorMsg = `Report not found. Errors: RPC: ${rpcError?.message || 'none'}, Direct: ${directError?.message || 'none'}, View: ${viewError?.message || 'none'}`;
        console.error(errorMsg);
        logSharedReportAccess(reportId, { 
          successful: false, 
          error: errorMsg
        });
        
        setError(new Error('Report not found or inaccessible'));
      } catch (err) {
        console.error('Error in useSharedReportData:', err);
        logSharedReportAccess(reportId, { 
          successful: false, 
          error: err instanceof Error ? err.message : String(err)
        });
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId]);

  return { report, loading, error, verified };
};
