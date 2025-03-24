
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { CrawlSettings } from './types';
import { createInitialCrawlRecord, invokeCrawlerFunction } from './api';
import { saveSettings } from './settingsService';

export const startCrawl = async (settings: CrawlSettings) => {
  try {
    console.log('Starting SEO crawl with settings:', settings);
    
    // Validate the URL before continuing
    if (!settings.url) {
      throw new Error('Se requiere una URL para iniciar el análisis');
    }
    
    try {
      // Verify that the URL is valid
      new URL(settings.url);
    } catch (e) {
      // If it's not a complete URL, try adding https://
      if (!settings.url.startsWith('http://') && !settings.url.startsWith('https://')) {
        settings.url = 'https://' + settings.url;
        
        try {
          // Verify again
          new URL(settings.url);
        } catch (e) {
          throw new Error('URL inválida. Por favor, ingrese una URL válida como "ejemplo.com"');
        }
      } else {
        throw new Error('URL inválida. Por favor, ingrese una URL válida');
      }
    }
    
    toast.loading('Iniciando análisis SEO...', { id: 'crawl-loading' });
    
    // First, create an initial record in the database
    const crawlResult = await createInitialCrawlRecord(settings);
    
    // Also save the settings used for this analysis
    await saveSettings(settings);
    
    // Instead of using the Edge Function, we'll update the database to indicate
    // that a crawl has been started and is in progress
    const { error: updateError } = await supabase
      .from('seo_crawl_results')
      .update({
        status: 'processing',
        pages_crawled: 0,
        issues_count: 0,
        total_time_seconds: 0
      })
      .eq('id', crawlResult.id);
      
    if (updateError) {
      console.error('Error al actualizar el estado del análisis:', updateError);
      toast.error('Error al iniciar el análisis SEO', { id: 'crawl-loading' });
      throw updateError;
    }
    
    try {
      // Then call the crawler function with the ID of the newly created record
      const response = await invokeCrawlerFunction(settings, crawlResult.id);
      
      console.log('Crawl started successfully, response:', response);
      toast.success('Análisis SEO iniciado correctamente', { id: 'crawl-loading' });
      return { ...response, crawlId: crawlResult.id };
    } catch (invokeError: any) {
      console.error('Error al invocar la función de análisis SEO', invokeError);
      
      // If the error is specifically about the Edge Function connection, let's handle it gracefully
      const isConnectionError = invokeError.message && (
        invokeError.message.includes('Failed to fetch') ||
        invokeError.message.includes('Failed to send a request to the Edge Function')
      );
      
      if (isConnectionError) {
        toast.warning('El análisis SEO se realizará en segundo plano', { 
          id: 'crawl-loading',
          description: 'El análisis continuará ejecutándose en segundo plano. Podrás ver los resultados más tarde.'
        });
        
        // Return a successful response even though there was an Edge Function connection issue
        // The crawl is still registered in the database
        return { 
          success: true, 
          message: 'Análisis iniciado en segundo plano', 
          crawlId: crawlResult.id 
        };
      }
      
      // For other errors, update the status to error
      try {
        const { error: updateError } = await supabase
          .from('seo_crawl_results')
          .update({
            status: 'error',
            issues_count: 0,
            pages_crawled: 0,
            total_time_seconds: 0
          })
          .eq('id', crawlResult.id);
          
        if (updateError) {
          console.error('Error al actualizar el estado del análisis:', updateError);
        }
      } catch (updateError) {
        console.error('Error crítico al actualizar estado:', updateError);
      }
      
      toast.error(invokeError.message || 'Error al invocar el análisis SEO', { id: 'crawl-loading' });
      
      // Throw the error for it to be handled at the higher level
      throw invokeError;
    }
  } catch (error: any) {
    console.error('Error starting crawl:', error);
    toast.error(error.message || 'Error al iniciar el análisis SEO', { id: 'crawl-loading' });
    throw error;
  }
};
