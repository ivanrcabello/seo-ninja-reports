
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
    
    toast.loading('Iniciando análisis SEO con Bright Data...', { id: 'crawl-loading' });
    
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
      
      // Create timeout for the function call - we'll handle this client-side instead of passing it to the function
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 90000); // 90s timeout (aumentado para dar más tiempo)
      
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
        
        // Comprobar si el error está relacionado con la API key
        if (response.error.message && response.error.message.includes('BRIGHT_DATA_API_KEY')) {
          toast.error('Error: API key de Bright Data no configurada. Por favor, configure la API key en las variables de entorno de Supabase.', { 
            id: 'crawl-loading',
            duration: 8000
          });
        } else {
          toast.warning('El análisis se ha iniciado, pero puede haber problemas con el servicio de análisis. Se registrará como un análisis con errores.', { 
            id: 'crawl-loading',
            duration: 5000
          });
        }
      } else {
        console.log('Respuesta del edge function:', response.data);
        
        // Si no hay pageId en la respuesta, también mostramos una advertencia
        if (!response.data?.pageId) {
          toast.warning('El análisis se ha iniciado pero puede haber problemas. El resultado podría estar incompleto.', {
            id: 'crawl-loading',
            duration: 5000
          });
        } else {
          // Éxito
          toast.success('Análisis SEO completado correctamente con Bright Data', { 
            id: 'crawl-loading',
            description: 'Se encontraron ' + (response.data.issuesCount || 0) + ' problemas en la página principal.'
          });
        }
      }
    } catch (edgeFunctionError) {
      console.error('Error al invocar edge function:', edgeFunctionError);
      
      // Si es un error de timeout/abort, lo manejamos específicamente
      if (edgeFunctionError.name === 'AbortError') {
        console.error('La llamada al edge function tardó demasiado tiempo y fue abortada');
        toast.warning('El análisis se ha iniciado pero está tardando más de lo esperado. Se continuará en segundo plano.', {
          id: 'crawl-loading',
          duration: 5000
        });
      } else {
        // Otro tipo de error de conexión
        toast.warning('El análisis se ha iniciado, pero puede haber problemas de conexión con el servicio de análisis. Se registrará pero es posible que esté incompleto.', { 
          id: 'crawl-loading',
          duration: 5000
        });
      }
    }
    
    // Success message - we're always "successful" here because we've at least created a record
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
