
// Playwright for Deno integration
import { Browser, Page } from 'https://esm.sh/playwright@1.39.0';
import { getChromium, getCustomArgs } from './chromium.ts';

// Class to manage Playwright browser instance
export class PlaywrightBrowser {
  static async launch(): Promise<Browser> {
    console.log('Launching Playwright browser in headless mode...');
    try {
      // Get chromium instance and custom arguments
      const chromium = getChromium();
      const customArgs = getCustomArgs();
      
      // Launch browser with optimized settings for Deno edge functions
      const browser = await chromium.launch({
        headless: true,
        args: customArgs,
        // Explicitly ignore all default arguments to avoid JSON imports
        ignoreAllDefaultArgs: true,
        // Add minimum required args manually
        executablePath: undefined, // Let Playwright find the executable
        timeout: 30000,
      });
      
      console.log('Browser launched successfully');
      return browser;
    } catch (error) {
      console.error('Error launching browser:', error);
      throw error;
    }
  }

  // Helper method to create a new page with basic settings
  static async newPage(browser: Browser): Promise<Page> {
    try {
      const page = await browser.newPage({
        viewport: {
          width: 1280,
          height: 800
        },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        bypassCSP: true,
        deviceScaleFactor: 1,
      });
      console.log('New page created successfully');
      return page;
    } catch (error) {
      console.error('Error creating new page:', error);
      throw error;
    }
  }
}

// Extended Page interface for better type checking
export interface PlaywrightPage extends Page {
  // Any additional methods or properties can be defined here
}
