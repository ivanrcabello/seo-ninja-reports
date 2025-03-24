
// Utility functions for SEO crawler
import { SupabaseInstance } from './types.ts';

// Constants
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Normalize URL to ensure consistency
export function normalizeUrl(url: string): string {
  try {
    // If URL doesn't have a protocol, add https://
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    // Parse and normalize the URL
    const parsedUrl = new URL(url);
    
    // Remove trailing slash for consistency
    let normalizedUrl = parsedUrl.origin + parsedUrl.pathname;
    if (normalizedUrl.endsWith('/') && normalizedUrl.length > 1) {
      normalizedUrl = normalizedUrl.slice(0, -1);
    }
    
    // Add search params if any
    if (parsedUrl.search) {
      normalizedUrl += parsedUrl.search;
    }
    
    return normalizedUrl;
  } catch (error) {
    console.error('Error normalizing URL:', error);
    return url; // Return original if something goes wrong
  }
}

// Check if a URL is internal to the domain
export function isInternalUrl(baseUrl: string, url: string): boolean {
  try {
    // Handle relative URLs
    if (url.startsWith('/')) {
      console.log(`URL ${url} es interna: true`);
      return true;
    }
    
    // Handle absolute URLs
    const baseHostname = new URL(baseUrl).hostname;
    const urlHostname = new URL(url, baseUrl).hostname;
    
    const isInternal = baseHostname === urlHostname;
    console.log(`URL ${url} es interna: ${isInternal}`);
    return isInternal;
  } catch (error) {
    console.error(`Error al verificar si la URL es interna ${url}:`, error);
    return false;
  }
}

// Register crawler errors in the database
export async function registerCrawlerError(
  supabase: SupabaseInstance,
  crawlId: string,
  url: string,
  errorMessage: string
): Promise<void> {
  try {
    console.log(`Registrando error para URL ${url}: ${errorMessage}`);
    
    // Try to insert the error into the issues table
    // First we need to check if there's a page entry for this URL
    const { data: pages, error: pageError } = await supabase
      .from('seo_crawl_pages')
      .select('id')
      .eq('crawl_id', crawlId)
      .eq('url', url)
      .limit(1);
      
    if (pageError) {
      console.error('Error buscando página para registrar error:', pageError);
      return;
    }
    
    if (pages && pages.length > 0) {
      // Page exists, add the issue
      const { error } = await supabase
        .from('seo_crawl_issues')
        .insert({
          page_id: pages[0].id,
          issue_type: 'ERROR_CRAWL',
          severity: 'high',
          description: `Error durante el crawling: ${errorMessage}`,
          recommended_fix: 'Verificar que la página sea accesible y no tenga restricciones'
        });
        
      if (error) {
        console.error('Error al registrar error en base de datos:', error);
      }
    } else {
      console.log(`No se encontró página para la URL ${url}, no se pudo registrar el error`);
    }
  } catch (error) {
    console.error('Error en registerCrawlerError:', error);
  }
}

// Queue links for crawling
export async function queueLinksForCrawling(
  supabase: SupabaseInstance,
  pageId: string,
  links: string[],
  crawlId: string,
  sourceUrl: string
): Promise<void> {
  try {
    if (!links || links.length === 0) {
      console.log('No hay enlaces para procesar');
      return;
    }
    
    console.log(`Guardando ${links.length} enlaces para la página ${pageId}`);
    
    // Insert links into the links table
    const linksToInsert = links.map(url => ({
      id: crypto.randomUUID(),
      page_id: pageId,
      url: url,
      is_internal: true,
      is_broken: false,
      follow: true
    }));
    
    if (linksToInsert.length > 0) {
      const { error } = await supabase
        .from('seo_crawl_links')
        .insert(linksToInsert);
        
      if (error) {
        console.error('Error guardando enlaces:', error);
      } else {
        console.log(`${linksToInsert.length} enlaces guardados correctamente`);
      }
    }
    
    // We're not implementing full recursive crawling in this version
    // as it would exceed the function execution time limits
  } catch (error) {
    console.error(`Error procesando enlaces de ${sourceUrl}:`, error);
  }
}

// Update crawl status
export async function updateCrawlStatus(
  supabase: SupabaseInstance,
  crawlId: string,
  status: 'processing' | 'completed' | 'error',
  pagesCrawled: number,
  issuesCount: number,
  totalTimeSeconds: number
): Promise<void> {
  try {
    console.log(`Actualizando estado del crawl ${crawlId} a ${status}`);
    
    const { error } = await supabase
      .from('seo_crawl_results')
      .update({
        status: status,
        pages_crawled: pagesCrawled,
        issues_count: issuesCount,
        total_time_seconds: totalTimeSeconds
      })
      .eq('id', crawlId);
      
    if (error) {
      console.error('Error actualizando estado del crawl:', error);
    } else {
      console.log('Estado del crawl actualizado correctamente');
    }
  } catch (error) {
    console.error('Error en updateCrawlStatus:', error);
  }
}
