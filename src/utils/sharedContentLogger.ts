
// Create a logger specifically for shared content components

const sharedContentLogger = {
  log: (message: string, data?: any) => {
    console.log(`[Shared Content] ${message}`, data || '');
  },
  
  error: (message: string, data?: any) => {
    console.error(`[Shared Content Error] ${message}`, data || '');
  },
  
  info: (message: string, data?: any) => {
    console.info(`[Shared Content Info] ${message}`, data || '');
  },
  
  warn: (message: string, data?: any) => {
    console.warn(`[Shared Content Warning] ${message}`, data || '');
  }
};

export default sharedContentLogger;
