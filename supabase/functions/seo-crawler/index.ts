
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { DOMParser as DenoDOM } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Función para analizar una URL
async function analyzePage(url: string) {
  try {
    console.log(`Analizando página: ${url}`);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SEOAuditBot/1.0 (+https://midominio.com/bot.html)'
      }
    });
    
    if (!response.ok) {
      return {
        url,
        statusCode: response.status,
        title: null,
        metaDescription: null,
        h1: null,
        canonicalUrl: null,
        isIndexable: false,
        links: [],
        issues: [{
          issueType: 'page_not_found',
          severity: 'high',
          description: `Error al acceder a la página: ${response.status} ${response.statusText}`,
          recommendedFix: 'Verificar la URL y asegurarse de que la página esté accesible'
        }]
      };
    }
    
    const html = await response.text();
    
    // Crear un DOMParser para analizar el HTML usando Deno DOM
    const parser = new DenoDOM();
    const doc = parser.parseFromString(html, "text/html");
    
    if (!doc) {
      return {
        url,
        statusCode: response.status,
        title: null,
        metaDescription: null,
        h1: null,
        canonicalUrl: null,
        isIndexable: false,
        links: [],
        issues: [{
          issueType: 'parse_error',
          severity: 'high',
          description: 'Error al analizar el HTML de la página',
          recommendedFix: 'La página tiene un formato HTML inválido, revisar su estructura'
        }]
      };
    }
    
    // Extraer información básica
    const title = doc.querySelector('title')?.textContent || '';
    const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    const h1 = doc.querySelector('h1')?.textContent || '';
    const canonicalUrl = doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';
    const robotsMeta = doc.querySelector('meta[name="robots"]')?.getAttribute('content') || '';
    const isIndexable = !robotsMeta.includes('noindex');
    
    // Extraer enlaces
    const links = Array.from(doc.querySelectorAll('a[href]')).map(link => {
      const href = link.getAttribute('href') || '';
      const anchorText = link.textContent?.trim() || '';
      const rel = link.getAttribute('rel') || '';
      const follow = !rel.includes('nofollow');
      
      // Determinar si es un enlace interno o externo
      let isInternal = false;
      try {
        // Manejar URLs relativas
        let fullUrl = href;
        if (href.startsWith('/')) {
          const baseUrl = new URL(url);
          fullUrl = `${baseUrl.origin}${href}`;
        } else if (!href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('#')) {
          const baseUrl = new URL(url);
          // Eliminar la parte del path después del último slash
          const basePath = baseUrl.pathname.split('/').slice(0, -1).join('/') + '/';
          fullUrl = `${baseUrl.origin}${basePath}${href}`;
        }
        
        // Solo comprobar si es interno si es una URL completa
        if (href.startsWith('http://') || href.startsWith('https://')) {
          const linkUrl = new URL(href);
          const pageUrl = new URL(url);
          isInternal = linkUrl.hostname === pageUrl.hostname;
        } else if (!href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('#')) {
          // Si no es una URL externa, mailto, tel o ancla, consideramos que es interna
          isInternal = true;
        }
      } catch (e) {
        // Si no es una URL válida, asumir que es una ruta relativa (interna)
        isInternal = !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('#');
      }
      
      return {
        url: href,
        anchorText,
        isInternal,
        follow
      };
    });
    
    // Detectar problemas SEO
    const issues = [];
    
    // Título vacío o demasiado largo
    if (!title) {
      issues.push({
        issueType: 'missing_title',
        severity: 'high',
        description: 'La página no tiene un título definido',
        recommendedFix: 'Añadir un título descriptivo y conciso a la página'
      });
    } else if (title.length > 60) {
      issues.push({
        issueType: 'title_too_long',
        severity: 'medium',
        description: `El título tiene ${title.length} caracteres, lo cual excede el límite recomendado`,
        recommendedFix: 'Acortar el título a menos de 60 caracteres para una mejor visualización en resultados de búsqueda'
      });
    }
    
    // Meta descripción vacía o demasiado larga
    if (!metaDescription) {
      issues.push({
        issueType: 'missing_meta_description',
        severity: 'medium',
        description: 'La página no tiene meta descripción',
        recommendedFix: 'Añadir una meta descripción descriptiva y persuasiva'
      });
    } else if (metaDescription.length > 160) {
      issues.push({
        issueType: 'meta_description_too_long',
        severity: 'low',
        description: `La meta descripción tiene ${metaDescription.length} caracteres, lo cual excede el límite recomendado`,
        recommendedFix: 'Acortar la meta descripción a menos de 160 caracteres'
      });
    }
    
    // H1 vacío o múltiples H1
    if (!h1) {
      issues.push({
        issueType: 'missing_h1',
        severity: 'medium',
        description: 'La página no tiene un encabezado H1',
        recommendedFix: 'Añadir un encabezado H1 claro y descriptivo'
      });
    } else if (doc.querySelectorAll('h1').length > 1) {
      issues.push({
        issueType: 'multiple_h1',
        severity: 'medium',
        description: `La página tiene ${doc.querySelectorAll('h1').length} encabezados H1`,
        recommendedFix: 'Mantener un solo H1 por página para una estructura de contenido clara'
      });
    }
    
    // Falta URL canónica
    if (!canonicalUrl) {
      issues.push({
        issueType: 'missing_canonical',
        severity: 'medium',
        description: 'La página no tiene una URL canónica definida',
        recommendedFix: 'Añadir una etiqueta canónica para evitar problemas de contenido duplicado'
      });
    }
    
    return {
      url,
      statusCode: response.status,
      title,
      metaDescription,
      h1,
      canonicalUrl,
      robotsDirectives: robotsMeta,
      isIndexable,
      links,
      issues
    };
  } catch (error) {
    console.error(`Error analizando ${url}:`, error);
    return {
      url,
      statusCode: 0,
      error: error.message,
      issues: [{
        issueType: 'crawl_error',
        severity: 'high',
        description: `Error al analizar la página: ${error.message}`,
        recommendedFix: 'Verificar la accesibilidad de la URL'
      }]
    };
  }
}

// Función recursiva para rastrear un sitio web
async function crawlSite(startUrl: string, maxPages: number = 100, visitedUrls = new Set(), excludePatterns = [], includePatterns = [], followExternalLinks = false) {
  const results = [];
  const urlsToVisit = [startUrl];
  
  try {
    console.log(`Iniciando crawl desde ${startUrl} con límite de ${maxPages} páginas`);
    
    // Asegurarnos de que la URL inicial tiene un protocolo válido
    let baseUrl;
    try {
      baseUrl = new URL(startUrl);
    } catch (e) {
      if (!startUrl.startsWith('http://') && !startUrl.startsWith('https://')) {
        baseUrl = new URL('https://' + startUrl);
      } else {
        throw new Error(`URL inicial inválida: ${startUrl}`);
      }
    }
    
    const baseHostname = baseUrl.hostname;
    console.log(`Hostname base: ${baseHostname}`);
    
    while (urlsToVisit.length > 0 && visitedUrls.size < maxPages) {
      const currentUrl = urlsToVisit.shift();
      if (!currentUrl) continue;
      
      console.log(`Procesando URL: ${currentUrl} (${visitedUrls.size + 1}/${maxPages})`);
      
      // Evitar visitar la misma URL más de una vez
      if (visitedUrls.has(currentUrl)) {
        console.log(`URL ya visitada: ${currentUrl}, saltando...`);
        continue;
      }
      
      visitedUrls.add(currentUrl);
      
      // Analizar la página actual
      const pageData = await analyzePage(currentUrl);
      results.push(pageData);
      
      console.log(`Página analizada: ${currentUrl}, encontrados ${pageData.links?.length || 0} enlaces`);
      
      // Comprobar si hay enlaces en la página y añadirlos a la cola
      if (pageData.links && pageData.links.length > 0) {
        for (const link of pageData.links) {
          try {
            if (!link.url) continue;
            
            // Saltar enlaces vacíos, anclas o protocolos especiales
            if (
              link.url === '' || 
              link.url.startsWith('#') || 
              link.url.startsWith('mailto:') || 
              link.url.startsWith('tel:') ||
              link.url.startsWith('javascript:')
            ) {
              continue;
            }
            
            // Normalizar URL
            let fullUrl;
            try {
              if (link.url.startsWith('http://') || link.url.startsWith('https://')) {
                fullUrl = link.url;
              } else if (link.url.startsWith('/')) {
                // URL absoluta relativa al dominio
                fullUrl = `${baseUrl.origin}${link.url}`;
              } else {
                // URL relativa a la página actual
                const currentUrlObj = new URL(currentUrl);
                // Eliminar el nombre de archivo si existe
                let basePath = currentUrlObj.pathname;
                if (!basePath.endsWith('/')) {
                  basePath = basePath.substring(0, basePath.lastIndexOf('/') + 1);
                }
                fullUrl = `${currentUrlObj.origin}${basePath}${link.url}`;
              }
              
              // Limpiar anclas de la URL
              if (fullUrl.includes('#')) {
                fullUrl = fullUrl.split('#')[0];
              }
              
              // Validar que es una URL válida
              new URL(fullUrl);
            } catch (e) {
              console.error(`URL inválida: ${link.url}, error: ${e.message}`);
              continue; // URL inválida, saltar
            }
            
            // Verificar si ya hemos visitado esta URL
            if (visitedUrls.has(fullUrl) || urlsToVisit.includes(fullUrl)) {
              continue;
            }
            
            // Verificar si es un enlace interno o externo
            let isInternal = false;
            try {
              const linkUrl = new URL(fullUrl);
              isInternal = linkUrl.hostname === baseHostname;
            } catch (e) {
              console.error(`Error al analizar hostname: ${e.message}`);
              continue;
            }
            
            // Solo seguir enlaces externos si está habilitada la opción
            if (!isInternal && !followExternalLinks) {
              console.log(`Saltando enlace externo: ${fullUrl}`);
              continue;
            }
            
            // Verificar patrones de exclusión
            if (excludePatterns.length > 0 && excludePatterns.some(pattern => fullUrl.includes(pattern))) {
              console.log(`URL excluida por patrón: ${fullUrl}`);
              continue;
            }
            
            // Verificar patrones de inclusión si están definidos
            if (includePatterns.length > 0 && !includePatterns.some(pattern => fullUrl.includes(pattern))) {
              console.log(`URL no incluida por patrón: ${fullUrl}`);
              continue;
            }
            
            // Ignorar enlaces con protocolos no HTTP/HTTPS
            if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
              continue;
            }
            
            console.log(`Añadiendo a la cola: ${fullUrl}`);
            // Añadir URL a la cola
            urlsToVisit.push(fullUrl);
          } catch (e) {
            console.error(`Error procesando enlace ${link.url}:`, e);
          }
        }
      }
    }
    
    console.log(`Crawl finalizado. Páginas analizadas: ${results.length}`);
    return results;
  } catch (error) {
    console.error("Error en crawlSite:", error);
    throw error;
  }
}

// Función principal para manejar la petición
serve(async (req) => {
  // Manejar solicitudes CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Extraer datos de la solicitud
    const requestData = await req.json();
    console.log("Received request data:", JSON.stringify(requestData));
    
    const { url, clientId, crawlId, maxPages = 100, excludePatterns = [], includePatterns = [], followExternalLinks = false } = requestData;
    
    if (!url) {
      return new Response(
        JSON.stringify({ error: 'Se requiere una URL para analizar' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Iniciando análisis de: ${url}`);
    console.log(`Configuración: maxPages=${maxPages}, followExternalLinks=${followExternalLinks}`);
    console.log(`Patrones de exclusión: ${JSON.stringify(excludePatterns)}`);
    console.log(`Patrones de inclusión: ${JSON.stringify(includePatterns)}`);
    
    // Validar URL
    let validUrl;
    try {
      // Verificar que tenga protocolo
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        validUrl = 'https://' + url;
      } else {
        validUrl = url;
      }
      
      // Verificar que sea una URL válida
      new URL(validUrl);
    } catch (e) {
      return new Response(
        JSON.stringify({ error: 'URL inválida. Formato correcto: https://ejemplo.com' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    try {
      // Comprobar que la URL es accesible antes de iniciar el rastreo completo
      const testResponse = await fetch(validUrl, {
        method: 'HEAD',
        headers: {
          'User-Agent': 'SEOAuditBot/1.0 (+https://midominio.com/bot.html)'
        }
      });
      
      if (!testResponse.ok) {
        // Actualizar el registro como error
        await supabase
          .from('seo_crawl_results')
          .update({
            status: 'error',
            pages_crawled: 0,
            issues_count: 1,
            total_time_seconds: 0
          })
          .eq('id', crawlId);
        
        // Si la URL no es accesible, devolver error
        return new Response(
          JSON.stringify({ 
            error: `La URL no es accesible. Código de estado: ${testResponse.status}` 
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch (accessError) {
      console.error("Error al verificar acceso a URL:", accessError);
      
      // Actualizar el registro como error
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
          error: `Error al acceder a la URL: ${accessError.message}` 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Iniciar temporizador
    const startTime = new Date().getTime();
    
    try {
      // Realizar el rastreo
      const visitedUrls = new Set();
      
      // Limitar el tiempo máximo del rastreo a 25 segundos para evitar timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);
      
      let results;
      
      try {
        results = await Promise.race([
          crawlSite(validUrl, maxPages, visitedUrls, excludePatterns, includePatterns, followExternalLinks),
          new Promise((_, reject) => {
            controller.signal.addEventListener('abort', () => {
              reject(new Error('El rastreo ha excedido el tiempo máximo permitido'));
            });
          })
        ]);
        
        clearTimeout(timeoutId);
      } catch (raceError) {
        clearTimeout(timeoutId);
        
        // Si el error es por timeout, usar las páginas que ya se hayan analizado
        if (raceError.message === 'El rastreo ha excedido el tiempo máximo permitido') {
          console.log('El rastreo ha excedido el tiempo máximo. Usando páginas ya analizadas:', visitedUrls.size);
          
          if (visitedUrls.size === 0) {
            // Si no hay páginas analizadas, analizar al menos la página principal
            results = [await analyzePage(validUrl)];
          }
        } else {
          throw raceError;
        }
      }
      
      // Ensure results is defined
      if (!results || results.length === 0) {
        results = [await analyzePage(validUrl)]; // Analyze at least the main page
      }
      
      // Calcular tiempo total
      const endTime = new Date().getTime();
      const totalTimeSeconds = Math.floor((endTime - startTime) / 1000);
      
      // Contar problemas totales
      let totalIssues = 0;
      
      // Insertar los resultados en la base de datos
      for (const page of results) {
        try {
          // Insertar página
          const { data: pageData, error: pageError } = await supabase
            .from('seo_crawl_pages')
            .insert({
              crawl_id: crawlId,
              url: page.url,
              status_code: page.statusCode,
              title: page.title,
              meta_description: page.metaDescription,
              h1: page.h1,
              canonical_url: page.canonicalUrl,
              robots_directives: page.robotsDirectives,
              is_indexable: page.isIndexable
            })
            .select()
            .single();
            
          if (pageError) {
            console.error(`Error al insertar página ${page.url}:`, pageError);
            continue;
          }
          
          const pageId = pageData.id;
          
          // Insertar problemas
          if (page.issues && page.issues.length > 0) {
            totalIssues += page.issues.length;
            
            for (const issue of page.issues) {
              const { error: issueError } = await supabase
                .from('seo_crawl_issues')
                .insert({
                  page_id: pageId,
                  issue_type: issue.issueType,
                  severity: issue.severity,
                  description: issue.description,
                  recommended_fix: issue.recommendedFix
                });
                
              if (issueError) {
                console.error(`Error al insertar problema en página ${page.url}:`, issueError);
              }
            }
          }
          
          // Insertar enlaces
          if (page.links && page.links.length > 0) {
            for (const link of page.links) {
              const { error: linkError } = await supabase
                .from('seo_crawl_links')
                .insert({
                  page_id: pageId,
                  url: link.url,
                  anchor_text: link.anchorText,
                  is_internal: link.isInternal,
                  is_broken: false, // Se actualizará después
                  follow: link.follow
                });
                
              if (linkError) {
                console.error(`Error al insertar enlace en página ${page.url}:`, linkError);
              }
            }
          }
        } catch (error) {
          console.error(`Error procesando página ${page.url}:`, error);
        }
      }
      
      // Actualizar el resultado del rastreo
      const { error: updateError } = await supabase
        .from('seo_crawl_results')
        .update({
          status: 'completed',
          pages_crawled: results.length,
          issues_count: totalIssues,
          total_time_seconds: totalTimeSeconds
        })
        .eq('id', crawlId);
        
      if (updateError) {
        throw new Error(`Error al actualizar resultado de análisis: ${updateError.message}`);
      }
      
      return new Response(
        JSON.stringify({
          success: true,
          crawlId,
          pagesAnalyzed: results.length,
          issuesFound: totalIssues,
          timeSeconds: totalTimeSeconds
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (crawlError) {
      console.error('Error durante el rastreo:', crawlError);
      
      // Actualizar el registro como error
      await supabase
        .from('seo_crawl_results')
        .update({
          status: 'error',
          pages_crawled: 0,
          issues_count: 0,
          total_time_seconds: 0
        })
        .eq('id', crawlId);
      
      return new Response(
        JSON.stringify({ 
          error: `Error durante el rastreo: ${crawlError.message}` 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error en el servidor:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
