
// Module for simplified analysis when full crawling fails
import { SupabaseInstance, PageCrawlResult } from '../types.ts';

export async function simplifiedAnalysis(
  supabase: SupabaseInstance, 
  url: string, 
  crawlId: string
): Promise<PageCrawlResult | null> {
  console.log(`Realizando análisis simplificado para: ${url}`);
  
  try {
    // Create a simplified entry with basic information
    const pageEntry = {
      id: crypto.randomUUID(),
      crawl_id: crawlId,
      url: url,
      status_code: 0, // No status code available
      title: 'No disponible',
      meta_description: 'No disponible',
      h1: 'No disponible',
      word_count: 0,
      h1_count: 0,
      h2_count: 0,
      h3_count: 0,
      internal_links_count: 0,
      external_links_count: 0,
      is_indexable: false,
      canonical_url: '',
      image_count: 0,
      images_without_alt: 0,
      meta_robots: ''
    };
    
    // Insert the page entry
    console.log('Guardando entrada simplificada en la base de datos...');
    const { error: pageError } = await supabase
      .from('seo_crawl_pages')
      .insert(pageEntry);
      
    if (pageError) {
      console.error(`Error guardando página simplificada ${url}:`, pageError);
      throw new Error(`Error guardando página simplificada: ${pageError.message}`);
    }
    
    // Create a generic issue for the page
    const issue = {
      id: crypto.randomUUID(),
      page_id: pageEntry.id,
      issue_type: 'ERROR_ACCESO',
      severity: 'high',
      description: 'No se pudo acceder a la página para análisis',
      recommended_fix: 'Verifique que la URL sea accesible y no tenga restricciones de acceso'
    };
    
    // Insert the issue
    const { error: issueError } = await supabase
      .from('seo_crawl_issues')
      .insert(issue);
      
    if (issueError) {
      console.error(`Error guardando problema para página ${url}:`, issueError);
      // We continue even if there's an error here
    }
    
    return {
      pageId: pageEntry.id,
      url,
      issues: 1
    };
  } catch (error) {
    console.error(`Error en el análisis simplificado para ${url}:`, error);
    return null;
  }
}
