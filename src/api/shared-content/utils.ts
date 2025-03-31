
import { supabase } from '@/integrations/supabase/client';
import { ExistsResponse, ProtectionResponse, AccessLogOptions, AccessLogType, SharedContentType } from '@/types/shared-content';
import { SharedContentRow } from '@/types/supabase-types';

/**
 * Verifica si un contenido compartido existe
 */
export const checkContentExists = async (
  contentId: string, 
  contentType?: SharedContentType
): Promise<ExistsResponse> => {
  try {
    const { data, error } = await supabase.rpc('check_shared_content_exists', {
      content_id: contentId,
      content_type: contentType
    });
    
    if (error) throw error;
    
    return { exists: !!data, error: null };
  } catch (error: any) {
    console.error(`Error verificando si existe el contenido ${contentType}:`, error);
    return { exists: false, error };
  }
};

/**
 * Verifica si un contenido está protegido con contraseña
 */
export const checkContentPasswordProtection = async (
  contentId: string,
  contentType?: SharedContentType
): Promise<ProtectionResponse> => {
  try {
    const { data, error } = await supabase.rpc('check_shared_content_password', {
      content_id: contentId,
      content_type: contentType
    });
    
    if (error) throw error;
    
    return { isProtected: !!data, error: null };
  } catch (error: any) {
    console.error(`Error verificando protección con contraseña para ${contentType}:`, error);
    return { isProtected: false, error };
  }
};

/**
 * Verifica la contraseña de un contenido compartido
 */
export const verifyContentPassword = async (
  contentId: string,
  contentType: SharedContentType,
  password: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('verify_shared_content_password', {
      content_id: contentId,
      content_type: contentType,
      password_param: password
    });
    
    if (error) throw error;
    
    return !!data;
  } catch (error: any) {
    console.error(`Error verificando contraseña para ${contentType}:`, error);
    return false;
  }
};

/**
 * Registra un acceso a un contenido compartido
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
    console.error(`Error registrando acceso a ${contentType}:`, error);
  }
};
