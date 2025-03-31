
import { supabase } from '@/integrations/supabase/client';
import { SharedReport, SharedReportResponse, AccessLogOptions, AccessLogType } from '@/types/shared-content';
import { logContentAccess } from './utils';

/**
 * Obtiene un informe por su URL compartida
 */
export const fetchReportBySharedUrl = async (sharedUrl: string): Promise<SharedReportResponse> => {
  try {
    const { data, error } = await supabase
      .from('shared_content')
      .select('*')
      .eq('shared_url', sharedUrl)
      .eq('content_type', 'report')
      .single();
    
    if (error) {
      console.error('Error fetching report by shared URL:', error);
      return { data: null, error };
    }
    
    return { data: data as SharedReport, error: null };
  } catch (error: any) {
    console.error('Error fetching report by shared URL:', error);
    return { data: null, error };
  }
};

/**
 * Obtiene un informe por cualquier tipo de ID (directo o compartido)
 */
export const fetchReportByAnyId = async (reportId: string): Promise<SharedReportResponse> => {
  try {
    // Primero intentar como URL compartida
    let response = await fetchReportBySharedUrl(reportId);
    
    if (response.data) {
      return response;
    }
    
    // Luego intentar como ID directo
    const { data, error } = await supabase.rpc('get_report_by_id', {
      report_id_param: reportId
    });
    
    if (error) {
      return { data: null, error };
    }
    
    return { 
      data: data ? data as SharedReport : null, 
      error: null 
    };
  } catch (error: any) {
    console.error('Error fetching report by any ID:', error);
    return { data: null, error };
  }
};

/**
 * Verifica si un informe existe
 */
export const checkReportExists = async (reportId: string): Promise<{ exists: boolean; error: Error | null }> => {
  try {
    const { data, error } = await supabase.rpc('check_report_exists', {
      report_id_param: reportId
    });
    
    if (error) {
      return { exists: false, error };
    }
    
    return { exists: !!data, error: null };
  } catch (error: any) {
    console.error('Error checking report existence:', error);
    return { exists: false, error };
  }
};

/**
 * Verifica si un informe está protegido con contraseña
 */
export const checkReportPassword = async (reportId: string): Promise<{ isProtected: boolean; error: Error | null }> => {
  try {
    const { data, error } = await supabase.rpc('check_report_password_protection', {
      report_id_param: reportId
    });
    
    if (error) {
      return { isProtected: false, error };
    }
    
    return { isProtected: !!data, error: null };
  } catch (error: any) {
    console.error('Error checking report password protection:', error);
    return { isProtected: false, error };
  }
};

/**
 * Verifica la contraseña de un informe
 */
export const verifyReportPassword = async (reportId: string, password: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('verify_shared_report_password', {
      report_id_param: reportId,
      password_param: password
    });
    
    return !!data;
  } catch (error) {
    console.error('Error verifying report password:', error);
    return false;
  }
};

/**
 * Actualiza un informe con contraseña
 */
export const updateReportWithPassword = async (reportId: string, password: string | null): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('reports')
      .update({ password: password })
      .eq('id', reportId);
      
    return !error;
  } catch (error) {
    console.error('Error updating report with password:', error);
    return false;
  }
};

/**
 * Registra acceso a un informe compartido
 */
export const logReportAccess = async (
  reportId: string,
  options: AccessLogOptions,
  eventType: AccessLogType = 'view'
): Promise<void> => {
  await logContentAccess('report', reportId, options, eventType);
};
