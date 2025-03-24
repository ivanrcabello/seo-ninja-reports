
// Core crawler functionality with Bright Data API
import { SupabaseInstance, PageCrawlResult, BrightDataResponse, BrightDataRequestOptions } from './types.ts';
import { registerCrawlerError } from './utils.ts';
import { processHtml } from './modules/html-processor.ts';
import { simplifiedAnalysis } from './modules/simplified-analysis.ts';
import { BRIGHT_DATA_CONFIG } from './constants.ts';

// Main crawl function using Bright Data API
export async function crawlPage(supabase: SupabaseInstance, url: string, crawlId: string): Promise<PageCrawlResult | null> {
  console.log(`Iniciando análisis de página con Bright Data API: ${url}`);
  
  try {
    // Get the Bright Data API key from environment variables
    const apiKey = Deno.env.get('BRIGHT_DATA_API_KEY');
    if (!apiKey) {
      throw new Error("BRIGHT_DATA_API_KEY no está configurada en las variables de entorno");
    }
    
    console.log(`Llamando a Bright Data API para URL: ${url}`);
    
    // Call Bright Data API to get HTML content using proxy method
    const brightDataResponse = await fetchWithBrightDataProxy(url, apiKey);
    
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
async function fetchWithBrightDataProxy(url: string, apiKey: string): Promise<BrightDataResponse> {
  try {
    console.log(`Preparando solicitud con proxy Bright Data para: ${url}`);
    
    // Build proxy authentication string with API key as password
    const proxyAuth = `brd-customer-${BRIGHT_DATA_CONFIG.CUSTOMER_ID}:${apiKey}`;
    const proxyUrl = `http://${proxyAuth}@${BRIGHT_DATA_CONFIG.PROXY_HOST}:${BRIGHT_DATA_CONFIG.PROXY_PORT}`;
    
    console.log(`Usando proxy URL: ${BRIGHT_DATA_CONFIG.PROXY_HOST}:${BRIGHT_DATA_CONFIG.PROXY_PORT}`);
    
    // Configuración para la solicitud
    const fetchOptions = {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(BRIGHT_DATA_CONFIG.TIMEOUT),
      proxy: proxyUrl
    };
    
    console.log('Opciones de solicitud:', JSON.stringify(fetchOptions, null, 2));
    
    // Attempt to fetch the URL using Bright Data's proxy
    const response = await fetch(url, fetchOptions);
    
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
    
    // Try the API-based approach as fallback
    console.log('Usando método alternativo de API para Bright Data...');
    return await fetchWithBrightDataAPI(url, apiKey);
  }
}

// Fallback method: API-based access to Bright Data (original implementation)
async function fetchWithBrightDataAPI(url: string, apiKey: string): Promise<BrightDataResponse> {
  try {
    console.log(`Fallback: Usando API de Bright Data para: ${url}`);
    
    // Preparar opciones de la solicitud según la documentación de Bright Data
    const requestOptions: BrightDataRequestOptions = {
      zone: BRIGHT_DATA_CONFIG.DEFAULT_ZONE,
      url: url,
      format: BRIGHT_DATA_CONFIG.FORMAT,
      javascript: true, // Habilitar JavaScript para sitios SPA o React
      render: true,     // Renderizar completamente la página
      timeout: BRIGHT_DATA_CONFIG.TIMEOUT / 1000, // API expects seconds
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      }
    };
    
    console.log('Opciones de solicitud a Bright Data API:', JSON.stringify(requestOptions, null, 2));
    
    const response = await fetch(BRIGHT_DATA_CONFIG.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestOptions)
    });
    
    console.log(`Respuesta de Bright Data API recibida con estado: ${response.status}`);
    
    // Si response no es ok, intentar obtener detalles del error
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error en Bright Data API: ${response.status} ${response.statusText}`, errorText);
      
      return {
        status: response.status,
        body: '',
        headers: {},
        error: `${response.status} ${response.statusText}: ${errorText}`
      };
    }
    
    // Get the response body as text
    const body = await response.text();
    console.log(`Respuesta de Bright Data API recibida con tamaño: ${body.length} bytes`);
    
    // Return the response
    return {
      status: response.status,
      body: body,
      headers: Object.fromEntries(response.headers.entries()),
      url: url
    };
  } catch (error) {
    console.error(`Error en fetchWithBrightDataAPI para ${url}:`, error);
    return {
      status: 500,
      body: '',
      headers: {},
      error: error instanceof Error ? error.message : 'Error desconocido en la comunicación con Bright Data'
    };
  }
}
