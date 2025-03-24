
// Simplified analysis when page cannot be fetched
import { SupabaseInstance, PageCrawlResult } from '../types.ts';

export async function simplifiedAnalysis(supabase: SupabaseInstance, url: string, crawlId: string): Promise<PageCrawlResult | null> {
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
