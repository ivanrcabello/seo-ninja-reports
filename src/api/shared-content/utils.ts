
import { supabase } from '@/integrations/supabase/client';
import { AccessLogOptions, AccessLogType, SharedContentType } from '@/types/shared-content';
import { uuid } from '@supabase/supabase-js/dist/module/lib/helpers';
import { toast } from 'sonner';

/**
 * Verifica si un contenido compartido existe
 */
export const checkContentExists = async (contentId: string, contentType: SharedContentType): Promise<{ exists: boolean; error: Error | null }> => {
  try {
    const { data, error } = await supabase.rpc('check_shared_content_exists', {
      content_id: contentId,
      content_type: contentType
    });
    
    if (error) {
      console.error(`Error checking if ${contentType} exists:`, error);
      return { exists: false, error };
    }
    
    return { exists: !!data, error: null };
  } catch (error: any) {
    console.error(`Error checking if ${contentType} exists:`, error);
    return { exists: false, error };
  }
};

/**
 * Verifica si un contenido está protegido con contraseña
 */
export const checkContentPasswordProtection = async (contentId: string, contentType: SharedContentType): Promise<{ isProtected: boolean; error: Error | null }> => {
  try {
    const { data, error } = await supabase.rpc('check_shared_content_password', {
      content_id: contentId,
      content_type: contentType
    });
    
    if (error) {
      console.error(`Error checking if ${contentType} is password protected:`, error);
      return { isProtected: false, error };
    }
    
    return { isProtected: !!data, error: null };
  } catch (error: any) {
    console.error(`Error checking if ${contentType} is password protected:`, error);
    return { isProtected: false, error };
  }
};

/**
 * Verifica una contraseña para contenido compartido
 */
export const verifyContentPassword = async (contentId: string, contentType: SharedContentType, password: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('verify_shared_content_password', {
      content_id: contentId,
      content_type: contentType,
      password_param: password
    });
    
    if (error) {
      console.error(`Error verifying password for ${contentType}:`, error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error(`Error verifying password for ${contentType}:`, error);
    return false;
  }
};

/**
 * Registra acceso a contenido compartido
 */
export const logContentAccess = async (
  contentType: SharedContentType,
  contentId: string,
  options: AccessLogOptions,
  eventType: AccessLogType = 'view'
): Promise<void> => {
  try {
    await supabase.rpc('log_shared_content_access', {
      content_type: contentType,
      content_id: contentId,
      access_type: eventType,
      successful: options.successful,
      error_message: options.error || null,
      password_attempt: options.passwordAttempt || false,
      source: options.source || 'web_client'
    });
  } catch (error) {
    console.error(`Error logging ${contentType} access:`, error);
  }
};

/**
 * Comparte contenido (función común para todos los tipos)
 */
export const shareContent = async ({
  originalId,
  contentType,
  title,
  description = '',
  content,
  status,
  clientName = '',
  clientWebsite = '',
  isPasswordProtected = false,
  password = ''
}: {
  originalId: string;
  contentType: SharedContentType;
  title: string;
  description?: string;
  content: any;
  status: string;
  clientName?: string;
  clientWebsite?: string;
  isPasswordProtected: boolean;
  password?: string;
}): Promise<string | null> => {
  try {
    // Primero verificar si el contenido ya está compartido
    const { data: existingShared, error: checkError } = await supabase
      .from('shared_content')
      .select('shared_url')
      .eq('original_id', originalId)
      .eq('content_type', contentType)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }
    
    let sharedUrlId: string;
    
    if (existingShared) {
      // Actualizar contenido compartido existente
      sharedUrlId = existingShared.shared_url;
      
      const { error: updateError } = await supabase
        .from('shared_content')
        .update({
          title,
          description,
          content,
          status,
          password: isPasswordProtected ? password : null,
          client_name: clientName,
          client_website: clientWebsite,
          updated_at: new Date().toISOString()
        })
        .eq('shared_url', sharedUrlId);
        
      if (updateError) throw updateError;
    } else {
      // Crear nuevo contenido compartido
      sharedUrlId = uuid();
      
      // Insertar en shared_content
      const { error: insertError } = await supabase
        .from('shared_content')
        .insert({
          original_id: originalId,
          content_type: contentType,
          title,
          description,
          content,
          status,
          shared_url: sharedUrlId,
          password: isPasswordProtected ? password : null,
          client_name: clientName,
          client_website: clientWebsite
        });
        
      if (insertError) throw insertError;
      
      // Si es un informe, actualizar también la tabla de informes
      if (contentType === 'report') {
        await supabase
          .from('reports')
          .update({ shared_url: sharedUrlId })
          .eq('id', originalId);
      }
    }
    
    return sharedUrlId;
  } catch (error: any) {
    console.error('Error sharing content:', error);
    toast.error(`Error al compartir ${getTitleForContentType(contentType)}`, {
      description: error.message
    });
    return null;
  }
};

/**
 * Obtiene el título para un tipo de contenido
 */
const getTitleForContentType = (contentType: SharedContentType): string => {
  switch (contentType) {
    case 'report': return 'el informe';
    case 'proposal': return 'la propuesta';
    case 'invoice': return 'la factura';
    case 'contract': return 'el contrato';
    default: return 'el contenido';
  }
};
