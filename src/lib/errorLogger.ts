
/**
 * Utility function to log errors to the console in a structured way
 */
export function logError(context: string, error: unknown, additionalInfo?: Record<string, any>) {
  console.error(`[ERROR] ${context}:`, error);
  
  if (additionalInfo) {
    console.error('Additional info:', additionalInfo);
  }
  
  // If the error is an actual Error object, log its stack trace
  if (error instanceof Error) {
    console.error('Stack trace:', error.stack);
  }
}

/**
 * Utility function for debugging
 */
export function debugLog(context: string, ...data: any[]) {
  console.log(`[DEBUG] ${context}:`, ...data);
}
