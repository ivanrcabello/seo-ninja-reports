
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
    
    // Datos para insertar en la base de datos (sin password)
    const insertData = {
      original_id: options.contentId,
      content_type: options.contentType,
      title: options.title,
      content: options.data || {},
      status: options.data?.status || 'active',
      shared_url: sharedUrlId,
      password: null, // Siempre null ya que eliminamos la protección con contraseña
      client_name: options.clientName || '',
      client_website: options.clientWebsite || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Primero verificar si ya existe una entrada compartida para este contenido
    const { data: existingSharedContent, error: checkError } = await supabase
      .from('shared_content')
      .select('shared_url')
      .eq('original_id', options.contentId)
      .eq('content_type', options.contentType)
      .maybeSingle();
      
    if (checkError) {
      console.error('Error al verificar contenido compartido existente:', checkError);
    }
    
    // Si ya existe uno compartido, actualizarlo
    if (existingSharedContent?.shared_url) {
      console.log('Actualizando contenido compartido existente');
      const { data: updatedData, error: updateError } = await supabase
        .from('shared_content')
        .update({
          title: options.title,
          content: options.data || {},
          status: options.data?.status || 'active',
          client_name: options.clientName || '',
          client_website: options.clientWebsite || '',
          updated_at: new Date().toISOString()
        })
        .eq('original_id', options.contentId)
        .eq('content_type', options.contentType)
        .select();
        
      if (updateError) {
        console.error('Error al actualizar contenido compartido:', updateError);
        return { success: false, error: updateError.message };
      }
      
      return { success: true, url: existingSharedContent.shared_url };
    }
    
    // Si no existe, insertar nueva entrada
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
    } else if (options.contentType === 'proposal') {
      const { error: updateError } = await supabase
        .from('client_proposals')
        .update({ shared_url: sharedUrlId })
        .eq('id', options.contentId);
        
      if (updateError) {
        console.warn('No se pudo actualizar la referencia compartida en client_proposals:', updateError);
      }
    } else if (options.contentType === 'invoice') {
      const { error: updateError } = await supabase
        .from('client_invoices')
        .update({ shared_url: sharedUrlId })
        .eq('id', options.contentId);
        
      if (updateError) {
        console.warn('No se pudo actualizar la referencia compartida en client_invoices:', updateError);
      }
    } else if (options.contentType === 'contract') {
      const { error: updateError } = await supabase
        .from('client_contracts')
        .update({ shared_url: sharedUrlId })
        .eq('id', options.contentId);
        
      if (updateError) {
        console.warn('No se pudo actualizar la referencia compartida en client_contracts:', updateError);
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
