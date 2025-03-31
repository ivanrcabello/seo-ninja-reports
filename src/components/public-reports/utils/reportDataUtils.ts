import { supabase } from '@/integrations/supabase/client';
import { SharedReport } from '@/types/shared-content';
import { logError } from '@/lib/errorLogger';
import { SharedContentStatus } from "@/types/shared-content";

export interface ReportAccessOptions {
  successful: boolean;
  error?: string;
}

export type AccessLogType = 'view' | 'password' | 'not_found' | 'error';

/**
 * Verifica si un informe existe
 */
export const checkReportExists = async (reportId: string): Promise<{ exists: boolean; error: Error | null }> => {
  try {
    // Usar RPC para verificar
    const { data, error } = await supabase.rpc('check_shared_content_exists', {
      content_id: reportId,
      content_type: 'report'
    });
    
    if (error) {
      logError('checkReportExists', error);
      return { exists: false, error };
    }
    
    return { exists: data, error: null };
  } catch (error: any) {
    logError('checkReportExists', error);
    return { exists: false, error };
  }
};

/**
 * Verifica si un informe está protegido por contraseña
 */
export const checkReportPassword = async (reportId: string): Promise<{ isProtected: boolean; error: Error | null }> => {
  try {
    // Usar RPC para verificar protección por contraseña
    const { data, error } = await supabase.rpc('check_shared_content_password', {
      content_id: reportId,
      content_type: 'report'
    });
    
    if (error) {
      logError('checkReportPassword', error);
      return { isProtected: false, error };
    }
    
    return { isProtected: data, error: null };
  } catch (error: any) {
    logError('checkReportPassword', error);
    return { isProtected: false, error };
  }
};

/**
 * Verifica la contraseña de un informe compartido
 */
export const verifyReportPassword = async (reportId: string, password: string): Promise<boolean> => {
  try {
    // Usar RPC para verificar la contraseña
    const { data, error } = await supabase.rpc('verify_shared_content_password', {
      content_id: reportId,
      content_type: 'report',
      password_param: password
    });
    
    if (error) {
      logError('verifyReportPassword', error);
      return false;
    }
    
    return data;
  } catch (error: any) {
    logError('verifyReportPassword', error);
    return false;
  }
};

/**
 * Registra el acceso a un informe compartido
 */
export const logReportAccess = async (
  reportId: string, 
  options: ReportAccessOptions, 
  eventType: AccessLogType = 'view'
): Promise<void> => {
  try {
    // Usar RPC para registrar el acceso
    await supabase.rpc('log_shared_content_access', {
      content_type: 'report',
      content_id: reportId,
      access_type: eventType,
      successful: options.successful,
      error_message: options.error || null,
      password_attempt: eventType === 'password',
      source: 'web_client'
    });
  } catch (error) {
    console.error('Error registrando acceso:', error);
    // No propagamos el error para que no afecte la experiencia del usuario
  }
};

/**
 * Obtiene un informe por su URL compartida
 */
export const fetchReportBySharedUrl = async (sharedUrl: string): Promise<SharedReport | null> => {
  try {
    const { data, error } = await supabase
      .from('shared_content')
      .select('*')
      .eq('shared_url', sharedUrl)
      .eq('content_type', 'report')
      .single();
      
    if (error) {
      logError('fetchReportBySharedUrl', error);
      return null;
    }
    
    if (!data) return null;
    
    // Crear objeto SharedReport
    return {
      id: data.id,
      original_id: data.original_id,
      content_type: 'report',
      title: data.title,
      description: data.description || '',
      content: data.content,
      status: data.status,
      shared_url: data.shared_url,
      password: data.password,
      client_name: data.client_name,
      client_website: data.client_website,
      summary: data.description,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    logError('fetchReportBySharedUrl', error);
    return null;
  }
};

export const parseStatusFromString = (status: string): SharedContentStatus => {
  const validStatuses: SharedContentStatus[] = [
    "processing", "completed", "failed", "draft", "sent", 
    "accepted", "rejected", "pending", "paid", "signed", 
    "expired", "cancelled"
  ];
  
  if (validStatuses.includes(status as SharedContentStatus)) {
    return status as SharedContentStatus;
  }
  
  // Default fallback
  return "draft";
};
