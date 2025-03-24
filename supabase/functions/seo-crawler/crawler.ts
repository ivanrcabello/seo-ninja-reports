// Main crawler implementation
import { SupabaseInstance, PageCrawlResult, BrightDataResponse } from './types.ts';
import { BRIGHT_DATA_CONFIG, SEO_ISSUES } from './constants.ts';
import { isInternalUrl, queueLinksForCrawling, registerCrawlerError } from './utils.ts';

// Main crawler function - only crawl a single page for now
export async function crawlPage(
  supabase: SupabaseInstance, 
  url: string, 
  crawlId: string,
  customUsername?: string,
  customPassword?: string
): Promise<PageCrawlResult | null> {
  try {
    console.log(`Iniciando análisis de página: ${url}`);
    const startTime = Date.now();
    
    // Use Bright Data proxy to bypass restrictions
    const { PROXY_HOST, PROXY_PORT, DEFAULT_USER, DEFAULT_PASSWORD, TIMEOUT } = BRIGHT_DATA_CONFIG;
    
    // Use custom credentials if provided, otherwise use defaults
    const username = customUsername || Deno.env.get('BRIGHT_DATA_USERNAME') || DEFAULT_USER;
    const password = customPassword || Deno.env.get('BRIGHT_DATA_PASSWORD') || DEFAULT_PASSWORD;
    
    console.log(`Usando proxy: ${PROXY_HOST}:${PROXY_PORT}`);
    console.log(`Con credenciales: ${username.substring(0, 15)}... (${username.length} caracteres)`);
    
    // Prepare fetch options with proxy
    // The proxy requires basic auth with the provided credentials
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);
    
    try {
      // Attempt to fetch using proxy - in Deno we can't directly use the proxy
      // So we'll try to use the proxy URL format that some libraries support
      console.log(`Intentando conexión mediante proxy Bright Data`);
      
      // We would normally use a proxy configuration, but since Deno's fetch
      // doesn't support proxies directly, we would need a custom solution.
      // For testing purposes, you can implement a direct fetch and check logs.
      console.log(`ADVERTENCIA: Implementación actual simulada. En producción se requiere integración completa con Bright Data.`);
      
      // Simulate a fetch for now - in production, you would connect to Bright Data
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Cache-Control': 'max-age=0',
          // Authorization header for Bright Data would go here
          // This is just an example, actual implementation would use the proxy settings
          'X-Proxy-Info': `Using Bright Data credentials: ${username.substring(0, 5)}...` 
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      // Check response status
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Get HTML content
      const html = await response.text();
      
      // Create a DOM parser
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Extract basic page data
      const title = doc.querySelector('title')?.textContent || '';
      const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      const h1Elements = doc.querySelectorAll('h1');
      const h1 = h1Elements.length > 0 ? h1Elements[0].textContent || '' : '';
      
      // Find all links
      const links = Array.from(doc.querySelectorAll('a[href]'))
        .map(a => {
          const href = a.getAttribute('href') || '';
          // Process only internal links and valid URLs
          if (href && !href.startsWith('javascript:') && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
            try {
              // Handle relative URLs
              const fullUrl = new URL(href, url).href;
              return fullUrl;
            } catch (e) {
              console.error(`Error processing URL ${href}:`, e);
              return null;
            }
          }
          return null;
        })
        .filter(link => link !== null) as string[];
      
      // Filter to get only internal links
      const internalLinks = links.filter(link => isInternalUrl(url, link));
      
      // Analyze page for issues
      const issues = [];
      
      // Check for title
      if (!title) {
        issues.push(SEO_ISSUES.MISSING_TITLE);
      } else if (title.length > 60) {
        issues.push(SEO_ISSUES.TITLE_TOO_LONG);
      }
      
      // Check for meta description
      if (!metaDescription) {
        issues.push(SEO_ISSUES.MISSING_META_DESCRIPTION);
      } else if (metaDescription.length > 160) {
        issues.push(SEO_ISSUES.META_DESCRIPTION_TOO_LONG);
      }
      
      // Check for H1
      if (!h1) {
        issues.push(SEO_ISSUES.MISSING_H1);
      } else if (h1Elements.length > 1) {
        issues.push(SEO_ISSUES.MULTIPLE_H1);
      }
      
      // Check for images without alt text
      const images = doc.querySelectorAll('img');
      const imagesWithoutAlt = Array.from(images).filter(img => !img.hasAttribute('alt'));
      if (imagesWithoutAlt.length > 0) {
        issues.push({
          ...SEO_ISSUES.NO_ALT_TEXT,
          details: `${imagesWithoutAlt.length} imágenes sin texto alternativo`
        });
      }
      
      // Check for schema markup
      const hasSchema = doc.querySelector('script[type="application/ld+json"]') !== null;
      if (!hasSchema) {
        issues.push(SEO_ISSUES.NO_SCHEMA_MARKUP);
      }
      
      // Create page record in database
      const pageId = crypto.randomUUID();
      const { error: pageError } = await supabase
        .from('seo_crawl_pages')
        .insert({
          id: pageId,
          crawl_id: crawlId,
          url: url,
          title: title,
          meta_description: metaDescription,
          h1: h1,
          status_code: response.status,
          is_indexable: true,
          internal_links_count: internalLinks.length,
          external_links_count: links.length - internalLinks.length,
          image_count: images.length,
          images_without_alt: imagesWithoutAlt.length,
          has_schema_markup: hasSchema
        });
        
      if (pageError) {
        console.error('Error guardando datos de página:', pageError);
        throw pageError;
      }
      
      // Save issues to database
      if (issues.length > 0) {
        const issuesToInsert = issues.map(issue => ({
          page_id: pageId,
          issue_type: issue.type,
          severity: issue.severity,
          description: issue.description,
          recommended_fix: issue.fix
        }));
        
        const { error: issuesError } = await supabase
          .from('seo_crawl_issues')
          .insert(issuesToInsert);
          
        if (issuesError) {
          console.error('Error guardando issues:', issuesError);
        }
      }
      
      // Queue found links for future crawling (if needed)
      await queueLinksForCrawling(supabase, pageId, internalLinks, crawlId, url);
      
      const endTime = Date.now();
      console.log(`Análisis completado en ${(endTime - startTime) / 1000} segundos`);
      console.log(`Encontrados ${issues.length} problemas SEO`);
      
      return {
        pageId,
        url,
        issues: issues.length
      };
      
    } finally {
      clearTimeout(timeoutId);
    }
    
  } catch (error) {
    console.error(`Error analizando página ${url}:`, error);
    await registerCrawlerError(supabase, crawlId, url, error instanceof Error ? error.message : String(error));
    return null;
  }
}
