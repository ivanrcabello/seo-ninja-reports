
// Configuration settings for the SEO crawler

export const BRIGHT_DATA_CONFIG = {
  PROXY_HOST: 'brd.superproxy.io',
  PROXY_PORT: '22225',
  DEFAULT_USER: 'brd-customer-hl_2a8d2c33-zone-web_unlocker',
  DEFAULT_PASSWORD: 'obz0lal9qh4g',
  DEFAULT_API_KEY: ''  // Will be overridden by environment variable or request parameter
};

export const CRAWLER_CONFIG = {
  USER_AGENT: 'Mozilla/5.0 (compatible; SeoAuditBot/1.0)',
  MAX_CONNECTIONS: 5,
  TIMEOUT_MS: 30000,
  RETRY_COUNT: 3,
  RETRY_DELAY_MS: 2000
};
