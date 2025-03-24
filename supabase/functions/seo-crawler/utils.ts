// Utility functions for SEO Crawler
import { SupabaseInstance } from './types.ts';
import { SEO_ISSUES } from './constants.ts';

// Helper function to detect if a URL is internal
export function isInternalUrl(baseUrl: string, url: string): boolean {
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
export function normalizeUrl(url: string): string {
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
export async function queueLinksForCrawling(
  supabase: SupabaseInstance, 
  pageId: string, 
  links: string[], 
  crawlId: string, 
  baseUrl: string
) {
  console.log(`Guardando ${links.length} enlaces para análisis futuro`);
  
  try {
    // First, save them as links associated with the current page
    // Limitamos a máximo 100 enlaces para no sobrecargar
    const limitedLinks = links.slice(0, 100);
    console.log(`Guardando ${limitedLinks.length} enlaces (limitado a 100 máximo)`);
    
    const linkEntries = limitedLinks.map(url => ({
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

// Update crawl status
export async function updateCrawlStatus(
  supabase: SupabaseInstance, 
  crawlId: string, 
  status: 'processing' | 'completed' | 'error', 
  pagesCrawled: number, 
  issuesCount: number, 
  totalTimeSeconds: number = 0
) {
  console.log(`Actualizando estado del crawl a "${status}"`);
  
  try {
    const { error } = await supabase
      .from('seo_crawl_results')
      .update({
        status,
        pages_crawled: pagesCrawled,
        issues_count: issuesCount,
        total_time_seconds: totalTimeSeconds
      })
      .eq('id', crawlId);
      
    if (error) {
      console.error('Error actualizando estado del crawl:', error);
      return false;
    }
    
    console.log('Estado del crawl actualizado correctamente');
    return true;
  } catch (updateError) {
    console.error('Error inesperado actualizando estado del crawl:', updateError);
    return false;
  }
}

// Register crawler error
export async function registerCrawlerError(supabase: SupabaseInstance, crawlId: string, url: string, errorMessage: string) {
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
      return null;
    }
    
    // Register the error as an issue
    const { error: issueError } = await supabase
      .from('seo_crawl_issues')
      .insert({
        id: crypto.randomUUID(),
        page_id: errorPageId,
        issue_type: SEO_ISSUES.CRAWLER_ERROR.type,
        severity: SEO_ISSUES.CRAWLER_ERROR.severity,
        description: `${SEO_ISSUES.CRAWLER_ERROR.description}: ${errorMessage}`,
        recommended_fix: SEO_ISSUES.CRAWLER_ERROR.fix
      });
      
    if (issueError) {
      console.error('Error registrando problema de crawler:', issueError);
      return null;
    }
    
    console.log('Error de crawling registrado correctamente como problema SEO');
    return errorPageId;
  } catch (dbError) {
    console.error('Error registrando el error de crawling en la base de datos:', dbError);
    return null;
  }
}
