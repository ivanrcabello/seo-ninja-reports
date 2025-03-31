
import { logSharedReportAccess as originalLogAccess } from '@/utils/sharedContentLogger';

/**
 * Wrapper for logging shared report access
 */
export const logSharedReportAccess = (
  reportId: string, 
  options: {
    successful: boolean;
    passwordAttempt?: boolean;
    error?: string;
    action?: string;
  }, 
  eventType: string = 'access'
) => {
  return originalLogAccess(reportId, options, eventType);
};
