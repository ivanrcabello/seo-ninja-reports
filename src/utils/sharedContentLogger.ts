
import { supabase } from '@/integrations/supabase/client';

interface LogOptions {
  successful: boolean;
  error?: string;
  action?: string;
  passwordAttempt?: boolean;
  source?: string;
}

type AccessType = 'view' | 'page_view' | 'password' | 'download' | 'print' | 'not_found' | 'error';

export const logSharedReportAccess = async (
  reportId: string, 
  options: LogOptions = { successful: true },
  type: AccessType = 'view'
): Promise<void> => {
  try {
    await supabase.from('shared_content_access_logs').insert({
      content_type: 'report',
      content_id: reportId,
      access_type: options.action || type,
      successful: options.successful,
      error_message: options.error,
      password_attempt: options.passwordAttempt || false,
      source: options.source || 'web_client'
    });
  } catch (error) {
    console.error('Error logging shared report access:', error);
    // No propagamos el error para no interrumpir la experiencia del usuario
  }
};

export const logSharedContractAccess = async (
  contractId: string, 
  options: LogOptions = { successful: true },
  type: AccessType = 'view'
): Promise<void> => {
  try {
    await supabase.from('shared_content_access_logs').insert({
      content_type: 'contract',
      content_id: contractId,
      access_type: options.action || type,
      successful: options.successful,
      error_message: options.error,
      password_attempt: options.passwordAttempt || false,
      source: options.source || 'web_client'
    });
  } catch (error) {
    console.error('Error logging shared contract access:', error);
  }
};

export const logSharedProposalAccess = async (
  proposalId: string, 
  options: LogOptions = { successful: true },
  type: AccessType = 'view'
): Promise<void> => {
  try {
    await supabase.from('shared_content_access_logs').insert({
      content_type: 'proposal',
      content_id: proposalId,
      access_type: options.action || type,
      successful: options.successful,
      error_message: options.error,
      password_attempt: options.passwordAttempt || false,
      source: options.source || 'web_client'
    });
  } catch (error) {
    console.error('Error logging shared proposal access:', error);
  }
};

export const logSharedInvoiceAccess = async (
  invoiceId: string, 
  options: LogOptions = { successful: true },
  type: AccessType = 'view'
): Promise<void> => {
  try {
    await supabase.from('shared_content_access_logs').insert({
      content_type: 'invoice',
      content_id: invoiceId,
      access_type: options.action || type,
      successful: options.successful,
      error_message: options.error,
      password_attempt: options.passwordAttempt || false,
      source: options.source || 'web_client'
    });
  } catch (error) {
    console.error('Error logging shared invoice access:', error);
  }
};
