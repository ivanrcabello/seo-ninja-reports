
// Core crawler functionality using Playwright for Deno
import { SupabaseInstance, PageCrawlResult } from './types.ts';
import { registerCrawlerError } from './utils.ts';
import { processHtml } from './modules/html-processor.ts';
import { simplifiedAnalysis } from './modules/simplified-analysis.ts';
import { PlaywrightBrowser, PlaywrightPage } from './modules/playwright-browser.ts';

// Main crawl function that uses Playwright for browser automation
export async function crawlPage(supabase: SupabaseInstance, url: string, crawlId: string): Promise<PageCrawlResult | null> {
  console.log(`Iniciando análisis de página con Playwright: ${url}`);
  
  let browser = null;
  let page = null;
  
  try {
    // Initialize Playwright browser with robust error handling
    try {
      browser = await PlaywrightBrowser.launch();
      // Use our custom method to create a new page with default settings
      page = await PlaywrightBrowser.newPage(browser);
    } catch (browserError) {
      console.error(`Error inicializando Playwright: ${browserError.message}`);
      await registerCrawlerError(
        supabase, 
        crawlId, 
        url, 
        `Error inicializando navegador: ${browserError.message}`
      );
      return await simplifiedAnalysis(supabase, url, crawlId);
    }
    
    console.log(`Navegando a: ${url}`);
    
    // Navigate to URL with timeout and wait for content to load
    const response = await page.goto(url, { 
      timeout: 30000, 
      waitUntil: 'networkidle' 
    });
    
    // Check if navigation failed
    if (!response) {
      console.error(`No se pudo acceder a ${url} - No hay respuesta`);
      await registerCrawlerError(
        supabase, 
        crawlId, 
        url, 
        "No se recibió respuesta al navegar a la URL"
      );
      return await simplifiedAnalysis(supabase, url, crawlId);
    }
    
    const status = response.status();
    console.log(`Respuesta recibida. Status code: ${status}`);
    
    // Check for error status codes
    if (status >= 400) {
      console.error(`Error al acceder a ${url} - Status code: ${status}`);
      await registerCrawlerError(
        supabase, 
        crawlId, 
        url, 
        `Error HTTP: ${status}`
      );
      return await simplifiedAnalysis(supabase, url, crawlId);
    }
    
    // Get page content type
    const contentType = response.headers()['content-type'] || '';
    console.log(`Content type: ${contentType}`);
    
    // Skip non-HTML content
    if (!contentType.includes('text/html')) {
      console.log(`Saltando contenido no HTML: ${contentType}`);
      await registerCrawlerError(
        supabase, 
        crawlId, 
        url, 
        `Contenido no es HTML: ${contentType}`
      );
      return await simplifiedAnalysis(supabase, url, crawlId);
    }
    
    // Extract HTML content
    console.log('Obteniendo contenido HTML...');
    const html = await page.content();
    
    if (!html || html.trim().length === 0) {
      throw new Error("La respuesta HTML está vacía");
    }
    
    console.log(`Contenido HTML obtenido (${html.length} bytes)`);
    
    // Process HTML content
    return await processHtml(supabase, url, crawlId, html);
    
  } catch (error) {
    // Handle errors during crawling
    console.error(`Error en el crawling de ${url}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    
    // Register the error in the database
    try {
      await registerCrawlerError(supabase, crawlId, url, errorMessage);
      console.log("Error de crawling registrado correctamente");
    } catch (dbError) {
      console.error("No se pudo registrar el error en la base de datos:", dbError);
    }
    
    // Use simplified analysis as fallback
    return await simplifiedAnalysis(supabase, url, crawlId);
  } finally {
    // Close browser resources
    if (page) {
      try {
        await page.close();
      } catch (e) {
        console.error("Error cerrando la página:", e);
      }
    }
    if (browser) {
      try {
        await browser.close();
      } catch (e) {
        console.error("Error cerrando el navegador:", e);
      }
    }
  }
}
