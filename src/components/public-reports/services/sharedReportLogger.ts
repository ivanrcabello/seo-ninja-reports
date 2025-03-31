
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
    source?: string;
  }, 
  eventType: string = 'access'
) => {
  try {
    const logData = {
      contentId: reportId,
      contentType: 'report',
      eventType: options.action || eventType,
      isSuccessful: options.successful,
      isPasswordAttempt: options.passwordAttempt || false,
      errorMessage: options.error,
      source: options.source || 'direct_access',
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };
    
    // Log to console for debugging
    console.log('Report access log:', logData);
    
    // Store in localStorage for debugging
    try {
      const existingLogs = JSON.parse(localStorage.getItem('report_access_logs') || '[]');
      existingLogs.push(logData);
      localStorage.setItem('report_access_logs', JSON.stringify(existingLogs));
    } catch (storageError) {
      console.error('Could not save log to localStorage:', storageError);
    }
    
    return { data: true, error: null };
  } catch (err) {
    console.error('Exception logging shared report access:', err);
    return { data: null, error: err };
  }
};
