
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
        // Completely avoid device descriptors and other problematic imports
        ignoreDefaultArgs: [
          '--enable-automation',
          '--use-mock-keychain',
          // Add any other args that might be causing issues
        ],
        // Disable all extensions and other features that might cause problems
        ignoreAllDefaultArgs: false,
        timeout: 30000,
      });
      
      console.log('Browser launched successfully');
      return browser;
    } catch (error) {
      console.error('Error launching browser:', error);
      throw error;
    }
  }

  // Helper method to create a new page with default viewport settings
  static async newPage(browser: Browser): Promise<Page> {
    try {
      const page = await browser.newPage({
        viewport: {
          width: 1280,
          height: 800
        },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        // Bypass common browser detection mechanisms
        bypassCSP: true,
        // Avoid other JSON imports that might be problematic
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
