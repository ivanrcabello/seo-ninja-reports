
import { supabase } from '@/integrations/supabase/client';
import { AccessLogOptions, AccessLogType, ExistsResponse, ProtectionResponse } from '@/types/shared-content';

/**
 * Comprueba si el contenido compartido existe
 */
export const checkContentExists = async (
  contentId: string, 
  contentType: string
): Promise<ExistsResponse> => {
  try {
    let tableName;
    
    switch (contentType) {
      case 'report':
        tableName = 'public_reports';
        break;
      case 'invoice':
        tableName = 'public_invoices';
        break;
      case 'proposal':
        tableName = 'public_proposals';
        break;
      case 'contract':
        tableName = 'public_contracts';
        break;
      default:
        throw new Error(`Tipo de contenido no válido: ${contentType}`);
    }
    
    // Try to find content by shared_url first
    const { data, error } = await supabase
      .from(tableName)
      .select('id')
      .eq('shared_url', contentId)
      .maybeSingle();
    
    if (error) throw error;
    
    return { exists: !!data, error: null };
  } catch (error: any) {
    console.error(`Error checking if ${contentType} exists:`, error);
    return { exists: false, error };
  }
};

/**
 * Comprueba si el contenido está protegido con contraseña
 */
export const checkContentPasswordProtection = async (
  contentId: string,
  contentType: string
): Promise<ProtectionResponse> => {
  try {
    let tableName;
    
    switch (contentType) {
      case 'report':
        tableName = 'public_reports';
        break;
      case 'invoice':
        tableName = 'public_invoices';
        break;
      case 'proposal':
        tableName = 'public_proposals';
        break;
      case 'contract':
        tableName = 'public_contracts';
        break;
      default:
        throw new Error(`Tipo de contenido no válido: ${contentType}`);
    }
    
    const { data, error } = await supabase
      .from(tableName)
      .select('password')
      .eq('shared_url', contentId)
      .maybeSingle();
    
    if (error) throw error;
    
    // Check if data exists and password is not null or empty
    const isProtected = !!(data && data.password && data.password.trim() !== '');
    return { isProtected, error: null };
  } catch (error: any) {
    console.error(`Error checking ${contentType} password protection:`, error);
    return { isProtected: false, error };
  }
};

/**
 * Verifica la contraseña para el contenido protegido
 */
export const verifyContentPassword = async (
  contentId: string,
  contentType: string,
  password: string
): Promise<boolean> => {
  try {
    let tableName;
    let rpcName = '';
    
    switch (contentType) {
      case 'report':
        tableName = 'public_reports';
        rpcName = 'verify_shared_report_password';
        break;
      case 'invoice':
        tableName = 'public_invoices';
        rpcName = 'verify_shared_invoice_password';
        break;
      case 'proposal':
        tableName = 'public_proposals';
        rpcName = 'verify_shared_proposal_password';
        break;
      case 'contract':
        tableName = 'public_contracts';
        rpcName = 'verify_shared_contract_password';
        break;
      default:
        throw new Error(`Tipo de contenido no válido: ${contentType}`);
    }
    
    // Try to use RPC if available
    if (rpcName) {
      const { data, error } = await supabase
        .rpc(rpcName, { 
          report_id_param: contentId,
          password_param: password
        });
      
      if (!error) {
        return Boolean(data);
      }
      
      // If there's an error, fallback to direct query
      console.warn(`RPC ${rpcName} failed, falling back to direct query:`, error);
    }
    
    // Direct method if no RPC or RPC failed
    const { data, error } = await supabase
      .from(tableName)
      .select('password')
      .eq('shared_url', contentId)
      .maybeSingle();
    
    if (error) throw error;
    
    if (!data || !data.password) {
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
  options: AccessLogOptions = { successful: true },
  logType: AccessLogType = 'view'
): Promise<void> => {
  try {
    // Insert into shared_content_access_logs using RPC
    await supabase.rpc('log_content_access', {
      content_type_param: contentType,
      content_id_param: contentId,
      access_type_param: logType,
      successful_param: options.successful,
      error_message_param: options.error || null,
      password_attempt_param: options.passwordAttempt || false,
      source_param: options.source || 'web_client'
    });
  } catch (error) {
    console.error(`Error logging ${contentType} access:`, error);
    // No propagamos el error para evitar interrumpir el flujo principal
  }
};
