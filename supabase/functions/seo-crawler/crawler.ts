
// Core crawler functionality
import * as cheerio from 'https://esm.sh/cheerio@1.0.0-rc.12';
import { SupabaseInstance, PageCrawlResult } from './types.ts';
import { SEO_ISSUES } from './constants.ts';
import { isInternalUrl, queueLinksForCrawling, registerCrawlerError } from './utils.ts';

// Simpler crawl function that focuses on reliability
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

// Simplified analysis when page cannot be fetched
async function simplifiedAnalysis(supabase: SupabaseInstance, url: string, crawlId: string): Promise<PageCrawlResult | null> {
  console.log(`Realizando análisis simplificado para: ${url}`);
  
  try {
    // Extract domain and path information
    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname;
    const path = parsedUrl.pathname;
    
    // Create basic page entry with minimal information
    const pageEntry = {
      id: crypto.randomUUID(),
      crawl_id: crawlId,
      url: url,
      status_code: 0, // Indicates error/unknown
      title: domain + path, // Use domain and path as title
      meta_description: '',
      h1: '',
      word_count: 0,
      h1_count: 0,
      h2_count: 0,
      h3_count: 0,
      internal_links_count: 0,
      external_links_count: 0,
      is_indexable: false, // Unknown if indexable
      canonical_url: '',
      image_count: 0,
      images_without_alt: 0,
      meta_robots: ''
    };
    
    // Store page in database
    console.log('Guardando datos de página básicos en la base de datos...');
    const { error: pageError } = await supabase
      .from('seo_crawl_pages')
      .insert(pageEntry);
      
    if (pageError) {
      console.error(`Error guardando página ${url}:`, pageError);
      throw new Error(`Error guardando página: ${pageError.message}`);
    }
    
    console.log(`Página básica guardada exitosamente con ID: ${pageEntry.id}`);
    
    // Create a connectivity issue
    const issues = [{
      id: crypto.randomUUID(),
      page_id: pageEntry.id,
      issue_type: 'connectivity_error',
      severity: 'high',
      description: 'No se pudo analizar la página debido a problemas de conectividad o restricciones de acceso',
      recommended_fix: 'Verificar que la URL es accesible públicamente y no está bloqueando las solicitudes automatizadas'
    }];
    
    console.log('Guardando problema de conectividad...');
    const { error: issuesError } = await supabase
      .from('seo_crawl_issues')
      .insert(issues);
      
    if (issuesError) {
      console.error(`Error guardando problemas para página ${url}:`, issuesError);
    } else {
      console.log('Problema de conectividad guardado correctamente');
    }
    
    return {
      pageId: pageEntry.id,
      url,
      issues: 1
    };
  } catch (error) {
    console.error(`Error en análisis simplificado de ${url}:`, error);
    return null;
  }
}

// Process HTML content and extract SEO data
async function processHtml(supabase: SupabaseInstance, url: string, crawlId: string, html: string): Promise<PageCrawlResult | null> {
  try {
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
      status_code: 200, // Assuming success if we got this far
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
    await queueLinksForCrawling(supabase, pageEntry.id, internalLinks, crawlId, url);
    
    return {
      pageId: pageEntry.id,
      url,
      issues: issues.length
    };
  } catch (error) {
    console.error(`Error procesando HTML de ${url}:`, error);
    await registerCrawlerError(supabase, crawlId, url, error instanceof Error ? error.message : "Error desconocido");
    return null;
  }
}
