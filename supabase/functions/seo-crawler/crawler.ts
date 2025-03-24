
// Core crawler functionality - refactored to use modules
import { SupabaseInstance, PageCrawlResult } from './types.ts';
import { registerCrawlerError } from './utils.ts';
import { processHtml } from './modules/html-processor.ts';
import { simplifiedAnalysis } from './modules/simplified-analysis.ts';

// Main crawl function that focuses on reliability
export async function crawlPage(supabase: SupabaseInstance, url: string, crawlId: string): Promise<PageCrawlResult | null> {
  console.log(`Iniciando análisis de página: ${url}`);
  
  try {
    // More detailed logging to help diagnose issues
    console.log(`Realizando fetch de: ${url}`);
    
    try {
      // Enhanced fetch with multiple user agents to bypass some restrictions
      const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
        'SEO-Crawler/1.0 (compatible; +https://example.com/bot)'
      ];
      
      // Try with different user agents
      let response = null;
      let errorMessage = "";
      
      for (const agent of userAgents) {
        try {
          console.log(`Intentando con User-Agent: ${agent}`);
          
          response = await fetch(url, {
            headers: { 
              'User-Agent': agent,
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.5'
            },
            redirect: 'follow',
            signal: AbortSignal.timeout(20000) // 20 second timeout - reduced to avoid long waits
          });
          
          if (response.ok) {
            console.log(`Éxito con User-Agent: ${agent}`);
            break;
          } else {
            errorMessage = `Error HTTP: ${response.status} ${response.statusText}`;
            console.log(`Fallo con User-Agent ${agent}: ${errorMessage}`);
          }
        } catch (e) {
          errorMessage = e instanceof Error ? e.message : "Error desconocido";
          console.log(`Excepción con User-Agent ${agent}: ${errorMessage}`);
        }
      }
      
      // If we couldn't get a successful response with any user agent
      if (!response || !response.ok) {
        console.log("Todos los intentos fallaron. Utilizando método alternativo...");
        
        // Register the error but continue with alternative approach
        await registerCrawlerError(
          supabase, 
          crawlId, 
          url, 
          `No se pudo acceder a la URL después de múltiples intentos: ${errorMessage}`
        );
        
        // Use alternative approach - simplified analysis with just the URL
        return await simplifiedAnalysis(supabase, url, crawlId);
      }
      
      console.log(`Respuesta recibida. Status code: ${response.status}, Status text: ${response.statusText}`);
      
      // Log response headers for debugging
      const headers = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });
      console.log('Response headers:', JSON.stringify(headers, null, 2));
      
      // Get content type
      const contentType = response.headers.get('content-type') || '';
      console.log(`Content type: ${contentType}`);
      
      // Skip non-HTML content
      if (!contentType.includes('text/html')) {
        console.log(`Saltando contenido no HTML: ${contentType}`);
        
        // Registrar este problema como un error específico
        await registerCrawlerError(
          supabase, 
          crawlId, 
          url, 
          `Contenido no es HTML: ${contentType}`
        );
        
        return await simplifiedAnalysis(supabase, url, crawlId);
      }
      
      // Get content
      console.log('Obteniendo contenido HTML...');
      const html = await response.text();
      
      if (!html || html.trim().length === 0) {
        throw new Error("La respuesta HTML está vacía");
      }
      
      console.log(`Contenido HTML obtenido (${html.length} bytes)`);
      
      // Add a sample of the HTML for debugging
      console.log('Primeros 500 caracteres del HTML:', html.substring(0, 500));
      
      // Process HTML content
      return await processHtml(supabase, url, crawlId, html);
      
    } catch (fetchError) {
      // Capturar específicamente errores de fetch con más detalles
      console.error(`Error en la solicitud HTTP para ${url}:`, fetchError);
      
      // Log more specific error information
      let errorMessage = "Error desconocido en fetch";
      
      if (fetchError instanceof TypeError && fetchError.message.includes('abort')) {
        errorMessage = "La solicitud se abortó por timeout";
      } else if (fetchError instanceof TypeError && fetchError.message.includes('failed')) {
        errorMessage = "Fallo de red en la conexión";
      } else if (fetchError instanceof Error) {
        errorMessage = fetchError.message;
      }
      
      // Register the specific error
      await registerCrawlerError(supabase, crawlId, url, errorMessage);
      
      // Try simplified analysis as fallback
      return await simplifiedAnalysis(supabase, url, crawlId);
    }
    
  } catch (error) {
    // Error general durante el análisis
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error(`Error analizando página ${url}:`, errorMessage);
    
    // Try to register the error in the database
    try {
      await registerCrawlerError(supabase, crawlId, url, errorMessage);
      console.log("Error registrado en la base de datos");
    } catch (dbError) {
      console.error("No se pudo registrar el error en la base de datos:", dbError);
    }
    
    // Try simplified analysis as last resort
    return await simplifiedAnalysis(supabase, url, crawlId);
  }
}
