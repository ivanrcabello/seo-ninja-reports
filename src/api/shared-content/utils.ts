
import { supabase } from '@/integrations/supabase/client';
import { AccessLogOptions, AccessLogType, PasswordVerificationResponse } from '@/types/shared-content';

/**
 * Comprueba si el contenido compartido existe
 */
export const checkContentExists = async (
  contentType: string, 
  contentId: string
): Promise<{ exists: boolean; error?: Error }> => {
  try {
    let tableName;
    
    switch (contentType) {
      case 'report':
        tableName = 'reports';
        break;
      case 'invoice':
        tableName = 'client_invoices';
        break;
      case 'proposal':
        tableName = 'client_proposals';
        break;
      case 'contract':
        tableName = 'client_contracts';
        break;
      default:
        throw new Error(`Tipo de contenido no válido: ${contentType}`);
    }
    
    // Intentar buscar primero por ID directo
    const { data, error } = await supabase
      .from(tableName)
      .select('id')
      .or(`id.eq.${contentId},shared_url.eq.${contentId}`)
      .maybeSingle();
    
    if (error) throw error;
    
    return { exists: !!data };
  } catch (error: any) {
    console.error(`Error checking if ${contentType} exists:`, error);
    return { exists: false, error };
  }
};

/**
 * Comprueba si el contenido está protegido con contraseña
 */
export const checkContentPasswordProtection = async (
  contentType: string,
  contentId: string
): Promise<{ isProtected: boolean; error?: Error }> => {
  try {
    let tableName;
    
    switch (contentType) {
      case 'report':
        tableName = 'reports';
        break;
      case 'invoice':
        tableName = 'client_invoices';
        break;
      case 'proposal':
        tableName = 'client_proposals';
        break;
      case 'contract':
        tableName = 'client_contracts';
        break;
      default:
        throw new Error(`Tipo de contenido no válido: ${contentType}`);
    }
    
    const { data, error } = await supabase
      .from(tableName)
      .select('password')
      .or(`id.eq.${contentId},shared_url.eq.${contentId}`)
      .maybeSingle();
    
    if (error) throw error;
    
    return { isProtected: !!data?.password };
  } catch (error: any) {
    console.error(`Error checking ${contentType} password protection:`, error);
    return { isProtected: false, error };
  }
};

/**
 * Verifica la contraseña para el contenido protegido
 */
export const verifyContentPassword = async (
  contentType: string,
  contentId: string,
  password: string
): Promise<boolean> => {
  try {
    let tableName;
    let rpcName = '';
    
    switch (contentType) {
      case 'report':
        tableName = 'reports';
        rpcName = 'verify_shared_report_password';
        break;
      case 'invoice':
        tableName = 'client_invoices';
        rpcName = 'verify_shared_invoice_password';
        break;
      case 'proposal':
        tableName = 'client_proposals';
        rpcName = 'verify_shared_proposal_password';
        break;
      case 'contract':
        tableName = 'client_contracts';
        rpcName = 'verify_shared_contract_password';
        break;
      default:
        throw new Error(`Tipo de contenido no válido: ${contentType}`);
    }
    
    // Intentar usar RPC si está disponible
    if (rpcName) {
      const { data, error } = await supabase
        .rpc(rpcName, { 
          content_id_param: contentId,
          password_param: password
        });
      
      if (!error) {
        return Boolean(data);
      }
      
      // Si hay error, fallback al método directo
      console.warn(`RPC ${rpcName} failed, falling back to direct query:`, error);
    }
    
    // Método directo si no hay RPC o falló
    const { data, error } = await supabase
      .from(tableName)
      .select('password')
      .or(`id.eq.${contentId},shared_url.eq.${contentId}`)
      .maybeSingle();
    
    if (error) throw error;
    
    if (!data?.password) {
      return false;
    }
    
    return data.password === password;
  } catch (error: any) {
    console.error(`Error verifying ${contentType} password:`, error);
    return false;
  }
};

/**
 * Registra acceso al contenido compartido
 */
export const logContentAccess = async (
  contentType: string,
  contentId: string, 
  options: AccessLogOptions,
  logType: AccessLogType
): Promise<void> => {
  try {
    // Crear un registro de acceso en la tabla shared_content_access_logs
    await supabase
      .from('shared_content_access_logs')
      .insert([{
        content_type: contentType,
        content_id: contentId,
        access_type: logType,
        successful: options.successful,
        error_message: options.error || null,
        ip_address: null, // Esto se captura en el lado del servidor
        user_agent: navigator.userAgent || null,
        password_attempt: options.passwordAttempt || false,
        source: options.source || 'web_client'
      }]);
  } catch (error) {
    console.error(`Error logging ${contentType} access:`, error);
    // No propagamos el error para evitar interrumpir el flujo principal
  }
};
