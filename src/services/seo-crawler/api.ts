import { supabase } from '@/integrations/supabase/client';
import { handleServiceError } from '@/services/api/baseService';
import { toast } from 'sonner';
import { 
  CrawlResult, 
  CrawlPage, 
  CrawlIssue, 
  CrawlLink, 
  CrawlSettings, 
  SavedCrawlSettings 
} from './types';

export const createInitialCrawlRecord = async (settings: CrawlSettings): Promise<CrawlResult> => {
  try {
    const { data: crawlResult, error: insertError } = await supabase
      .from('seo_crawl_results')
      .insert({
        client_id: settings.clientId,
        domain: settings.url,
        status: 'processing',
        crawl_date: new Date().toISOString()
      })
      .select()
      .single();
      
    if (insertError) {
      throw new Error(`Error al crear registro de análisis: ${insertError.message}`);
    }
    
    return crawlResult as CrawlResult;
  } catch (error: any) {
    return handleServiceError(error, 'Error al crear registro inicial del análisis SEO');
  }
};

export const invokeCrawlerFunction = async (settings: CrawlSettings, crawlId: string) => {
  try {
    console.log('Invoking SEO crawler function with settings:', { 
      ...settings, 
      crawlId 
    });
    
    // Ensure we have a valid URL
    if (!settings.url) {
      throw new Error('URL is required');
    }

    // Try to validate URL format
    try {
      new URL(settings.url);
    } catch (e) {
      throw new Error('Invalid URL format');
    }

    // Make the function call with explicit timeout
    const response = await Promise.race([
      supabase.functions.invoke('seo-crawler', {
        body: {
          ...settings,
          crawlId
        },
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timed out')), 30000)
      )
    ]);

    // Check for response error
    if (response.error) {
      console.error('Edge function error response:', response.error);
      throw new Error(response.error.message || 'Error al iniciar el análisis SEO');
    }

    // Validate response data
    if (!response.data) {
      throw new Error('No se recibió respuesta del servidor');
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Error in invokeCrawlerFunction:', error);
    
    // Format error message based on error type
    let errorMessage = 'Error al invocar la función de análisis SEO';
    if (error.message === 'Failed to fetch') {
      errorMessage = 'No se pudo conectar con el servidor. Por favor, inténtelo de nuevo.';
    } else if (error.message === 'Request timed out') {
      errorMessage = 'La solicitud ha tardado demasiado. Por favor, inténtelo de nuevo.';
    }

    toast.error(errorMessage);
    return handleServiceError(error, errorMessage);
  }
};

export const fetchCrawlResults = async (clientId: string): Promise<CrawlResult[]> => {
  try {
    const { data, error } = await supabase
      .from('seo_crawl_results')
      .select('*')
      .eq('client_id', clientId)
      .order('crawl_date', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    return data as CrawlResult[];
  } catch (error: any) {
    return handleServiceError(error, 'Error al obtener resultados de análisis SEO');
  }
};

export const fetchCrawlResult = async (id: string): Promise<CrawlResult> => {
  try {
    const { data, error } = await supabase
      .from('seo_crawl_results')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      throw error;
    }
    
    return data as CrawlResult;
  } catch (error: any) {
    return handleServiceError(error, 'Error al obtener resultado de análisis SEO');
  }
};

export const fetchCrawlPages = async (crawlId: string): Promise<CrawlPage[]> => {
  try {
    const { data, error } = await supabase
      .from('seo_crawl_pages')
      .select('*')
      .eq('crawl_id', crawlId);
      
    if (error) {
      throw error;
    }
    
    return data as CrawlPage[];
  } catch (error: any) {
    return handleServiceError(error, 'Error al obtener páginas analizadas');
  }
};

export const fetchCrawlIssues = async (pageId: string): Promise<CrawlIssue[]> => {
  try {
    const { data, error } = await supabase
      .from('seo_crawl_issues')
      .select('*')
      .eq('page_id', pageId);
      
    if (error) {
      throw error;
    }
    
    return data as CrawlIssue[];
  } catch (error: any) {
    return handleServiceError(error, 'Error al obtener problemas SEO');
  }
};

export const fetchCrawlLinks = async (pageId: string): Promise<CrawlLink[]> => {
  try {
    const { data, error } = await supabase
      .from('seo_crawl_links')
      .select('*')
      .eq('page_id', pageId);
      
    if (error) {
      throw error;
    }
    
    return data as CrawlLink[];
  } catch (error: any) {
    return handleServiceError(error, 'Error al obtener enlaces');
  }
};

export const fetchAllIssuesForCrawl = async (crawlId: string) => {
  try {
    const { data, error } = await supabase
      .from('seo_crawl_pages')
      .select(`
        id,
        url,
        seo_crawl_issues (*)
      `)
      .eq('crawl_id', crawlId);
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error: any) {
    return handleServiceError(error, 'Error al obtener todos los problemas SEO');
  }
};

export const deleteCrawlRecord = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('seo_crawl_results')
      .delete()
      .eq('id', id);
      
    if (error) {
      throw error;
    }
    
    toast.success('Análisis SEO eliminado correctamente');
  } catch (error: any) {
    return handleServiceError(error, 'Error al eliminar análisis SEO');
  }
};
