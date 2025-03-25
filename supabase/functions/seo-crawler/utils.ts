
// Utility functions for SEO crawler
import { SupabaseInstance } from './types.ts';
import { corsHeaders } from './constants.ts';

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
    
    // Update the crawl record with the error
    const { error } = await supabase
      .from('seo_crawler_crawls')
      .update({
        status: 'failed',
        error_message: errorMessage,
        completed_at: new Date().toISOString()
      })
      .eq('id', crawlId);
      
    if (error) {
      console.error('Error actualizando estado del crawl:', error);
    }
  } catch (error) {
    console.error('Error en registerCrawlerError:', error);
  }
}

// Queue links for crawling (simplified version for now)
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
      crawl_id: crawlId,
      page_id: pageId,
      url: url,
      is_internal: isInternalUrl(sourceUrl, url),
      is_broken: false,
      follow: true
    }));
    
    if (linksToInsert.length > 0) {
      const { error } = await supabase
        .from('seo_crawler_links')
        .insert(linksToInsert);
        
      if (error) {
        console.error('Error guardando enlaces:', error);
      } else {
        console.log(`${linksToInsert.length} enlaces guardados correctamente`);
      }
    }
  } catch (error) {
    console.error(`Error procesando enlaces de ${sourceUrl}:`, error);
  }
}
