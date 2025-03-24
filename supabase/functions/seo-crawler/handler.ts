
// Request handler for SEO Crawler
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { corsHeaders } from './constants.ts';
import { crawlPage } from './crawler.ts';
import { normalizeUrl, updateCrawlStatus } from './utils.ts';

export async function handleRequest(req: Request, supabase: SupabaseClient) {
  console.log('Procesando solicitud para SEO Crawler');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Devolviendo cabeceras CORS para preflight');
    return new Response(null, {
      headers: corsHeaders
    });
  }
  
  try {
    if (req.method === 'POST') {
      console.log('Procesando solicitud POST');
      
      // Parse request body
      let requestData;
      try {
        requestData = await req.json();
      } catch (e) {
        console.error('Error al parsear JSON:', e);
        return new Response(
          JSON.stringify({ error: 'Invalid JSON in request body' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const { url, crawlId } = requestData;
      
      console.log(`Parámetros recibidos - URL: ${url}, CrawlID: ${crawlId}`);
      
      if (!url || !crawlId) {
        console.error('URL y crawlId son obligatorios');
        return new Response(
          JSON.stringify({ error: 'URL and crawlId are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Verificar que la API key esté configurada
      const apiKey = Deno.env.get('BRIGHT_DATA_API_KEY');
      if (!apiKey) {
        console.error('BRIGHT_DATA_API_KEY no está configurada en las variables de entorno');
        
        // Actualizar el estado del crawl a error
        await updateCrawlStatus(supabase, crawlId, 'error', 0, 0, 0);
        
        return new Response(
          JSON.stringify({ 
            error: 'La API key de Bright Data no está configurada. Por favor, configúrela en las variables de entorno de Supabase.',
            code: 'MISSING_API_KEY'
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Verificar que el CUSTOMER_ID esté configurado
      const customerId = Deno.env.get('BRIGHT_DATA_CUSTOMER_ID');
      if (!customerId) {
        console.error('BRIGHT_DATA_CUSTOMER_ID no está configurado en las variables de entorno');
        
        await updateCrawlStatus(supabase, crawlId, 'error', 0, 0, 0);
        
        return new Response(
          JSON.stringify({ 
            error: 'El ID de cliente de Bright Data no está configurado. Por favor, configúrelo en las variables de entorno de Supabase.',
            code: 'MISSING_CUSTOMER_ID'
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      console.log('Credenciales de Bright Data verificadas correctamente');
      
      // Normalize the URL
      const normalizedUrl = normalizeUrl(url);
      console.log(`URL normalizada: ${normalizedUrl}`);
      
      // Actualizar el estado del crawl a processing (por si acaso)
      await updateCrawlStatus(supabase, crawlId, 'processing', 0, 0, 0);
      
      // Analyze main page first
      console.log('Iniciando análisis de página principal con Bright Data...');
      const mainPage = await crawlPage(supabase, normalizedUrl, crawlId);
      
      if (!mainPage) {
        console.error('No se pudo analizar la página principal');
        
        // Update crawl status to error, but don't throw exception to return a valid response
        await updateCrawlStatus(supabase, crawlId, 'error', 0, 1, 0);
          
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: 'Error al analizar la página principal. Compruebe que la URL es accesible y que la API key de Bright Data es correcta.' 
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      console.log('Análisis de página principal completado con éxito');
      console.log(`Resultados - pageId: ${mainPage.pageId}, issues: ${mainPage.issues}`);
      
      // Update crawl status
      console.log('Actualizando estado del crawl a completado...');
      await updateCrawlStatus(supabase, crawlId, 'completed', 1, mainPage.issues, 1);
      
      console.log('Enviando respuesta exitosa');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Página analizada correctamente',
          pageId: mainPage.pageId,
          issuesCount: mainPage.issues
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.error('Método no permitido:', req.method);
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error en la función:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace available');
    
    // Try to update crawl status to error
    try {
      console.log('Intentando actualizar estado del crawl a error...');
      if (req.method === 'POST') {
        try {
          const { crawlId } = await req.json();
          if (crawlId) {
            await updateCrawlStatus(supabase, crawlId, 'error', 0, 0, 0);
          }
        } catch (e) {
          console.error('Error leyendo crawlId del body:', e);
        }
      }
    } catch (e) {
      console.error('Error actualizando estado del crawl a error:', e);
    }
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Error interno del servidor',
        stack: error instanceof Error ? error.stack : undefined,
        code: 'INTERNAL_SERVER_ERROR'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
