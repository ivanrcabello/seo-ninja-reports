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
    
    // Now call the edge function to start the crawl in background
    try {
      console.log('Llamando al edge function para iniciar el análisis con Bright Data');
      console.log('crawlId:', crawlResult.id);
      console.log('URL:', settings.url);
      
      // Create timeout for the function call
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 180000); // 3 minutes timeout
      
      // Edge function invocation
      const response = await supabase.functions.invoke('seo-crawler', {
        body: { 
          url: settings.url, 
          crawlId: crawlResult.id 
        }
      });
      
      clearTimeout(timeoutId);
      
      console.log('Respuesta completa del edge function:', response);
      
      if (response.error) {
        console.error('Error del edge function:', response.error);
        
        // Check if the error is related to the API key
        if (response.error.message && response.error.message.includes('BRIGHT_DATA_API_KEY')) {
          toast.error('Error: API key de Bright Data no configurada. Por favor, configure la API key en las variables de entorno de Supabase.', { 
            id: 'crawl-loading',
            duration: 8000
          });
        } else {
          toast.warning('El análisis se ha iniciado, pero puede haber problemas. Por favor, verifique la configuración y la URL.', { 
            id: 'crawl-loading',
            duration: 5000
          });
        }
      } else {
        console.log('Respuesta del edge function:', response.data);
        
        if (!response.data?.pageId) {
          toast.warning('El análisis se ha iniciado pero puede haber problemas. Compruebe los registros para más detalles.', {
            id: 'crawl-loading',
            duration: 5000
          });
        } else {
          // Success
          toast.success('Análisis SEO completado correctamente', { 
            id: 'crawl-loading',
            description: 'Se encontraron ' + (response.data.issuesCount || 0) + ' problemas en la página principal.'
          });
        }
      }
    } catch (edgeFunctionError) {
      console.error('Error al invocar edge function:', edgeFunctionError);
      
      // If it's a timeout/abort error, handle it specifically
      if (edgeFunctionError.name === 'AbortError') {
        console.error('La llamada al edge function tardó demasiado tiempo y fue abortada');
        toast.warning('El análisis se ha iniciado pero está tardando más de lo esperado. Se continuará en segundo plano.', {
          id: 'crawl-loading',
          duration: 5000
        });
      } else {
        // Other connection error type
        toast.warning('El análisis se ha iniciado, pero hay problemas de conexión. Verifique los registros para más detalles.', { 
          id: 'crawl-loading',
          duration: 5000
        });
      }
    }
    
    // Return the crawl info even if there were issues with the edge function
    // as the record has been created and the user can check the status later
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
