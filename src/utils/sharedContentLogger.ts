
import { supabase } from '@/integrations/supabase/client';

// Renamed to avoid conflicts with the one in sharedReportLogger.ts
interface SharedAccessLogOptions {
  successful: boolean;
  passwordAttempt?: boolean;
  error?: string;
  source?: string;
}

/**
 * Log access to shared reports
 */
export const logSharedReportAccess = (reportId: string, options: SharedAccessLogOptions): void => {
  try {
    console.log(`Report access log: ${reportId}`, options);
    
    // Add analytics logging here in the future if needed
    // For now, just console logging for debugging
    
  } catch (error) {
    console.error('Error logging shared report access:', error);
  }
};

/**
 * Log access to shared proposals
 */
export const logSharedProposalAccess = (proposalId: string, options: SharedAccessLogOptions): void => {
  try {
    console.log(`Proposal access log: ${proposalId}`, options);
    
    // Add analytics logging here in the future if needed
    
  } catch (error) {
    console.error('Error logging shared proposal access:', error);
  }
};

/**
 * Log access to shared invoices
 */
export const logSharedInvoiceAccess = (invoiceId: string, options: SharedAccessLogOptions): void => {
  try {
    console.log(`Invoice access log: ${invoiceId}`, options);
    
    // Add analytics logging here in the future if needed
    
  } catch (error) {
    console.error('Error logging shared invoice access:', error);
  }
};

/**
 * Log access to shared contracts
 */
export const logSharedContractAccess = (contractId: string, options: SharedAccessLogOptions): void => {
  try {
    console.log(`Contract access log: ${contractId}`, options);
    
    // Add analytics logging here in the future if needed
    
  } catch (error) {
    console.error('Error logging shared contract access:', error);
  }
};
