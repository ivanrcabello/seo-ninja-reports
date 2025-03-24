
// Playwright for Deno integration
import { Browser, Page } from 'https://esm.sh/playwright@1.39.0';
import { chromium } from 'https://esm.sh/playwright@1.39.0/chromium';

// Class to manage Playwright browser instance
export class PlaywrightBrowser {
  static async launch(): Promise<Browser> {
    console.log('Launching Playwright browser in headless mode...');
    try {
      // Launch browser with optimized settings for Deno edge functions
      const browser = await chromium.launch({
        headless: true,
        args: [
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-setuid-sandbox',
          '--no-sandbox',
        ],
        // Use direct imports to avoid issues with JSON imports
        // Explicitly disable device descriptors to avoid JSON import errors
        ignoreDefaultArgs: ['--enable-automation'],
        timeout: 30000,
      });
      
      console.log('Browser launched successfully');
      return browser;
    } catch (error) {
      console.error('Error launching browser:', error);
      throw error;
    }
  }
}

// Extended Page interface for better type checking
export interface PlaywrightPage extends Page {
  // Any additional methods or properties can be defined here
}
