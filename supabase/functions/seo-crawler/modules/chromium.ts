
// Custom configuration for Chromium browser
import { chromium } from 'https://esm.sh/playwright@1.39.0/chromium';

// Configure Chromium with specific settings to avoid JSON import issues
export const getChromium = () => {
  return chromium;
};

// Custom browser arguments to make Chromium work in Deno/edge environment
export const getCustomArgs = () => {
  return [
    // Disable unnecessary features
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--disable-setuid-sandbox',
    '--no-sandbox',
    
    // Essential flags for headless operation
    '--headless',
    '--hide-scrollbars',
    '--mute-audio',
    
    // Disable various features that might cause problems
    '--disable-background-networking',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-breakpad',
    '--disable-client-side-phishing-detection',
    '--disable-component-extensions-with-background-pages',
    '--disable-default-apps',
    '--disable-extensions',
    '--disable-features=TranslateUI',
    '--disable-hang-monitor',
    '--disable-ipc-flooding-protection',
    '--disable-popup-blocking',
    '--disable-prompt-on-repost',
    '--disable-renderer-backgrounding',
    '--disable-sync',
    '--force-color-profile=srgb',
    '--metrics-recording-only',
    '--no-first-run',
    '--enable-automation',
    '--password-store=basic',
    '--use-mock-keychain',
  ];
};
