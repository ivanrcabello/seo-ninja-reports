
import { logSharedReportAccess as originalLogSharedReportAccess } from '@/utils/sharedContentLogger';
import { AccessLogOptions } from '../utils/reportDataUtils';

/**
 * Log shared report access with additional context
 */
export function logSharedReportAccess(
  reportId: string,
  options: AccessLogOptions,
  source?: string
): void {
  try {
    // Add source to the options if provided
    const enrichedOptions = source ? { ...options, source } : options;
    originalLogSharedReportAccess(reportId, enrichedOptions);
  } catch (error) {
    console.error('Error logging shared report access:', error);
    // Fail silently to ensure this doesn't break the main functionality
  }
}
