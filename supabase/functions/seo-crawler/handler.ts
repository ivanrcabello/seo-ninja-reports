
// Request handler for SEO Crawler
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { corsHeaders } from './constants.ts';
import { crawlPage } from './crawler.ts';
import { normalizeUrl } from './utils.ts';

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
      
      const { url, crawlId, settings = {} } = requestData;
      const brightDataUsername = requestData.brightDataUsername || Deno.env.get('BRIGHT_DATA_USERNAME');
      const brightDataPassword = requestData.brightDataPassword || Deno.env.get('BRIGHT_DATA_PASSWORD');
      
      console.log(`Parámetros recibidos - URL: ${url}, CrawlID: ${crawlId}`);
      console.log(`Credenciales de Bright Data recibidas: ${brightDataUsername ? 'Sí' : 'No'}, ${brightDataPassword ? 'Sí' : 'No'}`);
      
      if (!url || !crawlId) {
        console.error('URL y crawlId son obligatorios');
        return new Response(
          JSON.stringify({ error: 'URL and crawlId are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (!brightDataPassword) {
        console.error('No se ha proporcionado una API key de Bright Data');
        return new Response(
          JSON.stringify({ error: 'Bright Data API key is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Normalize the URL
      const normalizedUrl = normalizeUrl(url);
      console.log(`URL normalizada: ${normalizedUrl}`);
      
      // Update crawl status to processing
      await supabase
        .from('seo_crawler_crawls')
        .update({
          status: 'processing',
          started_at: new Date().toISOString()
        })
        .eq('id', crawlId);
      
      // Analyze the page using Bright Data
      console.log('Iniciando análisis de página principal con Bright Data...');
      
      const mainPage = await crawlPage(supabase, normalizedUrl, crawlId, brightDataUsername, brightDataPassword);
      
      if (!mainPage) {
        console.error('No se pudo analizar la página principal');
        
        // Update crawl status to error
        await supabase
          .from('seo_crawler_crawls')
          .update({
            status: 'failed',
            error_message: 'Error al analizar la página principal',
            completed_at: new Date().toISOString()
          })
          .eq('id', crawlId);
          
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: 'Error al analizar la página principal. Compruebe que la URL es accesible y que la configuración del proxy es correcta.' 
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      console.log('Análisis de página principal completado con éxito');
      console.log(`Resultados - pageId: ${mainPage.pageId}, issues: ${mainPage.issues}`);
      
      // Update crawl status to completed
      await supabase
        .from('seo_crawler_crawls')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          pages_crawled: 1,
          total_pages: 1,
          total_issues: mainPage.issues || 0
        })
        .eq('id', crawlId);
      
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
      if (req.method === 'POST') {
        try {
          const { crawlId } = await req.json();
          if (crawlId) {
            await supabase
              .from('seo_crawler_crawls')
              .update({
                status: 'failed',
                error_message: error instanceof Error ? error.message : 'Error desconocido',
                completed_at: new Date().toISOString()
              })
              .eq('id', crawlId);
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
