
// Additional configuration for Chromium browser
import { chromium } from 'https://esm.sh/playwright@1.39.0/chromium';

// Configure Chromium with specific settings to avoid JSON import issues
export const getChromium = () => {
  // Return the pre-configured chromium instance
  return chromium;
};

// Additional browser helper functions can be added here
export const getCustomArgs = () => {
  return [
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--disable-setuid-sandbox',
    '--no-sandbox',
  ];
};
