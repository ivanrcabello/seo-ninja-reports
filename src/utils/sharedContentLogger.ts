
import { supabase } from '@/integrations/supabase/client';
import { AccessLogOptions, AccessLogType } from '@/types/shared-content';

/**
 * Logs access to shared reports
 */
export const logSharedReportAccess = async (
  reportId: string,
  options: AccessLogOptions,
  eventType: AccessLogType = 'view'
): Promise<void> => {
  try {
    await supabase.rpc('log_shared_content_access', {
      content_type: 'report',
      content_id: reportId,
      access_type: eventType,
      successful: options.successful,
      error_message: options.error || null,
      password_attempt: options.passwordAttempt || false,
      source: options.source || 'web_client'
    });
  } catch (error) {
    console.error('Error logging report access:', error);
    // Non-blocking error - we don't want to disrupt the user experience
    // if logging fails
  }
};

/**
 * Logs access to shared proposals
 */
export const logSharedProposalAccess = async (
  proposalId: string,
  options: AccessLogOptions,
  eventType: AccessLogType = 'view'
): Promise<void> => {
  try {
    await supabase.rpc('log_shared_content_access', {
      content_type: 'proposal',
      content_id: proposalId,
      access_type: eventType,
      successful: options.successful,
      error_message: options.error || null,
      password_attempt: options.passwordAttempt || false,
      source: options.source || 'web_client'
    });
  } catch (error) {
    console.error('Error logging proposal access:', error);
  }
};

/**
 * Logs access to shared invoices
 */
export const logSharedInvoiceAccess = async (
  invoiceId: string,
  options: AccessLogOptions,
  eventType: AccessLogType = 'view'
): Promise<void> => {
  try {
    await supabase.rpc('log_shared_content_access', {
      content_type: 'invoice',
      content_id: invoiceId,
      access_type: eventType,
      successful: options.successful,
      error_message: options.error || null,
      password_attempt: options.passwordAttempt || false,
      source: options.source || 'web_client'
    });
  } catch (error) {
    console.error('Error logging invoice access:', error);
  }
};

/**
 * Logs access to shared contracts
 */
export const logSharedContractAccess = async (
  contractId: string,
  options: AccessLogOptions,
  eventType: AccessLogType = 'view'
): Promise<void> => {
  try {
    await supabase.rpc('log_shared_content_access', {
      content_type: 'contract',
      content_id: contractId,
      access_type: eventType,
      successful: options.successful,
      error_message: options.error || null,
      password_attempt: options.passwordAttempt || false,
      source: options.source || 'web_client'
    });
  } catch (error) {
    console.error('Error logging contract access:', error);
  }
};
