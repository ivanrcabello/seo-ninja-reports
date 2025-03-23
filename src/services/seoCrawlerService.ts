
import { supabase } from '@/integrations/supabase/client';
import { handleServiceError } from '@/services/api/baseService';
import { toast } from 'sonner';

export interface CrawlSettings {
  url: string;
  clientId: string;
  maxPages?: number;
  excludePatterns?: string[];
  includePatterns?: string[];
  followExternalLinks?: boolean;
}

export interface CrawlResult {
  id: string;
  client_id: string;
  domain: string;
  crawl_date: string;
  pages_crawled: number;
  issues_count: number;
  status: 'processing' | 'completed' | 'failed';
  total_time_seconds: number;
}

export interface CrawlPage {
  id: string;
  crawl_id: string;
  url: string;
  status_code: number;
  title: string;
  meta_description: string;
  h1: string;
  canonical_url: string;
  robots_directives: string;
  word_count: number;
  load_time_ms: number;
  is_indexable: boolean;
}

export interface CrawlIssue {
  id: string;
  page_id: string;
  issue_type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  recommended_fix: string;
}

export interface CrawlLink {
  id: string;
  page_id: string;
  url: string;
  anchor_text: string;
  is_internal: boolean;
  is_broken: boolean;
  status_code: number;
  follow: boolean;
}

export const startCrawl = async (settings: CrawlSettings) => {
  try {
    const response = await supabase.functions.invoke('seo-crawler', {
      body: settings
    });
    
    if (response.error) {
      throw new Error(response.error.message || 'Error al iniciar el análisis SEO');
    }
    
    toast.success('Análisis SEO iniciado correctamente');
    return response.data;
  } catch (error: any) {
    return handleServiceError(error, 'Error al iniciar el análisis SEO');
  }
};

export const getCrawlResults = async (clientId: string) => {
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

export const getCrawlResult = async (id: string) => {
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

export const getCrawlPages = async (crawlId: string) => {
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

export const getCrawlIssues = async (pageId: string) => {
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

export const getCrawlLinks = async (pageId: string) => {
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

export const getAllIssuesForCrawl = async (crawlId: string) => {
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

export const deleteCrawlResult = async (id: string) => {
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
