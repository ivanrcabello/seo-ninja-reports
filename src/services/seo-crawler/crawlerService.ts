
import { startCrawl, getCrawlResults, getCrawlPages, getPageIssues, getPageLinks } from './api';
import { saveSettings, getSettings } from './settingsService';
import { toast } from 'sonner';

// Start a new crawl
export const startCrawlService = async (url: string, clientId: string) => {
  try {
    // Get Bright Data credentials from localStorage
    const brightDataUsername = localStorage.getItem('brightDataUsername') || undefined;
    const brightDataPassword = localStorage.getItem('brightDataPassword') || undefined;
    
    if (brightDataUsername && brightDataPassword) {
      console.log(`Using custom Bright Data credentials: ${brightDataUsername.substring(0, 10)}...`);
    } else {
      console.log('Using default Bright Data credentials');
    }
    
    toast.info('Iniciando análisis SEO...');
    
    // Process URL - remove protocol if exists
    let processedUrl = url;
    if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      processedUrl = 'https://' + processedUrl;
    }
    
    // First, save the crawl settings
    await saveSettings({
      clientId,
      url: processedUrl,
      maxPages: 100, // Default value
      followExternalLinks: false // Default value
    });
    
    // Then, start the crawl
    const result = await startCrawl(
      processedUrl, 
      clientId, 
      brightDataUsername, 
      brightDataPassword
    );
    
    return result;
  } catch (error) {
    console.error('Error starting SEO crawl:', error);
    toast.error('Error al iniciar el análisis SEO');
    throw error;
  }
};

// Get crawl data
export const getCrawlData = async (crawlId: string) => {
  try {
    const crawl = await getCrawlResults(crawlId);
    const pages = await getCrawlPages(crawlId);
    
    // Get issues for each page
    const pagesWithIssues = await Promise.all(
      pages.map(async (page) => {
        const issues = await getPageIssues(page.id);
        return {
          ...page,
          issues
        };
      })
    );
    
    return {
      crawl,
      pages: pagesWithIssues
    };
  } catch (error) {
    console.error('Error retrieving crawl data:', error);
    throw error;
  }
};

// Get a single page with its issues and links
export const getPageData = async (pageId: string) => {
  try {
    const pages = await getCrawlPages('');
    const page = pages.find(p => p.id === pageId);
    
    if (!page) {
      throw new Error('Page not found');
    }
    
    const issues = await getPageIssues(pageId);
    const links = await getPageLinks(pageId);
    
    return {
      page,
      issues,
      links
    };
  } catch (error) {
    console.error('Error retrieving page data:', error);
    throw error;
  }
};
