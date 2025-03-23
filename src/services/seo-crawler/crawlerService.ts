
import { toast } from 'sonner';
import { CrawlSettings } from './types';
import { createInitialCrawlRecord, invokeCrawlerFunction } from './api';
import { saveSettings } from './settingsService';

export const startCrawl = async (settings: CrawlSettings) => {
  try {
    // Primero, crear un registro inicial en la base de datos directamente
    const crawlResult = await createInitialCrawlRecord(settings);
    
    // Guardamos también los ajustes usados para este análisis
    await saveSettings(settings);
    
    // Luego, llamar a la función Edge con el ID del registro recién creado
    const response = await invokeCrawlerFunction(settings, crawlResult.id);
    
    toast.success('Análisis SEO iniciado correctamente');
    return { ...response, crawlId: crawlResult.id };
  } catch (error: any) {
    throw error; // El error ya fue manejado en las funciones individuales
  }
};
