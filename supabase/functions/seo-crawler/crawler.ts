
// Main crawler implementation
import { SupabaseInstance, PageCrawlResult } from './types.ts';
import { BRIGHT_DATA_CONFIG, SEO_ISSUES } from './constants.ts';
import { isInternalUrl, queueLinksForCrawling, registerCrawlerError, normalizeUrl } from './utils.ts';
import { processHtml } from './modules/html-processor.ts';

// Main crawler function - crawl a single page using Bright Data's Web Scraper API
export async function crawlPage(
  supabase: SupabaseInstance, 
  url: string, 
  crawlId: string,
  customUsername?: string,
  customPassword?: string
): Promise<PageCrawlResult | null> {
  try {
    console.log(`Iniciando análisis de página: ${url}`);
    const startTime = Date.now();
    
    // Use Bright Data proxy or API credentials
    const username = customUsername || Deno.env.get('BRIGHT_DATA_USERNAME') || BRIGHT_DATA_CONFIG.DEFAULT_USER;
    const password = customPassword || Deno.env.get('BRIGHT_DATA_PASSWORD') || BRIGHT_DATA_CONFIG.DEFAULT_PASSWORD;
    
    console.log(`Usando credenciales: ${username.substring(0, 15)}... (${username.length} caracteres)`);
    
    // Normalize the URL
    const normalizedUrl = normalizeUrl(url);
    console.log(`URL normalizada: ${normalizedUrl}`);
    
    try {
      // Use Bright Data's API to fetch the page
      console.log(`Llamando a la API de Bright Data para analizar: ${normalizedUrl}`);
      
      // Bright Data API endpoint
      const apiEndpoint = 'https://api.brightdata.com/request';
      
      const apiRequestBody = {
        zone: 'web_unlocker1',
        url: normalizedUrl,
        format: 'json'
      };
      
      const apiRequestHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${password}` // Using password as API key
      };
      
      console.log('Enviando solicitud a Bright Data API...');
      console.log(`Endpoint: ${apiEndpoint}`);
      console.log(`Body: ${JSON.stringify(apiRequestBody)}`);
      
      // Make the actual request to Bright Data API
      const scrapeResponse = await fetch(apiEndpoint, {
        method: 'POST',
        headers: apiRequestHeaders,
        body: JSON.stringify(apiRequestBody),
        signal: AbortSignal.timeout(BRIGHT_DATA_CONFIG.TIMEOUT)
      });
      
      console.log(`Respuesta recibida: status ${scrapeResponse.status}`);
      
      if (!scrapeResponse.ok) {
        const errorText = await scrapeResponse.text();
        console.error(`Error HTTP: ${scrapeResponse.status}, Respuesta: ${errorText}`);
        throw new Error(`HTTP error! Status: ${scrapeResponse.status}, Respuesta: ${errorText}`);
      }
      
      // Parse the JSON response from Bright Data
      const responseData = await scrapeResponse.json();
      console.log(`Respuesta JSON recibida: ${JSON.stringify(responseData).substring(0, 200)}...`);
      
      // Check if response contains HTML content
      let html = '';
      if (responseData.body) {
        html = typeof responseData.body === 'string' ? responseData.body : JSON.stringify(responseData.body);
      } else if (typeof responseData === 'string') {
        html = responseData;
      } else {
        html = JSON.stringify(responseData);
      }
      
      if (!html || html.length === 0) {
        throw new Error('No se recibió contenido HTML válido');
      }
      
      console.log(`Contenido HTML recibido: ${html.length} caracteres`);
      
      // Process the HTML content using our HTML processor module
      const pageResult = await processHtml(supabase, normalizedUrl, crawlId, html);
      
      const endTime = Date.now();
      console.log(`Análisis completado en ${(endTime - startTime) / 1000} segundos`);
      
      if (pageResult) {
        console.log(`Encontrados ${pageResult.issues} problemas SEO`);
      }
      
      return pageResult;
      
    } catch (fetchError) {
      console.error(`Error al obtener la página desde Bright Data: ${fetchError}`);
      console.error(`Stack trace: ${fetchError instanceof Error ? fetchError.stack : 'No stack trace'}`);
      await registerCrawlerError(supabase, crawlId, url, fetchError instanceof Error ? fetchError.message : 'Error desconocido en la API de Bright Data');
      return null;
    }
    
  } catch (error) {
    console.error(`Error general analizando página ${url}:`, error);
    await registerCrawlerError(supabase, crawlId, url, error instanceof Error ? error.message : String(error));
    return null;
  }
}
