// SEO Crawler Edge Function
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import * as cheerio from 'https://esm.sh/cheerio@1.0.0-rc.12';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create a Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Simplified SEO issues for basic analysis
const SEO_ISSUES = {
  MISSING_TITLE: {
    type: 'missing_title',
    severity: 'high',
    description: 'La página no tiene título',
    fix: 'Añadir un título descriptivo y relevante a la página'
  },
  MISSING_META_DESCRIPTION: {
    type: 'missing_meta_description',
    severity: 'medium',
    description: 'La página no tiene meta descripción',
    fix: 'Añadir una meta descripción concisa y relevante'
  },
  MISSING_H1: {
    type: 'missing_h1',
    severity: 'high',
    description: 'La página no tiene un encabezado H1',
    fix: 'Añadir un encabezado H1 que refleje el contenido principal de la página'
  },
  CRAWLER_ERROR: {
    type: 'crawler_error',
    severity: 'high',
    description: 'Error al analizar la página',
    fix: 'Verificar que la URL es accesible y no está bloqueada'
  }
};

// Helper function to detect if a URL is internal
function isInternalUrl(baseUrl: string, url: string): boolean {
  console.log(`Verificando si URL es interna: ${url}`);
  if (!url || url.startsWith('#') || url.startsWith('javascript:')) {
    return false;
  }
  
  try {
    const parsedBaseUrl = new URL(baseUrl);
    const baseDomain = parsedBaseUrl.hostname;
    
    // Handle relative URLs
    if (url.startsWith('/')) {
      console.log(`URL relativa detectada: ${url}`);
      return true;
    }
    
    const parsedUrl = new URL(url, baseUrl);
    const isInternal = parsedUrl.hostname === baseDomain;
    console.log(`URL ${url} es interna: ${isInternal}`);
    return isInternal;
  } catch (e) {
    console.error(`Error checking if URL is internal: ${url}`, e);
    return false;
  }
}

// Normalize URL to avoid duplicates
function normalizeUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    // Remove trailing slash
    let normalized = parsedUrl.origin + parsedUrl.pathname.replace(/\/$/, '');
    // Keep search params
    if (parsedUrl.search) {
      normalized += parsedUrl.search;
    }
    return normalized;
  } catch (e) {
    console.error(`Error normalizando URL: ${url}`, e);
    return url;
  }
}

// Queue links for future crawling
async function queueLinksForCrawling(pageId: string, links: string[], crawlId: string, baseUrl: string) {
  console.log(`Guardando ${links.length} enlaces para análisis futuro`);
  
  try {
    // First, save them as links associated with the current page
    const linkEntries = links.map(url => ({
      id: crypto.randomUUID(),
      page_id: pageId,
      url: url,
      is_internal: isInternalUrl(baseUrl, url),
      anchor_text: '', // Not capturing anchor text for simplicity
      follow: true
    }));
    
    if (linkEntries.length > 0) {
      const { error: linksError } = await supabase
        .from('seo_crawl_links')
        .insert(linkEntries);
        
      if (linksError) {
        console.error('Error guardando enlaces:', linksError);
      } else {
        console.log(`${linkEntries.length} enlaces guardados con éxito`);
      }
    }
    
    // In the future, we could create a queue table to process these links
    // For now, we're just analyzing the main page
  } catch (error) {
    console.error('Error guardando enlaces para análisis futuro:', error);
  }
}

// Simpler crawl function that focuses on reliability
async function crawlPage(url: string, crawlId: string) {
  console.log(`Iniciando análisis de página: ${url}`);
  
  try {
    console.log(`Realizando fetch de: ${url}`);
    const response = await fetch(url, {
      headers: { 'User-Agent': 'SEO-Crawler/1.0' },
      redirect: 'follow'
    });
    
    console.log(`Respuesta recibida. Status code: ${response.status}`);
    
    // Get content type
    const contentType = response.headers.get('content-type') || '';
    console.log(`Content type: ${contentType}`);
    
    // Skip non-HTML content
    if (!contentType.includes('text/html')) {
      console.log(`Saltando contenido no HTML: ${contentType}`);
      return null;
    }
    
    // Get content
    console.log('Obteniendo contenido HTML...');
    const html = await response.text();
    console.log(`Contenido HTML obtenido (${html.length} bytes)`);
    
    const $ = cheerio.load(html);
    console.log('HTML parseado con cheerio');
    
    // Extract basic page details
    console.log('Extrayendo metadatos...');
    const title = $('title').text().trim();
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const h1 = $('h1').first().text().trim();
    
    console.log(`Título: "${title}"`);
    console.log(`Meta descripción: "${metaDescription}"`);
    console.log(`H1: "${h1}"`);
    
    // Count elements
    const h1Count = $('h1').length;
    const h2Count = $('h2').length;
    const h3Count = $('h3').length;
    const wordCount = html.replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .length;
    
    console.log(`Conteo de elementos - H1: ${h1Count}, H2: ${h2Count}, H3: ${h3Count}, Palabras: ${wordCount}`);
    
    // Link analysis
    console.log('Analizando enlaces...');
    const links = $('a[href]');
    let internalLinksCount = 0;
    let externalLinksCount = 0;
    const internalLinks: string[] = [];
    
    console.log(`Total de enlaces encontrados: ${links.length}`);
    
    links.each((_, link) => {
      const href = $(link).attr('href') || '';
      if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
        try {
          // Normalize and resolve relative URLs
          const fullUrl = new URL(href, url).href;
          
          if (isInternalUrl(url, href)) {
            internalLinksCount++;
            internalLinks.push(fullUrl);
          } else {
            externalLinksCount++;
          }
        } catch (e) {
          console.error(`Error procesando enlace ${href}:`, e);
        }
      }
    });
    
    console.log(`Enlaces internos: ${internalLinksCount}, Enlaces externos: ${externalLinksCount}`);
    
    // Image analysis
    console.log('Analizando imágenes...');
    const images = $('img');
    const imageCount = images.length;
    let imagesWithoutAlt = 0;
    
    images.each((_, img) => {
      const alt = $(img).attr('alt');
      if (!alt || alt.trim() === '') {
        imagesWithoutAlt++;
      }
    });
    
    console.log(`Total imágenes: ${imageCount}, Imágenes sin alt: ${imagesWithoutAlt}`);
    
    // Check indexability
    console.log('Verificando indexabilidad...');
    const robotsMeta = $('meta[name="robots"]').attr('content') || '';
    const isIndexable = !robotsMeta.includes('noindex');
    
    console.log(`Robots meta: "${robotsMeta}", Indexable: ${isIndexable}`);
    
    // Check canonical
    const canonical = $('link[rel="canonical"]').attr('href') || '';
    console.log(`URL canónica: "${canonical}"`);
    
    // Page analysis result
    const pageEntry = {
      id: crypto.randomUUID(),
      crawl_id: crawlId,
      url: url,
      status_code: response.status,
      title: title,
      meta_description: metaDescription,
      h1: h1,
      word_count: wordCount,
      h1_count: h1Count,
      h2_count: h2Count,
      h3_count: h3Count,
      internal_links_count: internalLinksCount,
      external_links_count: externalLinksCount,
      is_indexable: isIndexable,
      canonical_url: canonical,
      image_count: imageCount,
      images_without_alt: imagesWithoutAlt,
      meta_robots: robotsMeta
    };
    
    // Store page in database
    console.log('Guardando datos de página en la base de datos...');
    const { error: pageError } = await supabase
      .from('seo_crawl_pages')
      .insert(pageEntry);
      
    if (pageError) {
      console.error(`Error guardando página ${url}:`, pageError);
      throw new Error(`Error guardando página: ${pageError.message}`);
    }
    
    console.log(`Página guardada exitosamente con ID: ${pageEntry.id}`);
    
    // Basic SEO issues check
    console.log('Analizando problemas SEO...');
    const issues = [];
    
    if (!title) {
      issues.push({
        id: crypto.randomUUID(),
        page_id: pageEntry.id,
        issue_type: SEO_ISSUES.MISSING_TITLE.type,
        severity: SEO_ISSUES.MISSING_TITLE.severity,
        description: SEO_ISSUES.MISSING_TITLE.description,
        recommended_fix: SEO_ISSUES.MISSING_TITLE.fix
      });
    }
    
    if (!metaDescription) {
      issues.push({
        id: crypto.randomUUID(),
        page_id: pageEntry.id,
        issue_type: SEO_ISSUES.MISSING_META_DESCRIPTION.type,
        severity: SEO_ISSUES.MISSING_META_DESCRIPTION.severity,
        description: SEO_ISSUES.MISSING_META_DESCRIPTION.description,
        recommended_fix: SEO_ISSUES.MISSING_META_DESCRIPTION.fix
      });
    }
    
    if (!h1) {
      issues.push({
        id: crypto.randomUUID(),
        page_id: pageEntry.id,
        issue_type: SEO_ISSUES.MISSING_H1.type,
        severity: SEO_ISSUES.MISSING_H1.severity,
        description: SEO_ISSUES.MISSING_H1.description,
        recommended_fix: SEO_ISSUES.MISSING_H1.fix
      });
    }
    
    console.log(`Problemas SEO encontrados: ${issues.length}`);
    
    // Save issues if any
    if (issues.length > 0) {
      console.log('Guardando problemas SEO...');
      const { error: issuesError } = await supabase
        .from('seo_crawl_issues')
        .insert(issues);
        
      if (issuesError) {
        console.error(`Error guardando problemas para página ${url}:`, issuesError);
      } else {
        console.log('Problemas SEO guardados correctamente');
      }
    }
    
    // Queue internal links for future crawling
    await queueLinksForCrawling(pageEntry.id, internalLinks, crawlId, url);
    
    return {
      pageId: pageEntry.id,
      url,
      issues: issues.length
    };
    
  } catch (error) {
    console.error(`Error analizando página ${url}:`, error);
    
    // Try to register the error in the database
    try {
      console.log('Registrando error como problema SEO...');
      const errorPageId = crypto.randomUUID();
      
      // First register a minimal page entry
      const { error: pageError } = await supabase
        .from('seo_crawl_pages')
        .insert({
          id: errorPageId,
          crawl_id: crawlId,
          url: url,
          status_code: 0, // Indicates error
          title: '',
          meta_description: '',
          h1: '',
          word_count: 0,
          is_indexable: false
        });
        
      if (pageError) {
        console.error('Error registrando página con error:', pageError);
      } else {
        // Register the error as an issue
        const { error: issueError } = await supabase
          .from('seo_crawl_issues')
          .insert({
            id: crypto.randomUUID(),
            page_id: errorPageId,
            issue_type: SEO_ISSUES.CRAWLER_ERROR.type,
            severity: SEO_ISSUES.CRAWLER_ERROR.severity,
            description: `${SEO_ISSUES.CRAWLER_ERROR.description}: ${error.message}`,
            recommended_fix: SEO_ISSUES.CRAWLER_ERROR.fix
          });
          
        if (issueError) {
          console.error('Error registrando problema de crawler:', issueError);
        } else {
          console.log('Error de crawling registrado correctamente como problema SEO');
        }
      }
    } catch (dbError) {
      console.error('Error registrando el error de crawling en la base de datos:', dbError);
    }
    
    return null;
  }
}

serve(async (req) => {
  console.log('Recibida solicitud para SEO Crawler');
  
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
      const mainPage = await crawlPage(normalizedUrl, crawlId);
      
      if (!mainPage) {
        console.error('No se pudo analizar la página principal');
        
        // Update crawl status to error, but don't throw exception to return a valid response
        await supabase
          .from('seo_crawl_results')
          .update({
            status: 'error',
            pages_crawled: 0,
            issues_count: 1,
            total_time_seconds: 0
          })
          .eq('id', crawlId);
          
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
      const { error: updateError } = await supabase
        .from('seo_crawl_results')
        .update({
          status: 'completed',
          pages_crawled: 1,
          issues_count: mainPage.issues,
          total_time_seconds: 1
        })
        .eq('id', crawlId);
        
      if (updateError) {
        console.error('Error actualizando estado del crawl:', updateError);
      } else {
        console.log('Estado del crawl actualizado correctamente');
      }
      
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
            const { error: updateError } = await supabase
              .from('seo_crawl_results')
              .update({ status: 'error' })
              .eq('id', crawlId);
              
            if (updateError) {
              console.error('Error actualizando estado del crawl a error:', updateError);
            } else {
              console.log('Estado del crawl actualizado a error correctamente');
            }
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
});
