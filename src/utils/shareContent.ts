
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

/**
 * Función simple para compartir cualquier tipo de contenido
 */
export async function shareContent(options: {
  contentId: string;
  contentType: 'report' | 'proposal' | 'invoice' | 'contract';
  title: string;
  data: any;
  clientName?: string;
  clientWebsite?: string;
  usePassword?: boolean;
  password?: string;
}): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Validar datos de entrada
    if (!options.contentId || !options.contentType || !options.title) {
      console.error('Datos de compartir incompletos', options);
      return { success: false, error: 'Datos incompletos para compartir' };
    }

    console.log(`Compartiendo ${options.contentType} con ID: ${options.contentId}`);
    
    // Crear un ID único para la URL compartida
    const sharedUrlId = uuidv4();
    
    // Datos para insertar en la base de datos
    const insertData = {
      original_id: options.contentId,
      content_type: options.contentType,
      title: options.title,
      content: options.data || {},
      status: options.data?.status || 'active',
      shared_url: sharedUrlId,
      password: options.usePassword ? options.password : null,
      client_name: options.clientName || '',
      client_website: options.clientWebsite || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Insertar en la tabla shared_content
    const { data, error } = await supabase
      .from('shared_content')
      .insert(insertData)
      .select();
    
    if (error) {
      console.error('Error al insertar contenido compartido:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Contenido compartido exitosamente:', data);

    // Actualizar la tabla específica según el tipo de contenido
    if (options.contentType === 'report') {
      const { error: updateError } = await supabase
        .from('reports')
        .update({ shared_url: sharedUrlId })
        .eq('id', options.contentId);
        
      if (updateError) {
        console.warn('No se pudo actualizar la referencia compartida en reports:', updateError);
      }
    }

    // URL completa para compartir
    const sharedUrl = sharedUrlId;
    
    return { success: true, url: sharedUrl };
  } catch (error: any) {
    console.error('Error en shareContent:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtiene la URL del frontend para contenido compartido
 */
export function getShareUrl(contentType: string, urlId: string): string {
  return `${window.location.origin}/shared/${contentType}s/${urlId}`;
}
