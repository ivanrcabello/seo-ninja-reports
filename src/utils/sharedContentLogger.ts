
/**
 * Utility for logging shared content related operations with consistent formatting
 */

const DEBUG_MODE = true; // Set to false in production

type LogLevel = 'info' | 'warning' | 'error' | 'success';

const sharedContentLogger = {
  /**
   * Log an informational message
   */
  info: (message: string, data?: any) => {
    if (!DEBUG_MODE) return;
    console.log(`%c[SHARED CONTENT] ${message}`, 'color: #3b82f6', data || '');
  },

  /**
   * Log a warning message
   */
  warning: (message: string, data?: any) => {
    if (!DEBUG_MODE) return;
    console.warn(`%c[SHARED CONTENT] ${message}`, 'color: #f59e0b', data || '');
  },

  /**
   * Log an error message
   */
  error: (message: string, error?: any) => {
    if (!DEBUG_MODE) return;
    console.error(
      `%c[SHARED CONTENT] ${message}`, 
      'color: #ef4444; font-weight: bold', 
      error || ''
    );
  },

  /**
   * Log a success message
   */
  success: (message: string, data?: any) => {
    if (!DEBUG_MODE) return;
    console.log(`%c[SHARED CONTENT] ${message}`, 'color: #10b981', data || '');
  },

  /**
   * Log data as a table for better visualization
   */
  table: (data: any, title?: string) => {
    if (!DEBUG_MODE) return;
    if (title) {
      console.log(`%c[SHARED CONTENT] ${title}`, 'color: #3b82f6');
    }
    console.table(data);
  },

  /**
   * Create a labeled group of logs
   */
  group: (label: string, collapsed: boolean = false) => {
    if (!DEBUG_MODE) return;
    if (collapsed) {
      console.groupCollapsed(`%c[SHARED CONTENT] ${label}`, 'color: #3b82f6; font-weight: bold');
    } else {
      console.group(`%c[SHARED CONTENT] ${label}`, 'color: #3b82f6; font-weight: bold');
    }
  },

  /**
   * End the current log group
   */
  groupEnd: () => {
    if (!DEBUG_MODE) return;
    console.groupEnd();
  },

  /**
   * Start timing a process
   */
  timeStart: (label: string) => {
    if (!DEBUG_MODE) return;
    console.time(`[SHARED CONTENT] ${label}`);
  },

  /**
   * End timing and display the result
   */
  timeEnd: (label: string) => {
    if (!DEBUG_MODE) return;
    console.timeEnd(`[SHARED CONTENT] ${label}`);
  }
};

export default sharedContentLogger;
