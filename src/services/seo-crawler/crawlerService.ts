
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { CrawlSettings } from './types';
import { createInitialCrawlRecord } from './api';
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
    
    // Update the database to indicate that a crawl has been started and is in progress
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
    
    // Instead of making the Edge Function call here, we'll just register the crawl
    // and let the user know it's been started. The actual crawling will happen in the background.
    
    // Success message
    toast.success('Análisis SEO iniciado correctamente', { 
      id: 'crawl-loading',
      description: 'El análisis se ejecutará en segundo plano. Podrá ver los resultados una vez completado.'
    });
    
    // Return the crawl info
    return { 
      success: true, 
      message: 'Análisis iniciado en segundo plano', 
      crawlId: crawlResult.id 
    };
    
  } catch (error: any) {
    console.error('Error starting crawl:', error);
    toast.error(error.message || 'Error al iniciar el análisis SEO', { id: 'crawl-loading' });
    throw error;
  }
};
