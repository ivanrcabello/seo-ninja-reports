
// SEO Crawler Edge Function
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import * as cheerio from 'https://esm.sh/cheerio@1.0.0-rc.12';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MAX_PAGES = 200; // Límite máximo de páginas a analizar
const TIMEOUT_MS = 120000; // 2 minutos de timeout para evitar que la función se quede atascada

// Create a Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface CrawlSettings {
  url: string;
  clientId: string;
  crawlId: string;
  maxPages?: number;
  excludePatterns?: string[];
  includePatterns?: string[];
  followExternalLinks?: boolean;
}

// Definition of the SEO issues
const SEO_ISSUES = {
  MISSING_TITLE: {
    type: 'missing_title',
    severity: 'high',
    description: 'La página no tiene título',
    fix: 'Añadir un título descriptivo y relevante a la página'
  },
  SHORT_TITLE: {
    type: 'title_too_short',
    severity: 'medium',
    description: 'El título es demasiado corto (menos de 30 caracteres)',
    fix: 'Ampliar el título para que sea más descriptivo y tenga entre 50-60 caracteres'
  },
  LONG_TITLE: {
    type: 'title_too_long',
    severity: 'medium',
    description: 'El título es demasiado largo (más de 60 caracteres)',
    fix: 'Reducir el título a menos de 60 caracteres para una visualización óptima en resultados de búsqueda'
  },
  MISSING_META_DESCRIPTION: {
    type: 'missing_meta_description',
    severity: 'medium',
    description: 'La página no tiene meta descripción',
    fix: 'Añadir una meta descripción concisa y relevante'
  },
  SHORT_META_DESCRIPTION: {
    type: 'meta_description_too_short',
    severity: 'low',
    description: 'La meta descripción es demasiado corta (menos de 70 caracteres)',
    fix: 'Ampliar la meta descripción para que tenga entre 120-158 caracteres'
  },
  LONG_META_DESCRIPTION: {
    type: 'meta_description_too_long',
    severity: 'low',
    description: 'La meta descripción es demasiado larga (más de 160 caracteres)',
    fix: 'Reducir la meta descripción a menos de 158 caracteres para una visualización óptima'
  },
  MISSING_H1: {
    type: 'missing_h1',
    severity: 'high',
    description: 'La página no tiene un encabezado H1',
    fix: 'Añadir un encabezado H1 que refleje el contenido principal de la página'
  },
  MULTIPLE_H1: {
    type: 'multiple_h1',
    severity: 'medium',
    description: 'La página tiene múltiples encabezados H1',
    fix: 'Usar un único encabezado H1 por página y utilizar H2-H6 para las subsecciones'
  },
  LOW_WORD_COUNT: {
    type: 'low_word_count',
    severity: 'medium',
    description: 'La página tiene poco contenido (menos de 300 palabras)',
    fix: 'Añadir más contenido relevante y de calidad a la página'
  },
  MISSING_ALT_TEXT: {
    type: 'missing_alt_text',
    severity: 'medium',
    description: 'Hay imágenes sin texto alternativo',
    fix: 'Añadir texto alternativo descriptivo a todas las imágenes'
  },
  BROKEN_LINKS: {
    type: 'broken_links',
    severity: 'high',
    description: 'La página contiene enlaces rotos',
    fix: 'Corregir o eliminar los enlaces rotos'
  },
  MISSING_CANONICAL: {
    type: 'missing_canonical',
    severity: 'medium',
    description: 'La página no tiene una URL canónica definida',
    fix: 'Añadir una etiqueta link rel="canonical" para evitar contenido duplicado'
  },
  SLOW_PAGE_LOAD: {
    type: 'slow_page_load',
    severity: 'medium',
    description: 'La página tarda demasiado en cargar (más de 3 segundos)',
    fix: 'Optimizar el tiempo de carga reduciendo el tamaño de las imágenes, minificando CSS/JS, etc.'
  },
  LARGE_PAGE_SIZE: {
    type: 'large_page_size',
    severity: 'low',
    description: 'El tamaño de la página es demasiado grande (más de 1MB)',
    fix: 'Reducir el tamaño de la página optimizando imágenes y recursos'
  },
  NO_SCHEMA_MARKUP: {
    type: 'no_schema_markup',
    severity: 'low',
    description: 'La página no tiene marcado schema.org',
    fix: 'Implementar marcado estructurado schema.org relevante al contenido'
  }
};

// Helper function to detect if a URL is internal
function isInternalUrl(baseUrl: string, url: string): boolean {
  if (!url || url.startsWith('#') || url.startsWith('javascript:')) {
    return false;
  }
  
  try {
    const parsedBaseUrl = new URL(baseUrl);
    const baseDomain = parsedBaseUrl.hostname;
    
    // Handle relative URLs
    if (url.startsWith('/')) {
      return true;
    }
    
    const parsedUrl = new URL(url, baseUrl);
    return parsedUrl.hostname === baseDomain;
  } catch (e) {
    console.error(`Error checking if URL is internal: ${url}`, e);
    return false;
  }
}

// Main crawl function
async function crawlSite(settings: CrawlSettings) {
  console.log(`Starting crawl for ${settings.url}`);
  
  const startTime = Date.now();
  const baseUrl = settings.url;
  const maxPages = settings.maxPages || 100;
  const limitedMaxPages = Math.min(maxPages, MAX_PAGES); // Ensure we don't exceed the maximum
  const excludePatterns = settings.excludePatterns || [];
  const includePatterns = settings.includePatterns || [];
  const followExternalLinks = settings.followExternalLinks || false;
  
  // Initialize data structures
  const visited = new Set<string>();
  const queue: string[] = [baseUrl];
  const pages: any[] = [];
  const issues: any[] = [];
  const links: any[] = [];
  let totalIssues = 0;
  
  // Timeout mechanism
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Crawl timed out')), TIMEOUT_MS);
  });
  
  // Main crawl logic
  const crawlPromise = new Promise<void>(async (resolve) => {
    while (queue.length > 0 && pages.length < limitedMaxPages) {
      const url = queue.shift() as string;
      
      // Skip if already visited
      if (visited.has(url)) {
        continue;
      }
      
      visited.add(url);
      console.log(`Analizando página: ${url}\n`);
      
      try {
        const startPageTime = Date.now();
        const response = await fetch(url, {
          headers: { 'User-Agent': 'SEO-Crawler/1.0' }
        });
        const loadTimeMs = Date.now() - startPageTime;
        
        // Get content type
        const contentType = response.headers.get('content-type') || '';
        
        // Skip non-HTML content
        if (!contentType.includes('text/html')) {
          continue;
        }
        
        // Get content
        const html = await response.text();
        const pageSize = Math.round(html.length / 1024); // Size in KB
        const $ = cheerio.load(html);
        
        // Extract basic page details
        const title = $('title').text().trim();
        const metaDescription = $('meta[name="description"]').attr('content') || '';
        const h1 = $('h1').first().text().trim();
        const canonicalUrl = $('link[rel="canonical"]').attr('href') || '';
        const robotsDirectives = $('meta[name="robots"]').attr('content') || '';
        
        // Count elements
        const h1Count = $('h1').length;
        const h2Count = $('h2').length;
        const h3Count = $('h3').length;
        const wordCount = html.replace(/<[^>]*>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .split(' ')
          .length;
        
        // Image analysis
        const images = $('img');
        const imageCount = images.length;
        let imagesWithoutAlt = 0;
        
        images.each((_, img) => {
          if (!$(img).attr('alt')) {
            imagesWithoutAlt++;
          }
        });
        
        // Link analysis
        const pageLinks = $('a[href]');
        let internalLinksCount = 0;
        let externalLinksCount = 0;
        
        const pageEntry = {
          id: crypto.randomUUID(),
          crawl_id: settings.crawlId,
          url: url,
          status_code: response.status,
          title: title,
          meta_description: metaDescription,
          h1: h1,
          canonical_url: canonicalUrl,
          robots_directives: robotsDirectives,
          word_count: wordCount,
          load_time_ms: loadTimeMs,
          is_indexable: !robotsDirectives.includes('noindex'),
          h2_count: h2Count,
          h3_count: h3Count,
          image_count: imageCount,
          images_without_alt: imagesWithoutAlt,
          internal_links_count: 0, // Will update after processing links
          external_links_count: 0, // Will update after processing links
          has_schema_markup: html.includes('schema.org') || $('script[type="application/ld+json"]').length > 0,
          content_length: html.length,
          meta_robots: robotsDirectives,
          mobile_friendly: true, // Simplified assumption
          page_size_kb: pageSize
        };
        
        // Store page in database
        const { data: savedPage, error: pageError } = await supabase
          .from('seo_crawl_pages')
          .insert(pageEntry)
          .select();
          
        if (pageError) {
          console.error(`Error saving page ${url}:`, pageError);
          continue;
        }
        
        const pageId = savedPage[0].id;
        pages.push(pageEntry);
        
        // Process links and add to queue if internal
        pageLinks.each((_, link) => {
          const href = $(link).attr('href') || '';
          const anchorText = $(link).text().trim();
          
          // Skip empty links and javascript links
          if (!href || href === '#' || href.startsWith('javascript:') || href.startsWith('mailto:')) {
            return;
          }
          
          try {
            // Normalize URL
            let fullUrl = href;
            if (href.startsWith('/')) {
              const baseUrlObj = new URL(baseUrl);
              fullUrl = `${baseUrlObj.protocol}//${baseUrlObj.host}${href}`;
            } else if (!href.startsWith('http')) {
              // Relative URL - resolve against the current page URL
              const pageUrlObj = new URL(url);
              const path = pageUrlObj.pathname.endsWith('/') 
                ? pageUrlObj.pathname 
                : pageUrlObj.pathname.substring(0, pageUrlObj.pathname.lastIndexOf('/') + 1);
              fullUrl = `${pageUrlObj.protocol}//${pageUrlObj.host}${path}${href}`;
            }
            
            // Check if internal or external
            const internal = isInternalUrl(baseUrl, fullUrl);
            
            if (internal) {
              internalLinksCount++;
              
              // Apply exclude and include patterns
              const shouldExclude = excludePatterns.some(pattern => fullUrl.includes(pattern));
              const shouldInclude = includePatterns.length === 0 || includePatterns.some(pattern => fullUrl.includes(pattern));
              
              if (!shouldExclude && shouldInclude && !visited.has(fullUrl)) {
                queue.push(fullUrl);
              }
            } else {
              externalLinksCount++;
              
              // Only follow external links if configured to do so
              if (followExternalLinks && !visited.has(fullUrl)) {
                queue.push(fullUrl);
              }
            }
            
            // Test if the link is broken (for both internal and external links)
            let isLinkBroken = false;
            let linkStatusCode = 200;
            
            try {
              const linkCheckResponse = await fetch(fullUrl, {
                method: 'HEAD',
                headers: { 'User-Agent': 'SEO-Crawler/1.0' }
              });
              linkStatusCode = linkCheckResponse.status;
              isLinkBroken = linkStatusCode >= 400;
            } catch (error) {
              console.log(`Error checking link ${fullUrl}:`, error);
              isLinkBroken = true;
              linkStatusCode = 0;
            }
            
            // Store the link
            const linkEntry = {
              id: crypto.randomUUID(),
              page_id: pageId,
              url: fullUrl,
              anchor_text: anchorText,
              is_internal: internal,
              is_broken: isLinkBroken,
              status_code: linkStatusCode,
              follow: !robotsDirectives.includes('nofollow')
            };
            
            links.push(linkEntry);
            
            // Store broken link issue
            if (isLinkBroken) {
              const brokenLinkIssue = {
                id: crypto.randomUUID(),
                page_id: pageId,
                issue_type: SEO_ISSUES.BROKEN_LINKS.type,
                severity: SEO_ISSUES.BROKEN_LINKS.severity,
                description: `Enlace roto a: ${fullUrl}`,
                recommended_fix: SEO_ISSUES.BROKEN_LINKS.fix
              };
              
              issues.push(brokenLinkIssue);
              totalIssues++;
            }
          } catch (linkError) {
            console.error(`Error processing link ${href}:`, linkError);
          }
        });
        
        // Update link counts in the page record
        await supabase
          .from('seo_crawl_pages')
          .update({
            internal_links_count: internalLinksCount,
            external_links_count: externalLinksCount
          })
          .eq('id', pageId);
        
        // Store links in database
        if (links.length > 0) {
          const { error: linksError } = await supabase
            .from('seo_crawl_links')
            .insert(links);
            
          if (linksError) {
            console.error(`Error saving links for page ${url}:`, linksError);
          }
          
          // Clear the links array after storing
          links.length = 0;
        }
        
        // Detect SEO issues
        const pageIssues = [];
        
        // Title issues
        if (!title) {
          pageIssues.push({
            id: crypto.randomUUID(),
            page_id: pageId,
            issue_type: SEO_ISSUES.MISSING_TITLE.type,
            severity: SEO_ISSUES.MISSING_TITLE.severity,
            description: SEO_ISSUES.MISSING_TITLE.description,
            recommended_fix: SEO_ISSUES.MISSING_TITLE.fix
          });
        } else if (title.length < 30) {
          pageIssues.push({
            id: crypto.randomUUID(),
            page_id: pageId,
            issue_type: SEO_ISSUES.SHORT_TITLE.type,
            severity: SEO_ISSUES.SHORT_TITLE.severity,
            description: SEO_ISSUES.SHORT_TITLE.description,
            recommended_fix: SEO_ISSUES.SHORT_TITLE.fix
          });
        } else if (title.length > 60) {
          pageIssues.push({
            id: crypto.randomUUID(),
            page_id: pageId,
            issue_type: SEO_ISSUES.LONG_TITLE.type,
            severity: SEO_ISSUES.LONG_TITLE.severity,
            description: SEO_ISSUES.LONG_TITLE.description,
            recommended_fix: SEO_ISSUES.LONG_TITLE.fix
          });
        }
        
        // Meta description issues
        if (!metaDescription) {
          pageIssues.push({
            id: crypto.randomUUID(),
            page_id: pageId,
            issue_type: SEO_ISSUES.MISSING_META_DESCRIPTION.type,
            severity: SEO_ISSUES.MISSING_META_DESCRIPTION.severity,
            description: SEO_ISSUES.MISSING_META_DESCRIPTION.description,
            recommended_fix: SEO_ISSUES.MISSING_META_DESCRIPTION.fix
          });
        } else if (metaDescription.length < 70) {
          pageIssues.push({
            id: crypto.randomUUID(),
            page_id: pageId,
            issue_type: SEO_ISSUES.SHORT_META_DESCRIPTION.type,
            severity: SEO_ISSUES.SHORT_META_DESCRIPTION.severity,
            description: SEO_ISSUES.SHORT_META_DESCRIPTION.description,
            recommended_fix: SEO_ISSUES.SHORT_META_DESCRIPTION.fix
          });
        } else if (metaDescription.length > 160) {
          pageIssues.push({
            id: crypto.randomUUID(),
            page_id: pageId,
            issue_type: SEO_ISSUES.LONG_META_DESCRIPTION.type,
            severity: SEO_ISSUES.LONG_META_DESCRIPTION.severity,
            description: SEO_ISSUES.LONG_META_DESCRIPTION.description,
            recommended_fix: SEO_ISSUES.LONG_META_DESCRIPTION.fix
          });
        }
        
        // H1 issues
        if (!h1) {
          pageIssues.push({
            id: crypto.randomUUID(),
            page_id: pageId,
            issue_type: SEO_ISSUES.MISSING_H1.type,
            severity: SEO_ISSUES.MISSING_H1.severity,
            description: SEO_ISSUES.MISSING_H1.description,
            recommended_fix: SEO_ISSUES.MISSING_H1.fix
          });
        } else if (h1Count > 1) {
          pageIssues.push({
            id: crypto.randomUUID(),
            page_id: pageId,
            issue_type: SEO_ISSUES.MULTIPLE_H1.type,
            severity: SEO_ISSUES.MULTIPLE_H1.severity,
            description: SEO_ISSUES.MULTIPLE_H1.description,
            recommended_fix: SEO_ISSUES.MULTIPLE_H1.fix
          });
        }
        
        // Word count issue
        if (wordCount < 300) {
          pageIssues.push({
            id: crypto.randomUUID(),
            page_id: pageId,
            issue_type: SEO_ISSUES.LOW_WORD_COUNT.type,
            severity: SEO_ISSUES.LOW_WORD_COUNT.severity,
            description: SEO_ISSUES.LOW_WORD_COUNT.description,
            recommended_fix: SEO_ISSUES.LOW_WORD_COUNT.fix
          });
        }
        
        // Missing alt text
        if (imagesWithoutAlt > 0) {
          pageIssues.push({
            id: crypto.randomUUID(),
            page_id: pageId,
            issue_type: SEO_ISSUES.MISSING_ALT_TEXT.type,
            severity: SEO_ISSUES.MISSING_ALT_TEXT.severity,
            description: `${imagesWithoutAlt} imágenes sin texto alternativo`,
            recommended_fix: SEO_ISSUES.MISSING_ALT_TEXT.fix
          });
        }
        
        // Canonical issue
        if (!canonicalUrl) {
          pageIssues.push({
            id: crypto.randomUUID(),
            page_id: pageId,
            issue_type: SEO_ISSUES.MISSING_CANONICAL.type,
            severity: SEO_ISSUES.MISSING_CANONICAL.severity,
            description: SEO_ISSUES.MISSING_CANONICAL.description,
            recommended_fix: SEO_ISSUES.MISSING_CANONICAL.fix
          });
        }
        
        // Page load time issue
        if (loadTimeMs > 3000) {
          pageIssues.push({
            id: crypto.randomUUID(),
            page_id: pageId,
            issue_type: SEO_ISSUES.SLOW_PAGE_LOAD.type,
            severity: SEO_ISSUES.SLOW_PAGE_LOAD.severity,
            description: `Tiempo de carga: ${loadTimeMs}ms`,
            recommended_fix: SEO_ISSUES.SLOW_PAGE_LOAD.fix
          });
        }
        
        // Page size issue
        if (pageSize > 1000) {
          pageIssues.push({
            id: crypto.randomUUID(),
            page_id: pageId,
            issue_type: SEO_ISSUES.LARGE_PAGE_SIZE.type,
            severity: SEO_ISSUES.LARGE_PAGE_SIZE.severity,
            description: `Tamaño de página: ${pageSize}KB`,
            recommended_fix: SEO_ISSUES.LARGE_PAGE_SIZE.fix
          });
        }
        
        // Schema markup issue
        if (!pageEntry.has_schema_markup) {
          pageIssues.push({
            id: crypto.randomUUID(),
            page_id: pageId,
            issue_type: SEO_ISSUES.NO_SCHEMA_MARKUP.type,
            severity: SEO_ISSUES.NO_SCHEMA_MARKUP.severity,
            description: SEO_ISSUES.NO_SCHEMA_MARKUP.description,
            recommended_fix: SEO_ISSUES.NO_SCHEMA_MARKUP.fix
          });
        }
        
        // Store issues in database
        if (pageIssues.length > 0) {
          const { error: issuesError } = await supabase
            .from('seo_crawl_issues')
            .insert(pageIssues);
            
          if (issuesError) {
            console.error(`Error saving issues for page ${url}:`, issuesError);
          }
          
          issues.push(...pageIssues);
          totalIssues += pageIssues.length;
        }
        
      } catch (error) {
        console.error(`Error crawling ${url}:`, error);
      }
    }
    
    resolve();
  });
  
  // Execute the crawl with timeout
  try {
    await Promise.race([crawlPromise, timeoutPromise]);
  } catch (error) {
    console.error('Crawl execution error:', error);
  }
  
  const totalTimeSeconds = Math.round((Date.now() - startTime) / 1000);
  console.log(`Crawl completed. Analyzed ${pages.length} pages, found ${totalIssues} issues. Time: ${totalTimeSeconds}s`);
  
  // Update crawl result
  const { error: updateError } = await supabase
    .from('seo_crawl_results')
    .update({
      pages_crawled: pages.length,
      issues_count: totalIssues,
      total_time_seconds: totalTimeSeconds,
      status: 'completed'
    })
    .eq('id', settings.crawlId);
    
  if (updateError) {
    console.error('Error updating crawl result:', updateError);
  }
  
  return {
    pages_crawled: pages.length,
    issues_count: totalIssues,
    total_time_seconds: totalTimeSeconds
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  
  try {
    if (req.method === 'POST') {
      console.log("Received crawl request");
      
      const settings: CrawlSettings = await req.json();
      console.log("Request body parsed:", settings);
      
      if (!settings.url || !settings.clientId || !settings.crawlId) {
        console.error("Missing required fields:", settings);
        return new Response(
          JSON.stringify({ 
            error: 'Missing required fields: url, clientId, and crawlId are required' 
          }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
      // Start the crawl process
      console.log("Starting crawl process for:", settings.url);
      const result = await crawlSite(settings);
      console.log("Crawl completed with result:", result);
      
      return new Response(
        JSON.stringify(result),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Function error:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
