
import { supabase } from '@/integrations/supabase/client';
import { CrawlResult, CrawlPage, CrawlIssue, CrawlLink, CrawlSettings, SavedCrawlSettings } from './types';

// Iniciar un nuevo análisis SEO
export const startCrawl = async (
  url: string, 
  clientId: string,
  options?: {
    maxPages?: number;
    followExternalLinks?: boolean;
    excludePatterns?: string[];
    includePatterns?: string[];
    brightDataUsername?: string;
    brightDataPassword?: string;
  }
): Promise<{success: boolean, message: string, crawlId?: string}> => {
  try {
    // Primero creamos un nuevo registro de análisis
    const { data: crawl, error } = await supabase
      .from('seo_crawl_results')
      .insert({
        domain: url,
        client_id: clientId,
        status: 'processing',
        crawl_date: new Date().toISOString(),
      })
      .select()
      .single();
      
    if (error) throw error;
    
    // Luego llamamos a la edge function para iniciar el análisis
    const { data, error: fnError } = await supabase.functions.invoke('seo-crawler', {
      body: { 
        url, 
        crawlId: crawl.id,
        ...options
      }
    });
    
    if (fnError) {
      console.error('Error al llamar a la función seo-crawler:', fnError);
      // Actualizar el estado a error
      await supabase
        .from('seo_crawl_results')
        .update({ status: 'error' })
        .eq('id', crawl.id);
        
      throw fnError;
    }
    
    return {
      success: true,
      message: 'Análisis SEO iniciado correctamente',
      crawlId: crawl.id
    };
  } catch (error) {
    console.error("Error al iniciar el análisis SEO:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido al iniciar análisis'
    };
  }
};

// Obtener todos los resultados de análisis para un cliente
export const getCrawlResults = async (clientId: string): Promise<CrawlResult[]> => {
  try {
    const { data, error } = await supabase
      .from('seo_crawl_results')
      .select('*')
      .eq('client_id', clientId)
      .order('crawl_date', { ascending: false });
      
    if (error) throw error;
    
    return data as CrawlResult[];
  } catch (error) {
    console.error("Error al obtener resultados de análisis:", error);
    throw error;
  }
};

// Obtener un resultado de análisis específico
export const getCrawlResult = async (crawlId: string): Promise<CrawlResult> => {
  try {
    const { data, error } = await supabase
      .from('seo_crawl_results')
      .select('*')
      .eq('id', crawlId)
      .single();
      
    if (error) throw error;
    
    return data as CrawlResult;
  } catch (error) {
    console.error("Error al obtener resultado de análisis:", error);
    throw error;
  }
};

// Obtener páginas de un análisis
export const getCrawlPages = async (crawlId: string): Promise<CrawlPage[]> => {
  try {
    const { data, error } = await supabase
      .from('seo_crawl_pages')
      .select('*')
      .eq('crawl_id', crawlId);
      
    if (error) throw error;
    
    // Asegurar que todas las propiedades necesarias estén presentes
    return data.map(page => ({
      ...page,
      content_type: page.content_type || 'text/html',
      issues_count: page.issues_count || 0,
      crawled_at: page.crawled_at || new Date().toISOString(),
      title: page.title || '',
      meta_description: page.meta_description || '',
      h1: page.h1 || '',
      h2_count: page.h2_count || 0,
      h3_count: page.h3_count || 0,
      word_count: page.word_count || 0,
      image_count: page.image_count || 0,
      internal_links_count: page.internal_links_count || 0,
      external_links_count: page.external_links_count || 0,
      canonical_url: page.canonical_url || '',
      robots_directives: page.robots_directives || '',
      meta_robots: page.meta_robots || '',
      is_indexable: page.is_indexable !== undefined ? page.is_indexable : true,
      page_size_kb: page.page_size_kb || 0,
      load_time_ms: page.load_time_ms || 0,
      images_without_alt: page.images_without_alt || 0,
      mobile_friendly: page.mobile_friendly !== undefined ? page.mobile_friendly : false,
      has_schema_markup: page.has_schema_markup !== undefined ? page.has_schema_markup : false,
      content_length: page.content_length || 0
    })) as CrawlPage[];
  } catch (error) {
    console.error("Error al obtener páginas del análisis:", error);
    throw error;
  }
};

// Obtener problemas de una página específica
export const getPageIssues = async (pageId: string): Promise<CrawlIssue[]> => {
  try {
    const { data, error } = await supabase
      .from('seo_crawl_issues')
      .select('*')
      .eq('page_id', pageId);
      
    if (error) throw error;
    
    // Asegurar que todas las propiedades necesarias estén presentes
    return data.map(issue => ({
      ...issue,
      severity: issue.severity as "low" | "medium" | "high" | string,
      fix_suggestion: issue.fix_suggestion || issue.recommended_fix || '',
      recommended_fix: issue.recommended_fix || '',
      element: issue.element || ''
    })) as CrawlIssue[];
  } catch (error) {
    console.error("Error al obtener problemas de la página:", error);
    throw error;
  }
};

// Obtener enlaces de una página específica
export const getPageLinks = async (pageId: string): Promise<CrawlLink[]> => {
  try {
    const { data, error } = await supabase
      .from('seo_crawl_links')
      .select('*')
      .eq('page_id', pageId);
      
    if (error) throw error;
    
    // Asegurar que todas las propiedades necesarias estén presentes
    return data.map(link => ({
      ...link,
      is_followed: link.follow !== undefined ? !!link.follow : true,
      is_broken: link.is_broken !== undefined ? link.is_broken : false,
      status_code: link.status_code || 200,
      rel_attributes: link.rel_attributes || '',
      anchor_text: link.anchor_text || ''
    })) as CrawlLink[];
  } catch (error) {
    console.error("Error al obtener enlaces de la página:", error);
    throw error;
  }
};

// Eliminar un registro de análisis y sus datos asociados
export const deleteCrawlRecord = async (crawlId: string): Promise<void> => {
  try {
    // Primero buscar todas las páginas asociadas a este análisis
    const { data: pages, error: pagesError } = await supabase
      .from('seo_crawl_pages')
      .select('id')
      .eq('crawl_id', crawlId);
      
    if (pagesError) throw pagesError;
    
    // Eliminar problemas y enlaces para cada página
    if (pages && pages.length > 0) {
      const pageIds = pages.map(page => page.id);
      
      // Eliminar problemas
      const { error: issuesError } = await supabase
        .from('seo_crawl_issues')
        .delete()
        .in('page_id', pageIds);
        
      if (issuesError) throw issuesError;
      
      // Eliminar enlaces
      const { error: linksError } = await supabase
        .from('seo_crawl_links')
        .delete()
        .in('page_id', pageIds);
        
      if (linksError) throw linksError;
    }
    
    // Eliminar todas las páginas de este análisis
    const { error: deletePageError } = await supabase
      .from('seo_crawl_pages')
      .delete()
      .eq('crawl_id', crawlId);
      
    if (deletePageError) throw deletePageError;
    
    // Finalmente eliminar el registro de análisis
    const { error: deleteCrawlError } = await supabase
      .from('seo_crawl_results')
      .delete()
      .eq('id', crawlId);
      
    if (deleteCrawlError) throw deleteCrawlError;
  } catch (error) {
    console.error("Error al eliminar registro de análisis:", error);
    throw error;
  }
};

// Guardar configuración de análisis para un cliente y dominio
export const saveSettings = async (settings: CrawlSettings): Promise<SavedCrawlSettings> => {
  try {
    const { data, error } = await supabase
      .from('seo_crawl_settings')
      .upsert({
        client_id: settings.clientId,
        domain: settings.url,
        max_pages: settings.maxPages || 100,
        follow_external_links: settings.followExternalLinks || false,
        exclude_patterns: settings.excludePatterns || [],
        include_patterns: settings.includePatterns || []
      })
      .select()
      .single();
      
    if (error) throw error;
    
    return data as SavedCrawlSettings;
  } catch (error) {
    console.error("Error al guardar configuración:", error);
    throw error;
  }
};

// Obtener configuración guardada para un cliente y dominio
export const getSettings = async (clientId: string, domain: string): Promise<SavedCrawlSettings | null> => {
  try {
    const { data, error } = await supabase
      .from('seo_crawl_settings')
      .select('*')
      .eq('client_id', clientId)
      .eq('domain', domain)
      .maybeSingle();
      
    if (error) throw error;
    
    return data as SavedCrawlSettings;
  } catch (error) {
    console.error("Error al obtener configuración:", error);
    return null;
  }
};
