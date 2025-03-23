
import { supabase } from '@/integrations/supabase/client';
import { CrawlSettings, SavedCrawlSettings } from './types';

export const saveSettings = async (settings: CrawlSettings): Promise<void> => {
  try {
    // Comprobar si ya existe una configuración para este dominio y cliente
    const { data: existingSettings } = await supabase
      .from('seo_crawl_settings')
      .select('*')
      .eq('client_id', settings.clientId)
      .eq('domain', settings.url)
      .single();
      
    const configToSave = {
      client_id: settings.clientId,
      domain: settings.url,
      max_pages: settings.maxPages || 100,
      exclude_patterns: settings.excludePatterns || [],
      include_patterns: settings.includePatterns || [],
      follow_external_links: settings.followExternalLinks || false
    };
    
    if (existingSettings) {
      // Actualizar configuración existente
      const { error } = await supabase
        .from('seo_crawl_settings')
        .update(configToSave)
        .eq('id', existingSettings.id);
        
      if (error) throw error;
    } else {
      // Crear nueva configuración
      const { error } = await supabase
        .from('seo_crawl_settings')
        .insert(configToSave);
        
      if (error) throw error;
    }
  } catch (error: any) {
    console.error('Error al guardar configuración:', error);
    // No mostramos toast para no interrumpir el flujo principal
  }
};

export const getSettings = async (clientId: string, domain: string): Promise<SavedCrawlSettings | null> => {
  try {
    const { data, error } = await supabase
      .from('seo_crawl_settings')
      .select('*')
      .eq('client_id', clientId)
      .eq('domain', domain)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        // No se encontró configuración, es normal
        return null;
      }
      throw error;
    }
    
    return data as SavedCrawlSettings;
  } catch (error: any) {
    console.error('Error al obtener configuración guardada:', error);
    return null;
  }
};
