
import { supabase } from '@/integrations/supabase/client';

export const logSharedReportAccess = async (reportId: string, accessInfo: {
  successful?: boolean;
  passwordAttempt?: boolean;
  error?: string;
}) => {
  try {
    // Currently just logs to console, but could be expanded to log to a database table
    console.info(`Report access attempt: ${reportId}`, accessInfo);
  } catch (error) {
    console.error('Failed to log report access:', error);
  }
};

export const logSharedProposalAccess = async (proposalId: string, accessInfo: {
  successful?: boolean;
  passwordAttempt?: boolean;
  error?: string;
}) => {
  try {
    console.info(`Proposal access attempt: ${proposalId}`, accessInfo);
  } catch (error) {
    console.error('Failed to log proposal access:', error);
  }
};

export const logSharedInvoiceAccess = async (invoiceId: string, accessInfo: {
  successful?: boolean;
  passwordAttempt?: boolean;
  error?: string;
}) => {
  try {
    console.info(`Invoice access attempt: ${invoiceId}`, accessInfo);
  } catch (error) {
    console.error('Failed to log invoice access:', error);
  }
};

export const logSharedContractAccess = async (contractId: string, accessInfo: {
  successful?: boolean;
  passwordAttempt?: boolean;
  error?: string;
}) => {
  try {
    console.info(`Contract access attempt: ${contractId}`, accessInfo);
  } catch (error) {
    console.error('Failed to log contract access:', error);
  }
};

export default {
  logSharedReportAccess,
  logSharedProposalAccess,
  logSharedInvoiceAccess,
  logSharedContractAccess
};
