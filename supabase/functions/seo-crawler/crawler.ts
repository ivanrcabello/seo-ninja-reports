
// Core crawler functionality with simplified approach (no Playwright)
import { SupabaseInstance, PageCrawlResult } from './types.ts';
import { registerCrawlerError } from './utils.ts';
import { processHtml } from './modules/html-processor.ts';
import { simplifiedAnalysis } from './modules/simplified-analysis.ts';

// Main crawl function using simplified fetch approach instead of Playwright
export async function crawlPage(supabase: SupabaseInstance, url: string, crawlId: string): Promise<PageCrawlResult | null> {
  console.log(`Iniciando análisis de página con método simplificado: ${url}`);
  
  try {
    // Use fetch API instead of Playwright
    console.log(`Navegando a: ${url}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    try {
      const response = await fetch(url, { 
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.error(`Error al acceder a ${url} - Status code: ${response.status}`);
        await registerCrawlerError(
          supabase, 
          crawlId, 
          url, 
          `Error HTTP: ${response.status}`
        );
        return await simplifiedAnalysis(supabase, url, crawlId);
      }
      
      // Get content type
      const contentType = response.headers.get('content-type') || '';
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
      const html = await response.text();
      
      if (!html || html.trim().length === 0) {
        throw new Error("La respuesta HTML está vacía");
      }
      
      console.log(`Contenido HTML obtenido (${html.length} bytes)`);
      
      // Process HTML content
      return await processHtml(supabase, url, crawlId, html);
      
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error(`Error en fetch para ${url}:`, fetchError);
      throw fetchError;
    }
    
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
  }
}
