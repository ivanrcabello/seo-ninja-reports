
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
    const response = await supabase.functions.invoke('seo-crawler', {
      body: {
        ...settings,
        crawlId
      }
    });
    
    if (response.error) {
      throw new Error(response.error.message || 'Error al iniciar el análisis SEO');
    }
    
    return response.data;
  } catch (error: any) {
    return handleServiceError(error, 'Error al invocar la función de análisis SEO');
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
