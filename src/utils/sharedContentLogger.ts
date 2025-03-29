
import { supabase } from '@/integrations/supabase/client';

interface LogParams {
  reportId?: string;
  proposalId?: string;
  invoiceId?: string;
  contractId?: string;
  action: string;
  status: 'success' | 'error' | 'failed';
  details?: string;
}

export const logSharedReportAccess = async (params: LogParams) => {
  try {
    const { data, error } = await supabase
      .from('shared_content_access_logs')
      .insert([{
        report_id: params.reportId,
        action: params.action,
        status: params.status,
        details: params.details || '',
        user_agent: navigator.userAgent,
        ip_address: null // Will be captured by server-side functions
      }]);
      
    if (error) {
      console.error('Error logging shared report access:', error);
    }
    
    return data;
  } catch (err) {
    console.error('Failed to log shared report access:', err);
    return null;
  }
};

export const logSharedProposalAccess = async (params: LogParams) => {
  try {
    const { data, error } = await supabase
      .from('shared_content_access_logs')
      .insert([{
        proposal_id: params.proposalId,
        action: params.action,
        status: params.status,
        details: params.details || '',
        user_agent: navigator.userAgent,
        ip_address: null
      }]);
      
    if (error) {
      console.error('Error logging shared proposal access:', error);
    }
    
    return data;
  } catch (err) {
    console.error('Failed to log shared proposal access:', err);
    return null;
  }
};

export const logSharedInvoiceAccess = async (params: LogParams) => {
  try {
    const { data, error } = await supabase
      .from('shared_content_access_logs')
      .insert([{
        invoice_id: params.invoiceId,
        action: params.action,
        status: params.status,
        details: params.details || '',
        user_agent: navigator.userAgent,
        ip_address: null
      }]);
      
    if (error) {
      console.error('Error logging shared invoice access:', error);
    }
    
    return data;
  } catch (err) {
    console.error('Failed to log shared invoice access:', err);
    return null;
  }
};

export const logSharedContractAccess = async (params: LogParams) => {
  try {
    const { data, error } = await supabase
      .from('shared_content_access_logs')
      .insert([{
        contract_id: params.contractId,
        action: params.action,
        status: params.status,
        details: params.details || '',
        user_agent: navigator.userAgent,
        ip_address: null
      }]);
      
    if (error) {
      console.error('Error logging shared contract access:', error);
    }
    
    return data;
  } catch (err) {
    console.error('Failed to log shared contract access:', err);
    return null;
  }
};
