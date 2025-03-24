
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
      const { url, crawlId } = await req.json();
      
      console.log(`Parámetros recibidos - URL: ${url}, CrawlID: ${crawlId}`);
      
      if (!url || !crawlId) {
        console.error('URL y crawlId son obligatorios');
        return new Response(
          JSON.stringify({ error: 'URL and crawlId are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Normalize the URL
      const normalizedUrl = normalizeUrl(url);
      console.log(`URL normalizada: ${normalizedUrl}`);
      
      // Analyze main page first
      console.log('Iniciando análisis de página principal...');
      const mainPage = await crawlPage(supabase, normalizedUrl, crawlId);
      
      if (!mainPage) {
        console.error('No se pudo analizar la página principal');
        
        // Update crawl status to error, but don't throw exception to return a valid response
        await updateCrawlStatus(supabase, crawlId, 'error', 0, 1, 0);
          
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: 'Failed to analyze main page, please check if the URL is accessible' 
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      console.log('Análisis de página principal completado');
      
      // Update crawl status
      console.log('Actualizando estado del crawl...');
      await updateCrawlStatus(supabase, crawlId, 'completed', 1, mainPage.issues, 1);
      
      console.log('Enviando respuesta exitosa');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Page analyzed successfully',
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
        error: error instanceof Error ? error.message : 'Internal server error',
        stack: error instanceof Error ? error.stack : undefined
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
