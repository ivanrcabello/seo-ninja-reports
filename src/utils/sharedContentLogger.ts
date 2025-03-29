
/**
 * Logger utility for shared content access
 * This helps debug issues with client portal and shared content
 */

const logStyles = {
  error: 'background: #f44336; color: white; padding: 2px 4px; border-radius: 2px;',
  warn: 'background: #ff9800; color: white; padding: 2px 4px; border-radius: 2px;',
  info: 'background: #2196f3; color: white; padding: 2px 4px; border-radius: 2px;',
  success: 'background: #4caf50; color: white; padding: 2px 4px; border-radius: 2px;',
  debug: 'background: #9e9e9e; color: white; padding: 2px 4px; border-radius: 2px;',
};

class SharedContentLogger {
  private enabled: boolean;
  
  constructor() {
    this.enabled = process.env.NODE_ENV === 'development' || localStorage.getItem('ENABLE_SHARED_CONTENT_LOGS') === 'true';
  }
  
  enable() {
    this.enabled = true;
    localStorage.setItem('ENABLE_SHARED_CONTENT_LOGS', 'true');
    console.log('%c[SharedContentLogger] Logging enabled', logStyles.success);
  }
  
  disable() {
    this.enabled = false;
    localStorage.removeItem('ENABLE_SHARED_CONTENT_LOGS');
    console.log('%c[SharedContentLogger] Logging disabled', logStyles.warn);
  }
  
  error(message: string, data?: any, context?: string) {
    if (!this.enabled) return;
    
    const contextStr = context ? ` [${context}]` : '';
    console.error(`%c[ERROR${contextStr}]%c ${message}`, logStyles.error, '', data || '');
  }
  
  warn(message: string, data?: any, context?: string) {
    if (!this.enabled) return;
    
    const contextStr = context ? ` [${context}]` : '';
    console.warn(`%c[WARN${contextStr}]%c ${message}`, logStyles.warn, '', data || '');
  }
  
  info(message: string, data?: any, context?: string) {
    if (!this.enabled) return;
    
    const contextStr = context ? ` [${context}]` : '';
    console.info(`%c[INFO${contextStr}]%c ${message}`, logStyles.info, '', data || '');
  }
  
  success(message: string, data?: any, context?: string) {
    if (!this.enabled) return;
    
    const contextStr = context ? ` [${context}]` : '';
    console.log(`%c[SUCCESS${contextStr}]%c ${message}`, logStyles.success, '', data || '');
  }
  
  debug(message: string, data?: any, context?: string) {
    if (!this.enabled) return;
    
    const contextStr = context ? ` [${context}]` : '';
    console.log(`%c[DEBUG${contextStr}]%c ${message}`, logStyles.debug, '', data || '');
  }
}

const sharedContentLogger = new SharedContentLogger();
export default sharedContentLogger;
