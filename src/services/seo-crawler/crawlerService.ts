
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { CrawlSettings } from './types';
import { createInitialCrawlRecord, invokeCrawlerFunction } from './api';
import { saveSettings } from './settingsService';

export const startCrawl = async (settings: CrawlSettings) => {
  try {
    console.log('Starting SEO crawl with settings:', settings);
    
    // Validar la URL antes de continuar
    if (!settings.url) {
      throw new Error('Se requiere una URL para iniciar el análisis');
    }
    
    try {
      // Verificar que la URL sea válida
      new URL(settings.url);
    } catch (e) {
      // Si no es una URL completa, intentar añadir https://
      if (!settings.url.startsWith('http://') && !settings.url.startsWith('https://')) {
        settings.url = 'https://' + settings.url;
        
        try {
          // Verificar nuevamente
          new URL(settings.url);
        } catch (e) {
          throw new Error('URL inválida. Por favor, ingrese una URL válida como "ejemplo.com"');
        }
      } else {
        throw new Error('URL inválida. Por favor, ingrese una URL válida');
      }
    }
    
    toast.loading('Iniciando análisis SEO...', { id: 'crawl-loading' });
    
    // Primero, crear un registro inicial en la base de datos
    const crawlResult = await createInitialCrawlRecord(settings);
    
    // Guardamos también los ajustes usados para este análisis
    await saveSettings(settings);
    
    try {
      // Luego, llamar a la función Edge con el ID del registro recién creado
      const response = await invokeCrawlerFunction(settings, crawlResult.id);
      
      console.log('Crawl started successfully, response:', response);
      toast.success('Análisis SEO iniciado correctamente', { id: 'crawl-loading' });
      return { ...response, crawlId: crawlResult.id };
    } catch (invokeError: any) {
      console.error('Error al invocar la función de análisis SEO', invokeError);
      
      // Actualizar estado del análisis a fallido
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
      
      // Lanzar el error para que se maneje en el nivel superior
      throw invokeError;
    }
  } catch (error: any) {
    console.error('Error starting crawl:', error);
    toast.error(error.message || 'Error al iniciar el análisis SEO', { id: 'crawl-loading' });
    throw error;
  }
};
