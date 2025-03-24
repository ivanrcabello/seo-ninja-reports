
// Core crawler functionality with Bright Data API
import { SupabaseInstance, PageCrawlResult, BrightDataResponse } from './types.ts';
import { registerCrawlerError } from './utils.ts';
import { processHtml } from './modules/html-processor.ts';
import { simplifiedAnalysis } from './modules/simplified-analysis.ts';
import { BRIGHT_DATA_CONFIG } from './constants.ts';

// Main crawl function using Bright Data API
export async function crawlPage(supabase: SupabaseInstance, url: string, crawlId: string): Promise<PageCrawlResult | null> {
  console.log(`Iniciando análisis de página con Bright Data: ${url}`);
  
  try {
    // Get the Bright Data credentials
    const customerId = Deno.env.get('BRIGHT_DATA_CUSTOMER_ID');
    const apiKey = Deno.env.get('BRIGHT_DATA_API_KEY');

    console.log(`Usando proxy Bright Data para acceder a URL: ${url}`);
    
    // Call Bright Data API to get HTML content using proxy method
    const brightDataResponse = await fetchWithBrightDataProxy(url);
    
    // Check if the request was successful
    if (!brightDataResponse || brightDataResponse.status !== 200 || !brightDataResponse.body) {
      const errorMessage = brightDataResponse?.error || `Error en Bright Data: estado ${brightDataResponse?.status || 'desconocido'}`;
      console.error(`Error al acceder a ${url} con Bright Data - ${errorMessage}`);
      
      await registerCrawlerError(
        supabase, 
        crawlId, 
        url, 
        `Error en Bright Data: ${errorMessage}`
      );
      
      console.log('Intentando análisis simplificado como fallback...');
      return await simplifiedAnalysis(supabase, url, crawlId);
    }
    
    const html = brightDataResponse.body;
    
    if (!html || html.trim().length === 0) {
      console.error("La respuesta HTML está vacía");
      throw new Error("La respuesta HTML está vacía");
    }
    
    console.log(`Contenido HTML obtenido de Bright Data (${html.length} bytes)`);
    console.log('Muestra del HTML:', html.substring(0, 200) + '...');
    
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
    console.log('Intentando análisis simplificado después de error...');
    return await simplifiedAnalysis(supabase, url, crawlId);
  }
}

// Helper function to fetch URL with Bright Data using proxy method
async function fetchWithBrightDataProxy(url: string): Promise<BrightDataResponse> {
  try {
    console.log(`Preparando solicitud con proxy Bright Data para: ${url}`);
    
    // Usar las credenciales por defecto de la configuración si no existen en variables de entorno
    const customerId = Deno.env.get('BRIGHT_DATA_CUSTOMER_ID');
    const apiKey = Deno.env.get('BRIGHT_DATA_API_KEY');
    
    // Si hay credenciales en las variables de entorno, usarlas
    // Si no, usar las credenciales por defecto de la configuración
    let proxyAuth;
    
    if (customerId && apiKey) {
      // Formato con variables de entorno
      proxyAuth = `brd-customer-${customerId}:${apiKey}`;
      console.log(`Usando credenciales de variables de entorno para Bright Data`);
    } else {
      // Usar credenciales por defecto del curl proporcionado
      proxyAuth = `${BRIGHT_DATA_CONFIG.DEFAULT_USER}:${BRIGHT_DATA_CONFIG.DEFAULT_PASSWORD}`;
      console.log(`Usando credenciales por defecto para Bright Data: ${BRIGHT_DATA_CONFIG.DEFAULT_USER}`);
    }
    
    const proxyUrl = `http://${proxyAuth}@${BRIGHT_DATA_CONFIG.PROXY_HOST}:${BRIGHT_DATA_CONFIG.PROXY_PORT}`;
    
    console.log(`Conectando a proxy: ${BRIGHT_DATA_CONFIG.PROXY_HOST}:${BRIGHT_DATA_CONFIG.PROXY_PORT}`);
    
    // Create options for fetch request - con los mismos headers y opciones que en el curl
    const fetchOptions = {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(BRIGHT_DATA_CONFIG.TIMEOUT)
    };
    
    console.log('Opciones de solicitud:', JSON.stringify({
      method: fetchOptions.method,
      headers: fetchOptions.headers,
      redirect: fetchOptions.redirect,
      timeout: BRIGHT_DATA_CONFIG.TIMEOUT
    }, null, 2));
    
    console.log(`Realizando solicitud a ${url} a través del proxy...`);
    
    // Configurar el agente proxy de forma manual - sintaxis correcta para Deno
    const response = await fetch(url, {
      ...fetchOptions,
      agent: proxyUrl // En Deno, el formato es diferente
    });
    
    console.log(`Respuesta recibida con estado: ${response.status}`);
    
    // Get the response body as text
    const body = await response.text();
    console.log(`Respuesta recibida con tamaño: ${body.length} bytes`);
    
    // Return the response
    return {
      status: response.status,
      body: body,
      headers: Object.fromEntries(response.headers.entries()),
      url: url
    };
  } catch (error) {
    console.error(`Error en fetchWithBrightDataProxy para ${url}:`, error);
    
    // Mejorar manejo de errores analizando tipos específicos
    let errorMessage = 'Error desconocido';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error(`Error detallado: ${error.message}`);
      if (error.stack) {
        console.error(`Stack trace: ${error.stack}`);
      }
    } else {
      console.error('Error no estándar:', error);
    }
    
    return {
      status: 500,
      body: '',
      headers: {},
      error: errorMessage
    };
  }
}
