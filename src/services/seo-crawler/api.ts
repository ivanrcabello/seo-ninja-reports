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

interface EdgeFunctionResponse {
  data?: any;
  error?: { message: string };
}

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

    // Validate URL format
    let validUrl: string;
    try {
      const url = new URL(settings.url);
      validUrl = url.toString();
    } catch (e) {
      // Try to fix URL by adding https:// if needed
      if (!settings.url.startsWith('http://') && !settings.url.startsWith('https://')) {
        try {
          const url = new URL(`https://${settings.url}`);
          validUrl = url.toString();
        } catch (e) {
          throw new Error('Invalid URL format');
        }
      } else {
        throw new Error('Invalid URL format');
      }
    }

    // Update settings with valid URL
    settings.url = validUrl;

    console.log(`Sending request to seo-crawler function with validated URL: ${validUrl}`);

    // Make the function call with explicit timeout and better error handling
    try {
      const functionPromise = supabase.functions.invoke('seo-crawler', {
        body: {
          ...settings,
          crawlId
        },
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Request timed out')), 30000) // 30-second timeout
      );
      
      // Use Promise.race with proper type checking
      const response = await Promise.race([
        functionPromise,
        timeoutPromise
      ]);
      
      // Type guard to ensure we have a proper response with data or error
      if (response && typeof response === 'object') {
        const typedResponse = response as EdgeFunctionResponse;
        
        if (typedResponse.error) {
          console.error('Edge function error response:', typedResponse.error);
          throw new Error(typedResponse.error.message || 'Error al iniciar el análisis SEO');
        }
        
        if (!typedResponse.data) {
          throw new Error('No se recibió respuesta del servidor');
        }
        
        return typedResponse.data;
      } else {
        throw new Error('Respuesta inesperada del servidor');
      }
    } catch (err: any) {
      console.error('Edge function invocation error:', err);
      
      if (err.message === 'Failed to fetch') {
        throw new Error('No se pudo conectar con el servidor de análisis. Por favor, verifique su conexión a internet e inténtelo de nuevo.');
      } else if (err.message.includes('Failed to send a request to the Edge Function')) {
        // Update status to error in the database
        await supabase
          .from('seo_crawl_results')
          .update({
            status: 'error',
            issues_count: 0,
            pages_crawled: 0,
            total_time_seconds: 0
          })
          .eq('id', crawlId);
          
        throw new Error('Error de conexión con el servicio de análisis SEO. Por favor, inténtelo más tarde.');
      }
      
      throw err;
    }
  } catch (error: any) {
    console.error('Error in invokeCrawlerFunction:', error);
    
    // Format error message based on error type
    let errorMessage = 'Error al invocar la función de análisis SEO';
    if (error.message === 'Failed to fetch') {
      errorMessage = 'No se pudo conectar con el servidor. Por favor, inténtelo de nuevo.';
    } else if (error.message === 'Request timed out') {
      errorMessage = 'La solicitud ha tardado demasiado. Por favor, inténtelo de nuevo.';
    } else if (error.message) {
      errorMessage = error.message;
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
